using AutoMapper;
using EduStack.Core.DTOs.Course;
using EduStack.Core.Interfaces;
using EduStack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EduStack.Infrastructure.Services;

public class CourseService : ICourseService
{
    private readonly EduStackDbContext _context;
    private readonly IMapper _mapper;

    public CourseService(EduStackDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CourseResponseDto>> GetAllCoursesAsync()
    {
        var courses = await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Reviews)
            .Include(c => c.Enrollments)
            .Include(c => c.Lessons)
            .Where(c => c.IsPublished)
            .ToListAsync();

        return courses.Select(MapToCourseResponseDto);
    }

    public async Task<IEnumerable<CourseResponseDto>> GetFeaturedCoursesAsync()
    {
        var courses = await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Reviews)
            .Include(c => c.Enrollments)
            .Include(c => c.Lessons)
            .Where(c => c.IsPublished)
            .OrderByDescending(c => c.Enrollments.Count)
            .Take(6)
            .ToListAsync();

        return courses.Select(MapToCourseResponseDto);
    }

    public async Task<IEnumerable<CourseResponseDto>> GetCoursesByCategoryAsync(string category)
    {
        var courses = await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Reviews)
            .Include(c => c.Enrollments)
            .Include(c => c.Lessons)
            .Where(c => c.IsPublished && c.Category == category)
            .ToListAsync();

        return courses.Select(MapToCourseResponseDto);
    }

    public async Task<CourseResponseDto?> GetCourseByIdAsync(Guid courseId)
    {
        var course = await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Reviews)
            .Include(c => c.Enrollments)
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == courseId && c.IsPublished);

        return course != null ? MapToCourseResponseDto(course) : null;
    }

    public async Task<IEnumerable<CourseResponseDto>> GetCoursesByInstructorAsync(Guid instructorId)
    {
        var courses = await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Reviews)
            .Include(c => c.Enrollments)
            .Include(c => c.Lessons)
            .Where(c => c.InstructorId == instructorId && c.IsPublished)
            .ToListAsync();

        return courses.Select(MapToCourseResponseDto);
    }

    private CourseResponseDto MapToCourseResponseDto(Core.Entities.Course course)
    {
        var averageRating = course.Reviews.Any() ? course.Reviews.Average(r => r.Rating) : 0;
        var totalStudents = course.Enrollments.Count;
        var totalLessons = course.Lessons.Count;

        return new CourseResponseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Thumbnail = course.Thumbnail,
            Price = course.Price,
            Category = course.Category,
            Level = course.Level,
            Duration = course.Duration,
            InstructorId = course.InstructorId,
            InstructorName = course.Instructor.FullName,
            InstructorAvatar = course.Instructor.Avatar,
            IsPublished = course.IsPublished,
            CreatedAt = course.CreatedAt,
            AverageRating = Math.Round(averageRating, 1),
            TotalReviews = course.Reviews.Count,
            TotalStudents = totalStudents,
            TotalLessons = totalLessons
        };
    }
}
