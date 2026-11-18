
using SmartTaskManagement.DTOs.Task;
using SmartTaskManagement.Enums;
using SmartTaskManagement.Interfaces.Repositories;
using SmartTaskManagement.Interfaces.Services;
using SmartTaskManagement.Models;
using TaskStatusEnum = SmartTaskManagement.Enums.TaskStatus;

namespace SmartTaskManagement.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<TaskItem> CreateTaskAsync(
        CreateTaskRequest request,
        Guid createdByUserId)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new ArgumentException("Task title is required.");
        }

        if (request.ProjectId <= 0)
        {
            throw new ArgumentException("A valid Project ID is required.");
        }

        if (createdByUserId == Guid.Empty)
        {
            throw new ArgumentException("Invalid authenticated user.");
        }

        if (!Enum.IsDefined(typeof(TaskPriority), request.Priority))
        {
            throw new ArgumentException("Invalid task priority.");
        }

        var taskItem = new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description,
            ProjectId = request.ProjectId,
            AssignedToUserId = request.AssignedToUserId,
            CreatedByUserId = createdByUserId,
            Priority = request.Priority,
            Status = TaskStatusEnum.Todo,
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        return await _taskRepository.CreateAsync(taskItem);
    }
}
