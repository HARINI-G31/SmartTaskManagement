
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

        public async Task<List<Project>> GetAllAsync()
        {
            return await _context.Projects
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<(List<Project> Projects, int TotalCount)> GetPagedAsync(
    int pageNumber,
    int pageSize)
        {
            var query = _context.Projects.AsNoTracking();

            var totalCount = await query.CountAsync();

            var projects = await query
                .OrderBy(p => p.ProjectId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (projects, totalCount);
        }
        public async Task<Project?> GetByIdAsync(int projectId)
        {
            return await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        }
        public async Task<Project> UpdateAsync(Project project)
        {
            _context.Projects.Update(project);

            await _context.SaveChangesAsync();

            return project;
        }
        public async Task DeleteAsync(Project project)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }
    }
}
