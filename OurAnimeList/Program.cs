using System.Net.Http.Headers;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OurAnimeList.Auth;
using OurAnimeList.Contexts;
using OurAnimeList.Helpers;
using OurAnimeList.Middlewares;

IConfigurationRoot config = new ConfigurationBuilder()
    .AddUserSecrets<Program>()
    .Build();
new UserSecretsValidation().Validate(config);

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddMvc();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<CurrentUserService>();
builder.Services.AddTransient<JwtGenerateService>();
builder.Services.AddHttpClient("MyAnimeList", client =>
{
    client.BaseAddress = new Uri("https://api.myanimelist.net");
    client.DefaultRequestHeaders.Add("X-MAL-CLIENT-ID", config["MyAnimeList:ClientId"]!);
    client.DefaultRequestHeaders.Accept.Add(
        new MediaTypeWithQualityHeaderValue("application/json"));
});
builder.Services.AddHttpClient("GoogleApi", client =>
{
    client.BaseAddress = new Uri("https://www.googleapis.com");
    client.DefaultRequestHeaders.Accept.Add(
        new MediaTypeWithQualityHeaderValue("application/json"));
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
         {
             ValidateIssuer = true,
             ValidateAudience = true,
             ValidateLifetime = true,
             ValidateIssuerSigningKey = true,
             ValidIssuer = config["Jwt:Issuer"]!,
             ValidAudience = config["Jwt:Audience"]!,
             IssuerSigningKey = new SymmetricSecurityKey(
                 Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
             ClockSkew = TimeSpan.Zero
         };
    });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        corsPolicyBuilder =>
        {
            corsPolicyBuilder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "OurAnimeList API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

string staticFilesPath = Path.Combine(builder.Environment.ContentRootPath, ".static");
if (!Directory.Exists(staticFilesPath))
{
    Directory.CreateDirectory(staticFilesPath);
}

app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseCors("AllowAll");
app.UseMiddleware<AppMiddleware>();
app.UseStaticFiles(new StaticFileOptions 
{
    FileProvider = new PhysicalFileProvider(staticFilesPath),
    RequestPath = "/static"
});
app.Run();