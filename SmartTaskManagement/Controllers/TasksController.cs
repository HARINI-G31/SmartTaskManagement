
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTaskManagement.DTOs.Task;
using SmartTaskManagement.Interfaces.Services;

namespace SmartTaskManagement.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(
        [FromBody] CreateTaskRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var createdByUserId))
        {
            return Unauthorized(new { message = "Invalid authenticated user." });
        }

        try
        {
            var createdTask = await _taskService.CreateTaskAsync(
                request, createdByUserId);

            return CreatedAtAction(
                nameof(CreateTask),
                new { id = createdTask.TaskId },
                createdTask);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
