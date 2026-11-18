export interface CreateTaskRequest {
  title: string;
  description: string | null;
  projectId: number;
  assignedToUserId: string | null;
  priority: number;
  dueDate: string | null;
}

export interface TaskItem {
  taskId: number;
  title: string;
  description: string | null;
  projectId: number;
  assignedToUserId: string | null;
  createdByUserId: string;
  status: number;
  priority: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}
