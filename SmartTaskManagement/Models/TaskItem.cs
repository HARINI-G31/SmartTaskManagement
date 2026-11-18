using System.ComponentModel.DataAnnotations;
using SmartTaskManagement.Enums;
using TaskStatusEnum = SmartTaskManagement.Enums.TaskStatus;

namespace SmartTaskManagement.Models;

public class TaskItem
{
    [Key]
    public int TaskId { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public int ProjectId { get; set; }

    public Guid? AssignedToUserId { get; set; }

    public Guid CreatedByUserId { get; set; }

    public TaskStatusEnum Status { get; set; } = TaskStatusEnum.Todo;

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
