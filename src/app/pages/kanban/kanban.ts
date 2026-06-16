import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task';
import { NotificationService } from '../../services/notification';
import { ConfirmationService } from '../../services/confirmation';
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-kanban',
  standalone: true,
  templateUrl: './kanban.html',
  imports: [CommonModule, FormsModule, DragDropModule] ,
  styleUrl: './kanban.css'
})
export class Kanban {

  private taskService = inject(TaskService);
  private notification = inject(NotificationService);
  private confirmation = inject(ConfirmationService);
  title = '';
  description = '';
  priority = 'low';
  tasks: Task[] = [];
  private route = inject(ActivatedRoute);
  projectId = '';
  showTaskModal = false;
  selectedTask: Task | null = null;
  showEditModal = false;
  dueDate = '';

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.taskService.getTasksByProject(this.projectId)
      .subscribe(tasks => {
        this.tasks = tasks as Task[];
      });
  }

  get todoTasks() {
    return this.tasks.filter(t => t.status === 'todo');
  }

  get inProgressTasks() {
    return this.tasks.filter(t => t.status === 'in-progress');
  }

  get doneTasks() {
    return this.tasks.filter(t => t.status === 'done');
  }

  createTask() {
    if (!this.title.trim()) return;

    const task: Task = {
      title: this.title,
      status: 'todo',
      projectId: this.projectId,
      description: this.description,
      priority: this.priority,
      createdAt: new Date()
    };

    if (this.dueDate) {
      task.dueDate = new Date(this.dueDate);
    }

    this.taskService.createTask(task);

    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = 'low';

    this.notification.success('Task saved successfully');
    this.closeTaskModal();
  }

  async drop(event: CdkDragDrop<any>) {

    if (
      event.previousContainer ===
      event.container
    ) {
      return;
    }

    const task = event.item.data;

    let newStatus:
      'todo'
      | 'in-progress'
      | 'done';

    switch (event.container.id) {

      case 'todo':
        newStatus = 'todo';
        break;

      case 'progress':
        newStatus = 'in-progress';
        break;

      default:
        newStatus = 'done';
    }

    await this.taskService.updateTaskStatus(
      task.id!,
      newStatus
    );
    this.notification.success('Task edited successfully');
  }

  openTaskModal() {
    this.showTaskModal = true;
  }

  closeTaskModal() {
    this.showTaskModal = false;
  }

  openTask(task: Task) {
    this.selectedTask = { ...task };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedTask = null;
  }

  async saveTask() {

    if (!this.selectedTask) {
      return;
    }

    await this.taskService.updateTask(
      this.selectedTask
    );
    this.notification.success('Task saved successfully');
    this.closeEditModal();
  }

  async deleteTask() {
    const confirmed =
      await this.confirmation.confirm({title: 'Delete Task', message: 'This action cannot be undone.'});
    if (!confirmed) {
      return;
    }
    await this.taskService.deleteTask(this.selectedTask!.id!);
    this.notification.success('Task deleted');
    this.closeEditModal();
  }

  isOverdue(task: Task): boolean {

    if (!task.dueDate) {
      return false;
    }

    return (
      new Date(task.dueDate) < new Date() &&
      task.status !== 'done'
    );
  }

}
