
using SmartTaskManagement.API.DTOs.Project;
using SmartTaskManagement.API.Interfaces.Repositories;
using SmartTaskManagement.API.Interfaces.Services;
using SmartTaskManagement.API.Models;

namespace SmartTaskManagement.API.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<Project> CreateProjectAsync(CreateProjectDto projectDto)
        {
            // Validate project name
            if (string.IsNullOrWhiteSpace(projectDto.ProjectName))
            {
                throw new ArgumentException("Project name is required.");
            }

            // Validate project dates
            if (projectDto.StartDate > projectDto.EndDate)
            {
                throw new ArgumentException(
                    "Project start date cannot be later than end date.");
            }

            // Convert DTO into Project model
            var project = new Project
            {
                ProjectName = projectDto.ProjectName,
                Description = projectDto.Description,
                StartDate = projectDto.StartDate,
                EndDate = projectDto.EndDate,
                Status = projectDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            // Save project through repository
            return await _projectRepository.CreateAsync(project);
        }
    }
}
