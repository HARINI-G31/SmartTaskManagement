using Microsoft.EntityFrameworkCore;
using SmartTaskManagement.Data;
using SmartTaskManagement.Interfaces.Repositories;
using SmartTaskManagement.Models;

namespace SmartTaskManagement.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly ApplicationDbContext _context;

    public TaskRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItem> CreateAsync(TaskItem taskItem)
    {
        await _context.Tasks.AddAsync(taskItem);

        await _context.SaveChangesAsync();

        return taskItem;
    }
}
