using SmartTaskManagement.DTOs.Task;
using SmartTaskManagement.Models;

namespace SmartTaskManagement.Interfaces.Services;

public interface ITaskService
{
    Task<TaskItem> CreateTaskAsync(
    CreateTaskRequest request,
    Guid createdByUserId);
}
