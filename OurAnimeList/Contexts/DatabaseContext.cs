using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OurAnimeList.Models;

namespace OurAnimeList.Contexts;

public sealed class DatabaseContext : DbContext
{
    public DbSet<Anime> Animes { get; set; }
    
    public DbSet<User> Users { get; set; }

    public DatabaseContext()
    {
        Database.EnsureCreated();
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySql(
            $"server=127.0.0.1;user=ouranimelist;password=ouranimelist;database=ouranimelist;", 
            new MySqlServerVersion(new Version(8, 0, 37))
        );
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Anime>()
            .Property(anime => anime.WatchingStatus)
            .HasConversion(new EnumToNumberConverter<WatchingStatus, byte>());

        modelBuilder.Entity<Anime>()
            .HasOne(anime => anime.Author)
            .WithMany(user => user.Animes)
            .HasForeignKey(anime => anime.AuthorId);
        
        modelBuilder.Entity<User>()
            .HasMany(user => user.Animes)
            .WithOne(anime => anime.Author)
            .HasForeignKey(anime => anime.AuthorId);
        
        base.OnModelCreating(modelBuilder);
    }
}