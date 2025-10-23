using EduStack.Core.DTOs.Common;
using EduStack.Core.DTOs.Course;
using EduStack.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
    [HttpGet]
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
}
