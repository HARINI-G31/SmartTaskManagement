using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTaskManagement.API.DTOs.Project;
using SmartTaskManagement.API.Interfaces.Services;

namespace SmartTaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
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
        [HttpGet("paginated")]
        public async Task<IActionResult> GetPagedProjects(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 5)
        {
            try
            {
                var result = await _projectService.GetPagedProjectsAsync(
                    pageNumber,
                    pageSize
                );

                var response = new
                {
                    Projects = result.Projects,
                    TotalCount = result.TotalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(
                        (double)result.TotalCount / pageSize
                    )
                };

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchProjects(
    [FromQuery] string searchTerm,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 5)
        {
            try
            {
                var result = await _projectService.SearchProjectsAsync(
                    searchTerm,
                    pageNumber,
                    pageSize
                );

                var response = new
                {
                    Projects = result.Projects,
                    TotalCount = result.TotalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(
                        (double)result.TotalCount / pageSize
                    )
                };

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("filter-by-status")]
        public async Task<IActionResult> FilterByStatus(
    [FromQuery] int status,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 5)
        {
            try
            {
                var result = await _projectService.FilterProjectsByStatusAsync(
                    status,
                    pageNumber,
                    pageSize
                );

                return Ok(new
                {
                    projects = result.Projects,
                    totalCount = result.TotalCount,
                    pageNumber,
                    pageSize,
                    totalPages = (int)Math.Ceiling(
                        result.TotalCount / (double)pageSize
                    )
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateProject(
    int id,
    [FromBody] UpdateProjectDto projectDto)
        {
            try
            {
                var updatedProject =
                    await _projectService.UpdateProjectAsync(id, projectDto);

                return Ok(updatedProject);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                await _projectService.DeleteProjectAsync(id);

                return Ok(new
                {
                    message = "Project deleted successfully."
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

    }
}

