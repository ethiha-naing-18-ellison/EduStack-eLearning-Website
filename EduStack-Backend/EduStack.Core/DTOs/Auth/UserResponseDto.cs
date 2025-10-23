namespace EduStack.Core.DTOs.Auth;

public class UserResponseDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
