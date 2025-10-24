using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduStack.Core.Entities;

public class Lesson
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [MaxLength(500)]
    public string? VideoUrl { get; set; }

    [Required]
    public int Duration { get; set; } // in minutes

    [Required]
    [Column("OrderIndex")]
    public int Order { get; set; }

    [Required]
    public Guid CourseId { get; set; }

    public bool IsPublished { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    [ForeignKey("CourseId")]
    public virtual Course Course { get; set; } = null!;
}
