using SmartTaskManagement.API.Enums;
using System.ComponentModel.DataAnnotations;

namespace SmartTaskManagement.API.DTOs.Project
{
    public class UpdateProjectDto
    {
        [Required]
        [StringLength(150)]
        public string ProjectName { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public ProjectStatus Status { get; set; }
    }
}