
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
        public async Task<List<Project>> GetAllProjectsAsync()
        {
            return await _projectRepository.GetAllAsync();
        }
        public async Task<(List<Project> Projects, int TotalCount)> GetPagedProjectsAsync(
    int pageNumber,
    int pageSize)
        {
            if (pageNumber < 1)
            {
                throw new ArgumentException("Page number must be greater than zero.");
            }

            if (pageSize < 1 || pageSize > 100)
            {
                throw new ArgumentException("Page size must be between 1 and 100.");
            }

            return await _projectRepository.GetPagedAsync(pageNumber, pageSize);
        }
        public async Task<(List<Project> Projects, int TotalCount)> SearchProjectsAsync(
    string searchTerm,
    int pageNumber,
    int pageSize)
        {
            if (pageNumber < 1)
            {
                throw new ArgumentException("Page number must be greater than zero.");
            }

            if (pageSize < 1 || pageSize > 100)
            {
                throw new ArgumentException("Page size must be between 1 and 100.");
            }

            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                throw new ArgumentException("Search term is required.");
            }

            return await _projectRepository.SearchAsync(
                searchTerm.Trim(),
                pageNumber,
                pageSize
            );
        }
        public async Task<(List<Project> Projects, int TotalCount)> FilterProjectsByStatusAsync(
    int status,
    int pageNumber,
    int pageSize)
        {
            if (status < 1 || status > 5)
            {
                throw new ArgumentException("Invalid project status.");
            }

            if (pageNumber < 1)
            {
                throw new ArgumentException("Page number must be greater than zero.");
            }

            if (pageSize < 1 || pageSize > 100)
            {
                throw new ArgumentException("Page size must be between 1 and 100.");
            }

            return await _projectRepository.FilterByStatusAsync(
                status,
                pageNumber,
                pageSize
            );
        }
        public async Task<Project?> GetProjectByIdAsync(int projectId)
        {
            if (projectId <= 0)
            {
                throw new ArgumentException("Invalid project ID.");
            }

            return await _projectRepository.GetByIdAsync(projectId);
        }
        public async Task<Project> UpdateProjectAsync(
    int projectId,
    UpdateProjectDto projectDto)
        {
            if (projectId <= 0)
            {
                throw new ArgumentException("Invalid project ID.");
            }

            if (projectDto.StartDate > projectDto.EndDate)
            {
                throw new ArgumentException(
                    "Start date cannot be later than end date.");
            }

            var existingProject =
                await _projectRepository.GetByIdAsync(projectId);

            if (existingProject == null)
            {
                throw new KeyNotFoundException(
                    $"Project with ID {projectId} not found.");
            }

            existingProject.ProjectName = projectDto.ProjectName;
            existingProject.Description = projectDto.Description;
            existingProject.StartDate = projectDto.StartDate;
            existingProject.EndDate = projectDto.EndDate;
            existingProject.Status = projectDto.Status;
            existingProject.UpdatedAt = DateTime.UtcNow;

            return await _projectRepository.UpdateAsync(existingProject);
        }
        public async Task DeleteProjectAsync(int projectId)
        {
            if (projectId <= 0)
            {
                throw new ArgumentException("Invalid project ID.");
            }

            var project = await _projectRepository.GetByIdAsync(projectId);

            if (project == null)
            {
                throw new KeyNotFoundException("Project not found.");
            }

            await _projectRepository.DeleteAsync(project);
        }
    }
}
