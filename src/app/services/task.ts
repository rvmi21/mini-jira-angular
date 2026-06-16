import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Task } from '../models/task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private firestore = inject(Firestore);
  private tasksRef = collection(this.firestore, 'tasks');

  createTask(task: Task) {
    return addDoc(this.tasksRef, {
      ...task,
      createdAt: new Date()
    });
  }

  getTasksByProject(projectId: string) {
    const q = query(
      this.tasksRef,
      where('projectId', '==', projectId)
    );

    return collectionData(q, { idField: 'id' });
  }

  async updateTaskStatus(taskId: string, status: string
  ) {
    const taskRef = doc(
      this.firestore,
      `tasks/${taskId}`
    );

    await updateDoc(taskRef, {
      status
    });
  }

  async updateTask(task: Task) {

    const taskRef = doc(
      this.firestore,
      `tasks/${task.id}`
    );

    await updateDoc(taskRef, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority
    });
  }

  async deleteTask(taskId: string) {

    const taskRef = doc(
      this.firestore,
      `tasks/${taskId}`
    );

    await deleteDoc(taskRef);
  }
}
