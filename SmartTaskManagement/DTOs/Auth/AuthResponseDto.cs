using SmartTaskManagement.DTOs.User;

namespace SmartTaskManagement.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;

    public UserResponseDto User { get; set; } = null!;
}
