using Newtonsoft.Json;

namespace OurAnimeList.Types;

public class MyAnimeListSearchResponse
{
    [JsonProperty("data")]
    public required List<AnimeData> Data { get; set; }
}

public class AnimeData
{
    [JsonProperty("node")]
    public required AnimeNode Node { get; set; }
}

public class AnimeNode
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("title")]
    public required string Title { get; set; }
    
    [JsonProperty("synopsis")]
    public required string Description { get; set; }

    [JsonProperty("main_picture")]
    public required MainPicture MainPicture { get; set; }
}
