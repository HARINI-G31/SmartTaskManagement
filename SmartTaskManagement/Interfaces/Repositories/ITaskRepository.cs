using SmartTaskManagement.Models;

namespace SmartTaskManagement.Interfaces.Repositories;

public interface ITaskRepository
{
    Task<TaskItem> CreateAsync(TaskItem taskItem);
}
