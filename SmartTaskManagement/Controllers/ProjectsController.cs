
using Microsoft.AspNetCore.Mvc;
using SmartTaskManagement.API.DTOs.Project;
using SmartTaskManagement.API.Interfaces.Services;

namespace SmartTaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(
            [FromBody] CreateProjectDto projectDto)
        {
            try
            {
                var project = await _projectService.CreateProjectAsync(projectDto);

                return CreatedAtAction(
                    nameof(CreateProject),
                    new { id = project.ProjectId },
                    project
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();

            return Ok(projects);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            try
            {
                var project = await _projectService.GetProjectByIdAsync(id);

                if (project == null)
                {
                    return NotFound(new
                    {
                        message = $"Project with ID {id} not found."
                    });
                }

                return Ok(project);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

    }
}

