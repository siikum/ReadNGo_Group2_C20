using Microsoft.EntityFrameworkCore;
using ReadNGo_Group2_C20.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace ReadNGo.DBContext
{
    public class ReadNGoContext : DbContext
    {
        public ReadNGoContext(DbContextOptions<ReadNGoContext> options) : base(options)
        {
        }

        // 👇 Add your DbSet models here
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<WishlistItem> WishlistItems { get; set; }
        public DbSet<Announcement> Announcements { get; set; }

        // optional: customize table names etc.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example: Set unique email for User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
