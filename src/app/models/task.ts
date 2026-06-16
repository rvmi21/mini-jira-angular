export interface Task {
  id?: string;
  title: string;
  description?: string;
  priority: string;
  status: 'todo' | 'in-progress' | 'done';
  projectId: string;
  createdAt: any;
  dueDate?: Date;
}
