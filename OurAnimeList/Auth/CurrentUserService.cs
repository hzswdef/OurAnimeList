using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using OurAnimeList.Contexts;
using OurAnimeList.Models;

namespace OurAnimeList.Auth;

public class CurrentUserService(
    DatabaseContext databaseContext,
    IHttpContextAccessor httpContextAccessor)
{
    public async Task<User> CurrentUser()
    {
        if (httpContextAccessor.HttpContext?.User == null)
            throw new Exception("User Context not found.");
        
        Claim? userIdClaim = httpContextAccessor.HttpContext?.User.Claims
            .FirstOrDefault(claim => claim.Type == "user_id");
        if (userIdClaim == null)
            throw new Exception("User ID not found in claims.");

        ushort userId = Convert.ToUInt16(userIdClaim.Value);
        User? user = await databaseContext
            .Users
            .Where(user => user.Id == userId)
            .FirstOrDefaultAsync();

        if (user == null)
            throw new Exception("User not found.");
        
        return user;
    }
}