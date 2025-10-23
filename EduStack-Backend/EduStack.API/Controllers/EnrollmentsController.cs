using EduStack.Core.DTOs.Common;
using EduStack.Core.DTOs.Enrollment;
using EduStack.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EduStack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;
    private readonly ILogger<EnrollmentsController> _logger;

    public EnrollmentsController(IEnrollmentService enrollmentService, ILogger<EnrollmentsController> logger)
    {
        _enrollmentService = enrollmentService;
        _logger = logger;
    }

    /// <summary>
    /// Enroll user in a course
    /// </summary>
    /// <param name="courseId">Course ID to enroll in</param>
    /// <returns>Enrollment details</returns>
    [HttpPost("enroll/{courseId}")]
    [ProducesResponseType(typeof(ApiResponse<EnrollmentResponseDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    [ProducesResponseType(typeof(ApiResponse<object>), 409)]
    public async Task<IActionResult> EnrollInCourse(Guid courseId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var enrollment = await _enrollmentService.EnrollInCourseAsync(userId, courseId);
            
            _logger.LogInformation("User {UserId} enrolled in course {CourseId}", userId, courseId);
            
            return CreatedAtAction(nameof(GetUserEnrollments), new { userId }, 
                ApiResponse<EnrollmentResponseDto>.SuccessResult(enrollment, "Successfully enrolled in course"));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Enrollment failed - Already enrolled: User {UserId}, Course {CourseId}", GetCurrentUserId(), courseId);
            return Conflict(ApiResponse<object>.ErrorResult(ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("Enrollment failed - Course not found: {CourseId}", courseId);
            return NotFound(ApiResponse<object>.ErrorResult(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enrolling user {UserId} in course {CourseId}", GetCurrentUserId(), courseId);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get user's enrollments
    /// </summary>
    /// <returns>List of user's enrollments</returns>
    [HttpGet("my-enrollments")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<EnrollmentResponseDto>>), 200)]
    public async Task<IActionResult> GetUserEnrollments()
    {
        try
        {
            var userId = GetCurrentUserId();
            var enrollments = await _enrollmentService.GetUserEnrollmentsAsync(userId);
            
            return Ok(ApiResponse<IEnumerable<EnrollmentResponseDto>>.SuccessResult(enrollments, "User enrollments retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollments for user {UserId}", GetCurrentUserId());
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Check if user is enrolled in a course
    /// </summary>
    /// <param name="courseId">Course ID to check</param>
    /// <returns>Enrollment status</returns>
    [HttpGet("check/{courseId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<IActionResult> CheckEnrollment(Guid courseId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var isEnrolled = await _enrollmentService.IsUserEnrolledAsync(userId, courseId);
            
            return Ok(ApiResponse<object>.SuccessResult(new { isEnrolled }, "Enrollment status retrieved"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking enrollment for user {UserId} in course {CourseId}", GetCurrentUserId(), courseId);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get enrollment details for a specific course
    /// </summary>
    /// <param name="courseId">Course ID</param>
    /// <returns>Enrollment details</returns>
    [HttpGet("course/{courseId}")]
    [ProducesResponseType(typeof(ApiResponse<EnrollmentResponseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetEnrollmentByCourse(Guid courseId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var enrollment = await _enrollmentService.GetEnrollmentAsync(userId, courseId);
            
            if (enrollment == null)
            {
                return NotFound(ApiResponse<object>.ErrorResult("Enrollment not found"));
            }

            return Ok(ApiResponse<EnrollmentResponseDto>.SuccessResult(enrollment, "Enrollment retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollment for user {UserId} in course {CourseId}", GetCurrentUserId(), courseId);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID in token");
        }
        return userId;
    }
}
