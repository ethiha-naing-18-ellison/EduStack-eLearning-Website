using EduStack.Core.DTOs.Course;

namespace EduStack.Core.Interfaces;

public interface ICourseService
{
    Task<IEnumerable<CourseResponseDto>> GetAllCoursesAsync();
    Task<IEnumerable<CourseResponseDto>> GetFeaturedCoursesAsync();
    Task<IEnumerable<CourseResponseDto>> GetCoursesByCategoryAsync(string category);
    Task<CourseResponseDto?> GetCourseByIdAsync(Guid courseId);
    Task<IEnumerable<CourseResponseDto>> GetCoursesByInstructorAsync(Guid instructorId);
}
