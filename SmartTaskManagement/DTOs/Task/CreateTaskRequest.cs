
using System.ComponentModel.DataAnnotations;
using SmartTaskManagement.Enums;

namespace SmartTaskManagement.DTOs.Task;

public class CreateTaskRequest
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Range(1, int.MaxValue)]
    public int ProjectId { get; set; }

    public Guid? AssignedToUserId { get; set; }

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public DateTime? DueDate { get; set; }
}
