using SmartTaskManagement.API.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace SmartTaskManagement.API.Models
{
	public class Project
	{
		public int ProjectId { get; set; }

		[Required]
		[StringLength(150)]
		public string ProjectName { get; set; } = string.Empty;

		[StringLength(1000)]
		public string? Description { get; set; }

		public DateTime StartDate { get; set; }

		public DateTime EndDate { get; set; }

		public ProjectStatus Status { get; set; } = ProjectStatus.Planning;

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public DateTime? UpdatedAt { get; set; }
	}
}