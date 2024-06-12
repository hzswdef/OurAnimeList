using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurAnimeList.Auth;
using OurAnimeList.Contexts;
using OurAnimeList.Models;

namespace OurAnimeList.Controllers;

[Authorize]
[ApiController]
[Route("/api/user")]
public class UserController : ControllerBase
{
    private readonly DatabaseContext _databaseContext;
    private readonly CurrentUserService _currentUserService;

    /// <inheritdoc />
    public UserController(
        DatabaseContext databaseContext,
        CurrentUserService currentUserService)
    {
        _databaseContext = databaseContext;
        _currentUserService = currentUserService;
    }
    
    /// <summary>
    /// Selects Current User entity.
    /// </summary>
    /// <returns>Current User.</returns>
    // GET: api/user
    [HttpGet]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            User user = await _currentUserService.CurrentUser();
            
            return Ok(user);
        }
        catch (Exception e)
        {
            return Unauthorized();
        }
    }

    /// <summary>
    /// Selects User entity by ID.
    /// </summary>
    /// <returns>User entity.</returns>
    // GET: api/user/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        User? user = await _databaseContext
            .Users
            .Where(user => user.Id == id)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }
}
