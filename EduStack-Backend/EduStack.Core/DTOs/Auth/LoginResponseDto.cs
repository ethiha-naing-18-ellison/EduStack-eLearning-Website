namespace EduStack.Core.DTOs.Auth;

public class LoginResponseDto
{
    public UserResponseDto User { get; set; } = new();
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
