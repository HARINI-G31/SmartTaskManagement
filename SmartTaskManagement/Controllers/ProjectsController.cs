
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
    }
}

