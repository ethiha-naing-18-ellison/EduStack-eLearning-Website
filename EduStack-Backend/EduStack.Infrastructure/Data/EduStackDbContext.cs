using EduStack.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduStack.Infrastructure.Data;

public class EduStackDbContext : DbContext
{
    public EduStackDbContext(DbContextOptions<EduStackDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Progress> Progress { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Role).HasDefaultValue("STUDENT");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        // Course configuration
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasOne(c => c.Instructor)
                  .WithMany(u => u.CreatedCourses)
                  .HasForeignKey(c => c.InstructorId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.Property(c => c.Price).HasColumnType("decimal(10,2)");
            entity.Property(c => c.Level).HasDefaultValue("BEGINNER");
            entity.Property(c => c.IsPublished).HasDefaultValue(false);
        });

        // Enrollment configuration
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Enrollments)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Enrollments)
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.CourseId }).IsUnique();
            entity.Property(e => e.Status).HasDefaultValue("ACTIVE");
        });

        // Lesson configuration
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasOne(l => l.Course)
                  .WithMany(c => c.Lessons)
                  .HasForeignKey(l => l.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(l => l.IsPublished).HasDefaultValue(false);
        });

        // Progress configuration
        modelBuilder.Entity<Progress>(entity =>
        {
            entity.HasOne(p => p.User)
                  .WithMany(u => u.Progress)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Course)
                  .WithMany(c => c.Progress)
                  .HasForeignKey(p => p.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Lesson)
                  .WithMany()
                  .HasForeignKey(p => p.LessonId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(p => new { p.UserId, p.CourseId, p.LessonId }).IsUnique();
            entity.Property(p => p.ProgressPercentage).HasDefaultValue(0);
        });

        // Review configuration
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasOne(r => r.User)
                  .WithMany(u => u.Reviews)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Course)
                  .WithMany(c => c.Reviews)
                  .HasForeignKey(r => r.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(r => new { r.UserId, r.CourseId }).IsUnique();
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Name).IsUnique();
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Categories
        var categories = new List<Category>
        {
            new() { Id = Guid.NewGuid(), Name = "Web Development", Description = "Learn modern web development technologies", Icon = "code" },
            new() { Id = Guid.NewGuid(), Name = "Data Science", Description = "Master data analysis and machine learning", Icon = "science" },
            new() { Id = Guid.NewGuid(), Name = "UI/UX Design", Description = "Create beautiful and user-friendly interfaces", Icon = "palette" },
            new() { Id = Guid.NewGuid(), Name = "Business", Description = "Develop business and management skills", Icon = "business" },
            new() { Id = Guid.NewGuid(), Name = "Cybersecurity", Description = "Protect systems and data from threats", Icon = "security" },
            new() { Id = Guid.NewGuid(), Name = "Cloud Computing", Description = "Learn cloud platforms and services", Icon = "cloud" },
            new() { Id = Guid.NewGuid(), Name = "Mobile Development", Description = "Build mobile applications", Icon = "phone_android" },
            new() { Id = Guid.NewGuid(), Name = "Programming", Description = "Master programming fundamentals", Icon = "school" }
        };

        modelBuilder.Entity<Category>().HasData(categories);
    }
}
