using EduStack.Core.DTOs.Auth;

namespace EduStack.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> RegisterAsync(RegisterUserDto registerDto);
    Task<LoginResponseDto> LoginAsync(LoginUserDto loginDto);
    Task<UserResponseDto> GetUserByIdAsync(Guid userId);
    Task<bool> UserExistsAsync(string email);
}
