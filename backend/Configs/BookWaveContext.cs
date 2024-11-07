using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Configs;

public class BookWaveContext : DbContext
{
    public BookWaveContext(DbContextOptions<BookWaveContext> options) : base(options) { }
    
    public DbSet<Book> Books { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.ISBN);
        
            entity.Property(e => e.ImageUrlSmall)
                .HasColumnName("ImageURLSmall");
            
            entity.Property(e => e.ImageUrlMedium)
                .HasColumnName("ImageURLMedium");
            
            entity.Property(e => e.ImageUrlLarge)
                .HasColumnName("ImageURLLarge");
            
            entity.Property(e => e.IsAvailable)
                .HasDefaultValue(true);
        });
            
        modelBuilder.Entity<Rating>()
            .HasOne(r => r.User)
            .WithMany(u => u.Ratings)
            .HasForeignKey(r => r.UserID);
            
        modelBuilder.Entity<Rating>()
            .HasOne(r => r.Book)
            .WithMany(b => b.Ratings)
            .HasForeignKey(r => r.ISBN);
    }
}