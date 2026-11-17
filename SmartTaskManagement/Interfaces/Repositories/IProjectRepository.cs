
using SmartTaskManagement.API.Models;

namespace SmartTaskManagement.API.Interfaces.Repositories
{
    public interface IProjectRepository
    {
        Task<Project> CreateAsync(Project project);
    }
}

