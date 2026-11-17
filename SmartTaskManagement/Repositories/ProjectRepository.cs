
using Microsoft.EntityFrameworkCore;
using SmartTaskManagement.API.Data;
using SmartTaskManagement.API.Interfaces.Repositories;
using SmartTaskManagement.API.Models;

namespace SmartTaskManagement.API.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Project> CreateAsync(Project project)
        {
            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            return project;
        }
    }
}
