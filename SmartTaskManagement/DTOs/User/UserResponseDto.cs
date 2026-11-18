using SmartTaskManagement.Enums;

namespace SmartTaskManagement.DTOs.User;

public class UserResponseDto //returning response to the user after creating, updating, or fetching user details
{
    public Guid Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }
}
