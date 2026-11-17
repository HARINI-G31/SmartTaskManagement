
using SmartTaskManagement.API.DTOs.Project;
using SmartTaskManagement.API.Models;

namespace SmartTaskManagement.API.Interfaces.Services
{
    public interface IProjectService
    {
        Task<Project> CreateProjectAsync(CreateProjectDto projectDto);

        Task<List<Project>> GetAllProjectsAsync();
        Task<Project?> GetProjectByIdAsync(int projectId);
    }
}
