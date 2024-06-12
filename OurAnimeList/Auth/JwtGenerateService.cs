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
        List<Claim> claims =
        [
            new Claim("user_id", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.Ticks.ToString(), ClaimValueTypes.Integer64)
        ];
        SymmetricSecurityKey securityKey = new (Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        SigningCredentials credentials = new (securityKey, SecurityAlgorithms.HmacSha256);
        JwtSecurityToken jwtSecurityToken = new (
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(30),
            signingCredentials: credentials);

        string token = new JwtSecurityTokenHandler()
            .WriteToken(jwtSecurityToken);
        
        logger.LogInformation("Generated Jwt token for UID {}.", user.Id);

        return token;
    }
}