using EduStack.Core.DTOs.Enrollment;

namespace EduStack.Core.Interfaces;

public interface IEnrollmentService
{
    Task<EnrollmentResponseDto> EnrollInCourseAsync(Guid userId, Guid courseId);
    Task<IEnumerable<EnrollmentResponseDto>> GetUserEnrollmentsAsync(Guid userId);
    Task<bool> IsUserEnrolledAsync(Guid userId, Guid courseId);
    Task<EnrollmentResponseDto?> GetEnrollmentAsync(Guid userId, Guid courseId);
    Task<bool> UpdateEnrollmentStatusAsync(Guid enrollmentId, string status);
}
