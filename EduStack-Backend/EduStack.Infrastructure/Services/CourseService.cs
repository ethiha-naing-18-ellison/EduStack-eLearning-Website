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

    public async Task<CourseResponseDto> CreateCourseAsync(CreateCourseDto courseDto, Guid instructorId)
    {
        var course = new Core.Entities.Course
        {
            Id = Guid.NewGuid(),
            Title = courseDto.Title,
            Description = courseDto.Description,
            Thumbnail = courseDto.Thumbnail,
            Price = courseDto.Price,
            Category = courseDto.Category,
            Level = courseDto.Level.ToUpper(),
            Duration = courseDto.Duration,
            InstructorId = instructorId,
            IsPublished = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        // Load the course with related data
        var createdCourse = await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Reviews)
            .Include(c => c.Enrollments)
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == course.Id);

        return MapToCourseResponseDto(createdCourse!);
    }

    public async Task<CourseResponseDto?> UpdateCourseAsync(Guid courseId, UpdateCourseDto courseDto, Guid instructorId)
    {
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == instructorId);

        if (course == null)
            return null;

        // Update only provided fields
        if (!string.IsNullOrEmpty(courseDto.Title))
            course.Title = courseDto.Title;
        
        if (!string.IsNullOrEmpty(courseDto.Description))
            course.Description = courseDto.Description;
        
        if (!string.IsNullOrEmpty(courseDto.Thumbnail))
            course.Thumbnail = courseDto.Thumbnail;
        
        if (courseDto.Price.HasValue)
            course.Price = courseDto.Price.Value;
        
        if (!string.IsNullOrEmpty(courseDto.Category))
            course.Category = courseDto.Category;
        
        if (!string.IsNullOrEmpty(courseDto.Level))
            course.Level = courseDto.Level.ToUpper();
        
        if (courseDto.Duration.HasValue)
            course.Duration = courseDto.Duration.Value;
        
        if (courseDto.IsPublished.HasValue)
            course.IsPublished = courseDto.IsPublished.Value;

        course.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Load the course with related data
        var updatedCourse = await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Reviews)
            .Include(c => c.Enrollments)
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == courseId);

        return MapToCourseResponseDto(updatedCourse!);
    }

    public async Task<bool> DeleteCourseAsync(Guid courseId, Guid instructorId)
    {
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == instructorId);

        if (course == null)
            return false;

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return true;
    }

    private CourseResponseDto MapToCourseResponseDto(Core.Entities.Course course)
    {
        var averageRating = course.Reviews?.Any() == true ? course.Reviews.Average(r => r.Rating) : 0;
        var totalStudents = course.Enrollments?.Count ?? 0;
        var totalLessons = course.Lessons?.Count ?? 0;

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
            InstructorName = course.Instructor?.FullName ?? "Unknown Instructor",
            InstructorAvatar = course.Instructor?.Avatar ?? "",
            IsPublished = course.IsPublished,
            CreatedAt = course.CreatedAt,
            AverageRating = Math.Round(averageRating, 1),
            TotalReviews = course.Reviews?.Count ?? 0,
            TotalStudents = totalStudents,
            TotalLessons = totalLessons
        };
    }
}
