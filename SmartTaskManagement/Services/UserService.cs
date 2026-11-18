using SmartTaskManagement.DTOs.User;
using BCryptHasher = BCrypt.Net.BCrypt;
using SmartTaskManagement.Interfaces.Repositories;
using SmartTaskManagement.Interfaces.Services;
using SmartTaskManagement.Models;

namespace SmartTaskManagement.Services;

public class UserService(IUserRepository userRepository) : IUserService //IUserRepository userReponsitory for Dependency Injection

{
    public async Task<IReadOnlyCollection<UserResponseDto>> GetAllAsync(CancellationToken cancellationToken = default) //IReadOnlyCollection is a interface collection and <UserResponseDto> is a generic type parameter that specifies the type of objects in the collection. CancellationToken is a struct that is used to propagate notifications that operations should be canceled.
    {
        var users = await userRepository.GetAllAsync(cancellationToken);
        return users.Select(MapToResponse).ToArray();
    }

    public async Task<UserResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByIdAsync(id, cancellationToken);
        return user is null ? null : MapToResponse(user);
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto request, CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(request.Email);
        await EnsureEmailIsAvailableAsync(email, null, cancellationToken);

        var now = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PasswordHash = BCryptHasher.HashPassword(request.Password),
            Role = request.Role,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        await userRepository.AddAsync(user, cancellationToken);
        return MapToResponse(user);
    }

    public async Task<UserResponseDto?> UpdateAsync(Guid id, UpdateUserDto request, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return null;
        }

        var email = NormalizeEmail(request.Email);
        await EnsureEmailIsAvailableAsync(email, id, cancellationToken);

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.Email = email;
        user.Role = request.Role ?? user.Role;
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = BCryptHasher.HashPassword(request.Password);
        }
        user.UpdatedAtUtc = DateTime.UtcNow;

        await userRepository.UpdateAsync(user, cancellationToken);
        return MapToResponse(user);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return userRepository.DeleteAsync(id, cancellationToken);
    }

    private async Task EnsureEmailIsAvailableAsync(string email, Guid? excludedUserId, CancellationToken cancellationToken)
    {
        var existingUser = await userRepository.GetByEmailAsync(email, cancellationToken);
        if (existingUser is not null && existingUser.Id != excludedUserId)
        {
            throw new InvalidOperationException("A user with this email address already exists.");
        }
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static UserResponseDto MapToResponse(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
            CreatedAtUtc = user.CreatedAtUtc,
            UpdatedAtUtc = user.UpdatedAtUtc
        };
    }
}
