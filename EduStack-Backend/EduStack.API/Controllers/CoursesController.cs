using EduStack.Core.DTOs.Common;
using EduStack.Core.DTOs.Course;
using EduStack.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EduStack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly ILogger<CoursesController> _logger;

    public CoursesController(ICourseService courseService, ILogger<CoursesController> logger)
    {
        _courseService = courseService;
        _logger = logger;
    }

    /// <summary>
    /// Get all published courses
    /// </summary>
    /// <returns>List of all courses</returns>
    [HttpGet("all")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseResponseDto>>), 200)]
    public async Task<IActionResult> GetAllCourses()
    {
        try
        {
            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(ApiResponse<IEnumerable<CourseResponseDto>>.SuccessResult(courses, "Courses retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all courses");
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get featured courses (most popular)
    /// </summary>
    /// <returns>List of featured courses</returns>
    [HttpGet("featured")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseResponseDto>>), 200)]
    public async Task<IActionResult> GetFeaturedCourses()
    {
        try
        {
            var courses = await _courseService.GetFeaturedCoursesAsync();
            return Ok(ApiResponse<IEnumerable<CourseResponseDto>>.SuccessResult(courses, "Featured courses retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured courses");
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get courses by category
    /// </summary>
    /// <param name="category">Course category</param>
    /// <returns>List of courses in the specified category</returns>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseResponseDto>>), 200)]
    public async Task<IActionResult> GetCoursesByCategory(string category)
    {
        try
        {
            var courses = await _courseService.GetCoursesByCategoryAsync(category);
            return Ok(ApiResponse<IEnumerable<CourseResponseDto>>.SuccessResult(courses, $"Courses in {category} category retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving courses by category: {Category}", category);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get course by ID
    /// </summary>
    /// <param name="id">Course ID</param>
    /// <returns>Course details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<CourseResponseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetCourseById(Guid id)
    {
        try
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null)
            {
                return NotFound(ApiResponse<object>.ErrorResult("Course not found"));
            }

            return Ok(ApiResponse<CourseResponseDto>.SuccessResult(course, "Course retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving course: {CourseId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get courses by instructor
    /// </summary>
    /// <param name="instructorId">Instructor ID</param>
    /// <returns>List of courses by the instructor</returns>
    [HttpGet("instructor/{instructorId}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseResponseDto>>), 200)]
    public async Task<IActionResult> GetCoursesByInstructor(Guid instructorId)
    {
        try
        {
            var courses = await _courseService.GetCoursesByInstructorAsync(instructorId);
            return Ok(ApiResponse<IEnumerable<CourseResponseDto>>.SuccessResult(courses, "Instructor courses retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving courses by instructor: {InstructorId}", instructorId);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Create a new course (Instructor only)
    /// </summary>
    /// <param name="courseDto">Course creation data</param>
    /// <returns>Created course</returns>
    [HttpPost]
    [Authorize(Roles = "INSTRUCTOR")]
    [ProducesResponseType(typeof(ApiResponse<CourseResponseDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto courseDto)
    {
        try
        {
            var instructorId = GetCurrentUserId();
            var course = await _courseService.CreateCourseAsync(courseDto, instructorId);
            
            _logger.LogInformation("Course created by instructor {InstructorId}: {CourseId}", instructorId, course.Id);
            
            return CreatedAtAction(nameof(GetCourseById), new { id = course.Id }, 
                ApiResponse<CourseResponseDto>.SuccessResult(course, "Course created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating course for instructor {InstructorId}", GetCurrentUserId());
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Update a course (Instructor only)
    /// </summary>
    /// <param name="id">Course ID</param>
    /// <param name="courseDto">Course update data</param>
    /// <returns>Updated course</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = "INSTRUCTOR")]
    [ProducesResponseType(typeof(ApiResponse<CourseResponseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] UpdateCourseDto courseDto)
    {
        try
        {
            // Log the incoming data for debugging
            _logger.LogInformation("UpdateCourse called with ID: {CourseId}, Data: {@CourseDto}", id, courseDto);
            
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value!.Errors.Select(e => $"{x.Key}: {e.ErrorMessage}"))
                    .ToList();
                
                _logger.LogWarning("Validation errors: {@Errors}", errors);
                return BadRequest(ApiResponse<object>.ErrorResult("Validation failed", errors));
            }
            
            var instructorId = GetCurrentUserId();
            var course = await _courseService.UpdateCourseAsync(id, courseDto, instructorId);
            
            if (course == null)
            {
                return NotFound(ApiResponse<object>.ErrorResult("Course not found or you don't have permission to update it"));
            }

            _logger.LogInformation("Course updated by instructor {InstructorId}: {CourseId}", instructorId, id);
            
            return Ok(ApiResponse<CourseResponseDto>.SuccessResult(course, "Course updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating course {CourseId} by instructor {InstructorId}", id, GetCurrentUserId());
            return StatusCode(500, ApiResponse<object>.ErrorResult($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Delete a course (Instructor only)
    /// </summary>
    /// <param name="id">Course ID</param>
    /// <returns>Success message</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "INSTRUCTOR")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        try
        {
            var instructorId = GetCurrentUserId();
            var success = await _courseService.DeleteCourseAsync(id, instructorId);
            
            if (!success)
            {
                return NotFound(ApiResponse<object>.ErrorResult("Course not found or you don't have permission to delete it"));
            }

            _logger.LogInformation("Course deleted by instructor {InstructorId}: {CourseId}", instructorId, id);
            
            return Ok(ApiResponse<object>.SuccessResult(new { }, "Course deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting course {CourseId} by instructor {InstructorId}", id, GetCurrentUserId());
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get instructor's own courses
    /// </summary>
    /// <returns>List of instructor's courses</returns>
    [HttpGet("my-courses")]
    [Authorize(Roles = "INSTRUCTOR")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseResponseDto>>), 200)]
    public async Task<IActionResult> GetMyCourses()
    {
        try
        {
            var instructorId = GetCurrentUserId();
            var courses = await _courseService.GetCoursesByInstructorAsync(instructorId);
            
            return Ok(ApiResponse<IEnumerable<CourseResponseDto>>.SuccessResult(courses, "Your courses retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving courses for instructor {InstructorId}", GetCurrentUserId());
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
