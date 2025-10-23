namespace EduStack.Core.DTOs.Course;

public class CourseResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public int Duration { get; set; }
    public Guid InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public string? InstructorAvatar { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalStudents { get; set; }
    public int TotalLessons { get; set; }
}
