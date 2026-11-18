using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCryptHasher = BCrypt.Net.BCrypt;
using Microsoft.IdentityModel.Tokens;
using SmartTaskManagement.DTOs.Auth;
using SmartTaskManagement.DTOs.User;
using SmartTaskManagement.Enums;
using SmartTaskManagement.Interfaces.Repositories;
using SmartTaskManagement.Interfaces.Services;
using SmartTaskManagement.Models;

namespace SmartTaskManagement.Services;

public class AuthService(
    IUserRepository userRepository,
    IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(
        RegisterRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(request.Email);
        var existingUser = await userRepository.GetByEmailAsync(email, cancellationToken);
        if (existingUser is not null)
        {
            throw new InvalidOperationException("A user with this email address already exists.");
        }

        var now = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PasswordHash = BCryptHasher.HashPassword(request.Password),
            Role = UserRole.Employee,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        await userRepository.AddAsync(user, cancellationToken);
        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(
        LoginRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(request.Email);
        var user = await userRepository.GetByEmailAsync(email, cancellationToken);
        if (user is null || string.IsNullOrWhiteSpace(user.PasswordHash))
        {
            return null;
        }

        var passwordIsValid = BCryptHasher.Verify(request.Password, user.PasswordHash);
        return passwordIsValid ? CreateAuthResponse(user) : null;
    }

    private AuthResponseDto CreateAuthResponse(User user)
    {
        var key = configuration["Jwt:Key"];
        var issuer = configuration["Jwt:Issuer"];
        var audience = configuration["Jwt:Audience"];
        var expiryMinutes = configuration.GetValue<int?>("Jwt:ExpiryMinutes") ?? 60;

        if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException("JWT configuration is incomplete.");
        }

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            User = MapToResponse(user)
        };
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static UserResponseDto MapToResponse(User user) => new()
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
