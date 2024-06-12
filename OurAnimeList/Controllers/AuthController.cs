using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OurAnimeList.Auth;
using OurAnimeList.Contexts;
using OurAnimeList.Models;
using OurAnimeList.Types;

namespace OurAnimeList.Controllers;

[AllowAnonymous]
[ApiController]
[Route("/api/user/auth")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly DatabaseContext _databaseContext;
    private readonly HttpClient _httpClient;
    private readonly JwtGenerateService _jwtGenerateService;
    private readonly IConfiguration _config;

    /// <inheritdoc />
    public AuthController(
        ILogger<AuthController> logger,
        DatabaseContext databaseContext,
        IHttpClientFactory httpClientFactory,
        JwtGenerateService jwtGenerateService,
        IConfiguration config
        )
    {
        _logger = logger;
        _databaseContext = databaseContext;
        _httpClient = httpClientFactory.CreateClient("GoogleApi");
        _jwtGenerateService = jwtGenerateService;
        _config = config;
    }
    
    /// <summary>
    /// Generate Jwt Token if the given access token is valid and if the User with the given Google Email exist.
    /// </summary>
    /// <returns>Jwt Token if authorized.</returns>
    // POST: api/user/auth/google
    [HttpPost("google")]
    public async Task<IActionResult> Auth([FromBody] UserAuthEndpointPostData dataUserAuth)
    {
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", dataUserAuth.AccessToken);
        
        // Get the basic info of Google User by its access token.
        HttpResponseMessage response = await _httpClient.GetAsync("/oauth2/v1/userinfo");
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Failed to validate Google access token.");
            return Forbid();
        }
        
        GoogleApiUserInfoResponse? data = JsonConvert.DeserializeObject<GoogleApiUserInfoResponse>(
            await response.Content.ReadAsStringAsync());
        if (data == null)
        {
            _logger.LogWarning("Failed to deserialize Google User Info response.");
            return Forbid();
        }
        
        User? user = await _databaseContext
            .Users
            .Where(user => user.Email == data.Email)
            .FirstOrDefaultAsync();
        if (user == null)
        {
            _logger.LogWarning("Unauthorized User tried to signin. Email: {}", data.Email);
            return Forbid();
        }
        
        string token = _jwtGenerateService.GenerateJwt(user);
        
        _logger.LogInformation("Authenticated: UID {}, {}", user.Id, user.Email);

        return Ok(new AuthenticatedResponse { Token = token });
    }
    
}
