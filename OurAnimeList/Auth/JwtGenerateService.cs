using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using OurAnimeList.Models;

namespace OurAnimeList.Auth;

public class JwtGenerateService(
    ILogger<JwtGenerateService> logger,
    IConfiguration config)
{
    public string GenerateJwt(User user)
    {
        JwtSecurityTokenHandler tokenHandler = new();
        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        SigningCredentials credentials = new(securityKey, SecurityAlgorithms.HmacSha256);
        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Issuer = config["Jwt:Issuer"],
            Audience = config["Jwt:Audience"],
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddHours(1),
            Subject = GenerateClaims(user)
        };
        SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);
        string jwtToken = tokenHandler.WriteToken(securityToken);
        
        logger.LogInformation("Generated Jwt token for UID {}.", user.Id);

        return jwtToken;
    }

    private static ClaimsIdentity GenerateClaims(User user)
    {
        ClaimsIdentity claimsIdentity = new();
        
        claimsIdentity.AddClaim(new Claim("user_id", user.Id.ToString()));
        claimsIdentity.AddClaim(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
        claimsIdentity.AddClaim(new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.Ticks.ToString(), ClaimValueTypes.Integer64));

        return claimsIdentity;
    }
}