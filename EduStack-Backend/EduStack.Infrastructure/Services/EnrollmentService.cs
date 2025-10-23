using AutoMapper;
using EduStack.Core.DTOs.Enrollment;
using EduStack.Core.Entities;
using EduStack.Core.Interfaces;
using EduStack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EduStack.Infrastructure.Services;

public class EnrollmentService : IEnrollmentService
{
    private readonly EduStackDbContext _context;
    private readonly IMapper _mapper;

    public EnrollmentService(EduStackDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<EnrollmentResponseDto> EnrollInCourseAsync(Guid userId, Guid courseId)
    {
        // Check if user is already enrolled
        if (await IsUserEnrolledAsync(userId, courseId))
        {
            throw new InvalidOperationException("User is already enrolled in this course");
        }

        // Check if course exists and is published
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId && c.IsPublished);

        if (course == null)
        {
            throw new KeyNotFoundException("Course not found or not published");
        }

        // Create enrollment
        var enrollment = new Enrollment
        {
            UserId = userId,
            CourseId = courseId,
            Status = "ACTIVE",
            EnrolledAt = DateTime.UtcNow
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        // Return enrollment with course details
        return new EnrollmentResponseDto
        {
            Id = enrollment.Id,
            UserId = enrollment.UserId,
            CourseId = enrollment.CourseId,
            CourseTitle = course.Title,
            CourseThumbnail = course.Thumbnail,
            Status = enrollment.Status,
            EnrolledAt = enrollment.EnrolledAt,
            CompletedAt = enrollment.CompletedAt,
            ProgressPercentage = 0
        };
    }

    public async Task<IEnumerable<EnrollmentResponseDto>> GetUserEnrollmentsAsync(Guid userId)
    {
        var enrollments = await _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.EnrolledAt)
            .ToListAsync();

        return enrollments.Select(e => new EnrollmentResponseDto
        {
            Id = e.Id,
            UserId = e.UserId,
            CourseId = e.CourseId,
            CourseTitle = e.Course.Title,
            CourseThumbnail = e.Course.Thumbnail,
            Status = e.Status,
            EnrolledAt = e.EnrolledAt,
            CompletedAt = e.CompletedAt,
            ProgressPercentage = 0 // TODO: Calculate actual progress
        });
    }

    public async Task<bool> IsUserEnrolledAsync(Guid userId, Guid courseId)
    {
        return await _context.Enrollments
            .AnyAsync(e => e.UserId == userId && e.CourseId == courseId);
    }

    public async Task<EnrollmentResponseDto?> GetEnrollmentAsync(Guid userId, Guid courseId)
    {
        var enrollment = await _context.Enrollments
            .Include(e => e.Course)
            .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

        if (enrollment == null)
            return null;

        return new EnrollmentResponseDto
        {
            Id = enrollment.Id,
            UserId = enrollment.UserId,
            CourseId = enrollment.CourseId,
            CourseTitle = enrollment.Course.Title,
            CourseThumbnail = enrollment.Course.Thumbnail,
            Status = enrollment.Status,
            EnrolledAt = enrollment.EnrolledAt,
            CompletedAt = enrollment.CompletedAt,
            ProgressPercentage = 0 // TODO: Calculate actual progress
        };
    }

    public async Task<bool> UpdateEnrollmentStatusAsync(Guid enrollmentId, string status)
    {
        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.Id == enrollmentId);

        if (enrollment == null)
            return false;

        enrollment.Status = status;
        if (status == "COMPLETED")
        {
            enrollment.CompletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
