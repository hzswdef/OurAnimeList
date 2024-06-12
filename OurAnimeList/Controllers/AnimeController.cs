using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OurAnimeList.Auth;
using OurAnimeList.Contexts;
using OurAnimeList.Types;
using OurAnimeList.Models;

namespace OurAnimeList.Controllers;

[Authorize]
[ApiController]
[Route("/api/anime")]
public class AnimeController : ControllerBase
{
    private readonly DatabaseContext _databaseContext;
    private readonly HttpClient _httpClient;
    private readonly CurrentUserService _currentUserService;
    private readonly IWebHostEnvironment _webHostEnvironment;

    /// <inheritdoc />
    public AnimeController(
        DatabaseContext databaseContext,
        IHttpClientFactory httpClientFactory,
        CurrentUserService currentUserService,
        IWebHostEnvironment webHostEnvironment
        )
    {
        _databaseContext = databaseContext;
        _httpClient = httpClientFactory.CreateClient("MyAnimeList");
        _currentUserService = currentUserService;
        _webHostEnvironment = webHostEnvironment;
    }
    
    /// <returns>Path to static Anime preview image.</returns>
    private string GetAnimePreviewPath(uint id)
    {
        return Path.Combine(
            _webHostEnvironment.ContentRootPath, ".static", $"{id.ToString()}.jpg");
    }

    /// <summary>
    /// Selects anime entities without any filters.
    /// </summary>
    /// <returns>Anime entities.</returns>
    // GET: api/anime
    [HttpGet]
    public async Task<IActionResult> GetAnime()
    {
        ICollection<Anime> animes = await _databaseContext
            .Animes
            .OrderByDescending(anime => anime.AuthoredOn)
            .ToListAsync();
        
        if (animes.Count == 0)
            return NotFound(animes);

        return Ok(animes);
    }

    /// <summary>
    /// Select anime by Id.
    /// </summary>
    /// <param name="id">Anime Id.</param>
    /// <returns>Anime entity</returns>
    // GET: api/anime/28
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAnimeById(int id)
    {
        Anime? anime = await _databaseContext
            .Animes
            .Where(anime => anime.Id == id)
            .FirstOrDefaultAsync();

        if (anime is null)
            return NotFound();

        return Ok(anime);
    }
    
    /// <summary>
    /// Create anime from body.
    /// </summary>
    /// <returns>Created anime entity.</returns>
    // POST: api/anime/5
    [HttpPost]
    public async Task<IActionResult> PostAnime([FromBody] Anime anime)
    {
        if (!ModelState.IsValid)
            return UnprocessableEntity();

        anime.AuthoredOn = DateTimeOffset.Now.ToUnixTimeSeconds();

        _databaseContext.Animes.Add(anime);
        await _databaseContext.SaveChangesAsync();
        
        return Ok(anime);
    }
    
    /// <summary>
    /// Create anime entity using data from MyAnimeList.
    /// </summary>
    /// <param name="id">Anime Id on MyAnimeList.</param>
    /// <param name="status">Anime Entity WatchingStatus field value.</param>
    /// <returns>Created anime entity.</returns>
    // POST: api/anime/from-myanimelist?id=28&status=0
    [HttpPost("from-myanimelist")]
    public async Task<IActionResult> PostCreateFromMyAnimeList(
        [FromQuery(Name = "id")] uint id,
        [FromQuery(Name = "status")] WatchingStatus status)
    {
        User user;
        
        try
        {
            user = await _currentUserService.CurrentUser();
        }
        catch (Exception e)
        {
            return Unauthorized();
        }
        
        if (_databaseContext.Animes.Any(anime => anime.MyAnimeListId == id))
            return UnprocessableEntity("Already added.");
        
        HttpResponseMessage response = await _httpClient.GetAsync($"/v2/anime/{id}?fields=synopsis");
        if (!response.IsSuccessStatusCode)
            return NotFound();
        
        MyAnimeListAnimeResponse? data = JsonConvert.DeserializeObject<MyAnimeListAnimeResponse>(
            await response.Content.ReadAsStringAsync());
        if (data == null)
            return NotFound();

        Anime anime = new()
        {
            MyAnimeListId = id,
            WatchingStatus = status,
            Title = data.Title,
            Description = data.Description,
            AuthorId = user.Id,
            AuthoredOn = DateTimeOffset.Now.ToUnixTimeSeconds()
        };

        _databaseContext.Animes.Add(anime);
        await _databaseContext.SaveChangesAsync();
        
        // Download the anime preview picture and save it to static file's directory.
        HttpResponseMessage animePictureResponse = await new HttpClient().GetAsync(data.MainPicture.Medium);
        await using (FileStream fileStream = new FileStream(
                         GetAnimePreviewPath(anime.Id),
                         FileMode.CreateNew))
        {
            await animePictureResponse.Content.CopyToAsync(fileStream);
        }
        
        return Ok(anime);
    }
    
    /// <summary>
    /// Patch existing Anime entity.
    /// </summary>
    /// <body>Anime entity.</body>
    /// <returns>Patched anime entity.</returns>
    // PATCH: api/anime
    [HttpPatch]
    public async Task<IActionResult> PatchAnime([FromBody] Anime anime)
    {
        if (!ModelState.IsValid)
            return UnprocessableEntity();

        if (!_databaseContext.Animes.Any(entity => entity.Id == anime.Id))
            return NotFound();

        _databaseContext.Animes.Update(anime);
        await _databaseContext.SaveChangesAsync();
        
        return Ok(anime);
    }
    
    /// <summary>
    /// Delete Anime entity by ID.
    /// </summary>
    /// <param name="id">Anime entity ID.</param>
    /// <returns>200 if deleted. 404 if nothing to delete.</returns>
    // PATCH: api/anime/28
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAnime(uint id)
    {
        if (!_databaseContext.Animes.Any(entity => entity.Id == id))
            return NotFound();

        if (System.IO.File.Exists(GetAnimePreviewPath(id)))
            System.IO.File.Delete(GetAnimePreviewPath(id));
        
        await _databaseContext
            .Animes
            .Where(entity => entity.Id == id)
            .ExecuteDeleteAsync();
        
        return Ok();
    }
}
