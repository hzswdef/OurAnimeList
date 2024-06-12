using Newtonsoft.Json;

namespace OurAnimeList.Types;

public class MyAnimeListAnimeResponse
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("title")]
    public required string Title { get; set; }

    [JsonProperty("main_picture")]
    public required MainPicture MainPicture { get; set; }
    
    [JsonProperty("synopsis")]
    public required string Description { get; set; }
}

public class MainPicture
{
    [JsonProperty("medium")]
    public string Medium { get; set; }

    [JsonProperty("large")]
    public string Large { get; set; }
}

