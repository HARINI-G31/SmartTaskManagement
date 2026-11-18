
using SmartTaskManagement.API.Models;

namespace SmartTaskManagement.API.Interfaces.Repositories
{
    public interface IProjectRepository
    {
        Task<Project> CreateAsync(Project project);

        Task<List<Project>> GetAllAsync();
        Task<(List<Project> Projects, int TotalCount)> GetPagedAsync(
    int pageNumber,
    int pageSize
);
        Task<(List<Project> Projects, int TotalCount)> SearchAsync(
    string searchTerm,
    int pageNumber,
    int pageSize
);
        Task<(List<Project> Projects, int TotalCount)> FilterByStatusAsync(
    int status,
    int pageNumber,
    int pageSize
);
        Task<Project?> GetByIdAsync(int projectId);
        Task<Project> UpdateAsync(Project project);
        Task DeleteAsync(Project project);
    }
}
