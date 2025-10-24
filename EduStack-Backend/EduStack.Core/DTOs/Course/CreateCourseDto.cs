using System.ComponentModel.DataAnnotations;

namespace EduStack.Core.DTOs.Course;

public class CreateCourseDto
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Thumbnail { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [RegularExpression("^(BEGINNER|INTERMEDIATE|ADVANCED)$", ErrorMessage = "Level must be BEGINNER, INTERMEDIATE, or ADVANCED")]
    public string Level { get; set; } = "BEGINNER";

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Duration must be at least 1 week")]
    public int Duration { get; set; }
}
