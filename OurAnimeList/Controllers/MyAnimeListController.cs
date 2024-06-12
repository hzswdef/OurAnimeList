using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OurAnimeList.Types;

namespace OurAnimeList.Controllers;

[Authorize]
[ApiController]
[Route("/api/myanimelist")]
public class MyAnimeListController : ControllerBase
{
    private readonly HttpClient _httpClient;
    
    /// <inheritdoc />
    public MyAnimeListController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("MyAnimeList");
    }

    /// <summary>
    /// Select anime entities by its title on MyAnimeList.
    /// </summary>
    /// <returns>Anime entities.</returns>
    // GET: api/myanimelist/search/demon slayer
    [HttpGet("search/{title}")]
    public async Task<IActionResult> Search(string title)
    {
        HttpResponseMessage response = await _httpClient.GetAsync($"/v2/anime?q={title}&fields=synopsis&limit=10");
        if (!response.IsSuccessStatusCode)
            return NotFound();
        
        MyAnimeListSearchResponse? data = JsonConvert.DeserializeObject<MyAnimeListSearchResponse>(
            await response.Content.ReadAsStringAsync());
        if (data == null)
            return NotFound();

        return Ok(data);
    }
}