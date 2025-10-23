using System.ComponentModel.DataAnnotations;

namespace EduStack.Core.DTOs.Auth;

public class RegisterUserDto
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(STUDENT|INSTRUCTOR)$", ErrorMessage = "Role must be either STUDENT or INSTRUCTOR")]
    public string Role { get; set; } = "STUDENT";
}
