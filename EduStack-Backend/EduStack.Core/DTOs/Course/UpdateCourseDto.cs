using System.ComponentModel.DataAnnotations;

namespace EduStack.Core.DTOs.Course;

public class UpdateCourseDto
{
    [MaxLength(255)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    [MaxLength(500)]
    public string? Thumbnail { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
    public decimal? Price { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    [MaxLength(20)]
    [RegularExpression("^(BEGINNER|INTERMEDIATE|ADVANCED)$", ErrorMessage = "Level must be BEGINNER, INTERMEDIATE, or ADVANCED")]
    public string? Level { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Duration must be at least 1 week")]
    public int? Duration { get; set; }

    public bool? IsPublished { get; set; }
}
