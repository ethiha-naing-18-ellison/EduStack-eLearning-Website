using AutoMapper;
using BCrypt.Net;
using EduStack.Core.DTOs.Auth;
using EduStack.Core.Entities;
using EduStack.Core.Interfaces;
using EduStack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EduStack.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly EduStackDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(EduStackDbContext context, IMapper mapper, IConfiguration configuration)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> RegisterAsync(RegisterUserDto registerDto)
    {
        // Check if user already exists
        if (await UserExistsAsync(registerDto.Email))
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        // Create user
        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            FullName = registerDto.FullName,
            Role = registerDto.Role,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            User = _mapper.Map<UserResponseDto>(user),
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
    }

    public async Task<LoginResponseDto> LoginAsync(LoginUserDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Generate JWT token
        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            User = _mapper.Map<UserResponseDto>(user),
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
    }

    public async Task<UserResponseDto> GetUserByIdAsync(Guid userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return _mapper.Map<UserResponseDto>(user);
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-here-make-it-very-long-and-secure";
        var issuer = jwtSettings["Issuer"] ?? "EduStack";
        var audience = jwtSettings["Audience"] ?? "EduStack-Users";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
