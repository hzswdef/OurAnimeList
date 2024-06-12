using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OurAnimeList.Models;

public enum WatchingStatus: byte
{
    Planning = 0,
    Watching = 1,
    Finished = 2,
    Abandoned = 3
}

[Table("anime")]
public class Anime
{
    [Key]
    [Required]
    [ReadOnly(true)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", TypeName = "int(10)")]
    public uint Id { get; set; }
    
    [Required]
    [ReadOnly(true)]
    [Column("myanimelist_id", TypeName = "int(10)")]
    public uint MyAnimeListId { get; set; }
    
    [Required]
    [Column("watching_status", TypeName = "int(1)")]
    public WatchingStatus WatchingStatus { get; set; }

    [Required]
    [ReadOnly(true)]
    [Column("title", TypeName = "varchar(64)")]
    public required string Title { get; set; }
    
    [Required]
    [ReadOnly(true)]
    [Column("description", TypeName = "varchar(4096)")]
    public required string Description { get; set; }
    
    [Required]
    [ReadOnly(true)]
    [Column("author_id", TypeName = "tinyint")]
    public ushort AuthorId { get; set; }

    [Required]
    [JsonIgnore]
    public User? Author;

    [Required]
    [ReadOnly(true)]
    [Column("authored_on", TypeName = "int(11)")]
    public long AuthoredOn { get; set; }
}
