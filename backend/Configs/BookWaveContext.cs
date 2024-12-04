using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Configs;

public class BookWaveContext : DbContext
{
    public BookWaveContext(DbContextOptions<BookWaveContext> options) : base(options) { }
    
    public DbSet<Book> Books { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<CreditCard> CreditCards { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.ISBN);
            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
        });

        modelBuilder.Entity<Rating>(entity =>
        {
            entity.HasKey(e => new { e.UserID, e.ISBN });
    
            entity.HasOne(r => r.Book)
                .WithMany(b => b.Ratings)
                .HasForeignKey(r => r.ISBN)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId);
            
            entity.HasOne(r => r.User)
                .WithMany(u => u.Reservations)
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(r => r.Book)
                .WithMany(b => b.Reservations)
                .HasForeignKey(r => r.ISBN)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.AddressID);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(e => e.UserID)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<CreditCard>(entity =>
        {
            entity.HasKey(e => e.CardID);
            entity.HasOne(e => e.User)
                .WithOne(u => u.CreditCard)
                .HasForeignKey<CreditCard>(e => e.UserID)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}