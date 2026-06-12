import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProjectService } from '../../services/project';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private authService = inject(AuthService);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  projects$ = this.projectService.getProjects();
  name = '';
  description = '';
  activeProjectId = '';
  showProjectModal = false;

  async logout() {
    await this.authService.logout();

    this.router.navigate(['/login']);
  }

  createProject() {
    this.projectService.createProject({
      name: this.name,
      description: this.description,
      ownerId: '',
      createdAt: new Date()
    });

    this.name = '';
    this.description = '';

    this.closeProjectModal();
  }

  openProject(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/board', id]);
    this.activeProjectId = id;
  }

  openProjectModal() {
    this.showProjectModal = true;
  }

  closeProjectModal() {
    this.showProjectModal = false;
  }
}
