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

        // Configure table names to match existing database
        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Course>().ToTable("courses");
        modelBuilder.Entity<Enrollment>().ToTable("enrollments");
        modelBuilder.Entity<Lesson>().ToTable("lessons");
        modelBuilder.Entity<Progress>().ToTable("progress");
        modelBuilder.Entity<Review>().ToTable("reviews");
        modelBuilder.Entity<Category>().ToTable("categories");

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Role).HasDefaultValue("STUDENT");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            
            // Map column names to match database
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.PasswordHash).HasColumnName("passwordhash");
            entity.Property(e => e.FullName).HasColumnName("fullname");
            entity.Property(e => e.Role).HasColumnName("role");
            entity.Property(e => e.Avatar).HasColumnName("avatar");
            entity.Property(e => e.IsActive).HasColumnName("isactive");
            entity.Property(e => e.CreatedAt).HasColumnName("createdat");
            entity.Property(e => e.UpdatedAt).HasColumnName("updatedat");
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
            
            // Map column names to match database
            entity.Property(c => c.Id).HasColumnName("id");
            entity.Property(c => c.Title).HasColumnName("title");
            entity.Property(c => c.Description).HasColumnName("description");
            entity.Property(c => c.Thumbnail).HasColumnName("thumbnail");
            entity.Property(c => c.Price).HasColumnName("price");
            entity.Property(c => c.Category).HasColumnName("category");
            entity.Property(c => c.Level).HasColumnName("level");
            entity.Property(c => c.Duration).HasColumnName("duration");
            entity.Property(c => c.InstructorId).HasColumnName("instructorid");
            entity.Property(c => c.IsPublished).HasColumnName("ispublished");
            entity.Property(c => c.CreatedAt).HasColumnName("createdat");
            entity.Property(c => c.UpdatedAt).HasColumnName("updatedat");
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
            
            // Map column names to match database
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("userid");
            entity.Property(e => e.CourseId).HasColumnName("courseid");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.EnrolledAt).HasColumnName("enrolledat");
            entity.Property(e => e.CompletedAt).HasColumnName("completedat");
        });

        // Lesson configuration
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasOne(l => l.Course)
                  .WithMany(c => c.Lessons)
                  .HasForeignKey(l => l.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(l => l.IsPublished).HasDefaultValue(false);
            
            // Map column names to match database
            entity.Property(l => l.Id).HasColumnName("id");
            entity.Property(l => l.Title).HasColumnName("title");
            entity.Property(l => l.Description).HasColumnName("description");
            entity.Property(l => l.VideoUrl).HasColumnName("videourl");
            entity.Property(l => l.Duration).HasColumnName("duration");
            entity.Property(l => l.Order).HasColumnName("order");
            entity.Property(l => l.CourseId).HasColumnName("courseid");
            entity.Property(l => l.IsPublished).HasColumnName("ispublished");
            entity.Property(l => l.CreatedAt).HasColumnName("createdat");
            entity.Property(l => l.UpdatedAt).HasColumnName("updatedat");
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
            
            // Map column names to match database
            entity.Property(p => p.Id).HasColumnName("id");
            entity.Property(p => p.UserId).HasColumnName("userid");
            entity.Property(p => p.CourseId).HasColumnName("courseid");
            entity.Property(p => p.LessonId).HasColumnName("lessonid");
            entity.Property(p => p.ProgressPercentage).HasColumnName("progresspercentage");
            entity.Property(p => p.CompletedAt).HasColumnName("completedat");
            entity.Property(p => p.CreatedAt).HasColumnName("createdat");
            entity.Property(p => p.UpdatedAt).HasColumnName("updatedat");
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
            
            // Map column names to match database
            entity.Property(r => r.Id).HasColumnName("id");
            entity.Property(r => r.UserId).HasColumnName("userid");
            entity.Property(r => r.CourseId).HasColumnName("courseid");
            entity.Property(r => r.Rating).HasColumnName("rating");
            entity.Property(r => r.Comment).HasColumnName("comment");
            entity.Property(r => r.CreatedAt).HasColumnName("createdat");
            entity.Property(r => r.UpdatedAt).HasColumnName("updatedat");
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Name).IsUnique();
            
            // Map column names to match database
            entity.Property(c => c.Id).HasColumnName("id");
            entity.Property(c => c.Name).HasColumnName("name");
            entity.Property(c => c.Description).HasColumnName("description");
            entity.Property(c => c.Icon).HasColumnName("icon");
            entity.Property(c => c.CreatedAt).HasColumnName("createdat");
            entity.Property(c => c.UpdatedAt).HasColumnName("updatedat");
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
