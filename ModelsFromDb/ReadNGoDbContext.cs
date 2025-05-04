using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ReadNGo_Group2_C20.ModelsFromDb;

public partial class ReadNGoDbContext : DbContext
{
    public ReadNGoDbContext()
    {
    }

    public ReadNGoDbContext(DbContextOptions<ReadNGoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WishlistItem> WishlistItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=ReadNGoDB;User Id=postgres;Password=1024");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasIndex(e => e.BookId, "IX_CartItems_BookId");

            entity.HasIndex(e => e.UserId, "IX_CartItems_UserId");

            entity.HasOne(d => d.Book).WithMany(p => p.CartItems).HasForeignKey(d => d.BookId);

            entity.HasOne(d => d.User).WithMany(p => p.CartItems).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Orders_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.Orders).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasIndex(e => e.BookId, "IX_OrderItems_BookId");

            entity.HasIndex(e => e.OrderId, "IX_OrderItems_OrderId");

            entity.Property(e => e.OrderId).HasDefaultValue(0);

            entity.HasOne(d => d.Book).WithMany(p => p.OrderItems).HasForeignKey(d => d.BookId);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems).HasForeignKey(d => d.OrderId);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasIndex(e => e.BookId, "IX_Reviews_BookId");

            entity.HasIndex(e => e.UserId, "IX_Reviews_UserId");

            entity.HasOne(d => d.Book).WithMany(p => p.Reviews).HasForeignKey(d => d.BookId);

            entity.HasOne(d => d.User).WithMany(p => p.Reviews).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email, "IX_Users_Email").IsUnique();
        });

        modelBuilder.Entity<WishlistItem>(entity =>
        {
            entity.HasIndex(e => e.BookId, "IX_WishlistItems_BookId");

            entity.HasIndex(e => e.UserId, "IX_WishlistItems_UserId");

            entity.HasOne(d => d.Book).WithMany(p => p.WishlistItems).HasForeignKey(d => d.BookId);

            entity.HasOne(d => d.User).WithMany(p => p.WishlistItems).HasForeignKey(d => d.UserId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
