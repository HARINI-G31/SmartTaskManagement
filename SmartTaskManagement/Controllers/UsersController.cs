using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTaskManagement.DTOs.User;
using SmartTaskManagement.Interfaces.Services;

namespace SmartTaskManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [Authorize(Roles = "Admin,Manager,Employee")]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<UserResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var users = await userService.GetAllAsync(cancellationToken);
        return Ok(users);
    }

    [Authorize(Roles = "Admin,Manager,Employee")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserResponseDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var user = await userService.GetByIdAsync(id, cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<UserResponseDto>> Create(CreateUserDto request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await userService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new ProblemDetails { Detail = exception.Message }); // if any error occurs, return a conflict response with the error message in the detail property of the ProblemDetails object
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")] // {} to reperesent in the url, guid is a type of id
    public async Task<ActionResult<UserResponseDto>> Update(
        Guid id,
        UpdateUserDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            var user = await userService.UpdateAsync(id, request, cancellationToken);
            return user is null ? NotFound() : Ok(user);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new ProblemDetails { Detail = exception.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await userService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
