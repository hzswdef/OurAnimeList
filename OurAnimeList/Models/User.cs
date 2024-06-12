using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OurAnimeList.Models;

[Table("users")]
public class User
{
    [Key]
    [Required]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [ReadOnly(true)]
    [Column("id", TypeName = "tinyint")]
    public ushort Id { get; set; }
    
    [Required]
    [ReadOnly(true)]
    [Column("email", TypeName = "varchar(64)")]
    public required string Email { get; set; }
    
    [Required]
    [ReadOnly(true)]
    [Column("username", TypeName = "varchar(32)")]
    public required string Username { get; set; }

    [Required]
    [JsonIgnore]
    public required ICollection<Anime> Animes;
}
