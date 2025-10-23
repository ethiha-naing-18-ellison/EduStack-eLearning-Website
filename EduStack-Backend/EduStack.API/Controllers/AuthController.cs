using EduStack.Core.DTOs.Auth;
using EduStack.Core.DTOs.Common;
using EduStack.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EduStack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="registerDto">User registration data</param>
    /// <returns>User information and JWT token</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponseDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 409)]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<object>.ErrorResult("Validation failed", errors));
            }

            var result = await _authService.RegisterAsync(registerDto);
            
            _logger.LogInformation("User registered successfully: {Email}", registerDto.Email);
            
            return CreatedAtAction(nameof(GetUser), new { id = result.User.Id }, 
                ApiResponse<LoginResponseDto>.SuccessResult(result, "User registered successfully"));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Registration failed - User already exists: {Email}", registerDto.Email);
            return Conflict(ApiResponse<object>.ErrorResult(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration: {Email}", registerDto.Email);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Login user
    /// </summary>
    /// <param name="loginDto">User login credentials</param>
    /// <returns>User information and JWT token</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<object>.ErrorResult("Validation failed", errors));
            }

            var result = await _authService.LoginAsync(loginDto);
            
            _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);
            
            return Ok(ApiResponse<LoginResponseDto>.SuccessResult(result, "Login successful"));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Login failed - Invalid credentials: {Email}", loginDto.Email);
            return Unauthorized(ApiResponse<object>.ErrorResult(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user login: {Email}", loginDto.Email);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User information</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<UserResponseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetUser(Guid id)
    {
        try
        {
            var user = await _authService.GetUserByIdAsync(id);
            return Ok(ApiResponse<UserResponseDto>.SuccessResult(user, "User retrieved successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("User not found: {UserId}", id);
            return NotFound(ApiResponse<object>.ErrorResult(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user: {UserId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error"));
        }
    }
}
