
using SmartTaskManagement.API.Models;

namespace SmartTaskManagement.API.Interfaces.Repositories
{
    public interface IProjectRepository
    {
        Task<Project> CreateAsync(Project project);

        Task<List<Project>> GetAllAsync();
        Task<Project?> GetByIdAsync(int projectId);
        Task<Project> UpdateAsync(Project project);
        Task DeleteAsync(Project project);
    }
}
