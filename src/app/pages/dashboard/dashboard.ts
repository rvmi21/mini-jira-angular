import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProjectService } from '../../services/project';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Firestore, doc, getDoc} from '@angular/fire/firestore';



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
  private firestore = inject(Firestore);
  projects$ = this.projectService.getProjects();
  name = '';
  description = '';
  activeProjectId = '';
  showProjectModal = false;
  ownerMap: { [uid: string]: any } = {};

  ngOnInit() {

    this.projects$.subscribe(projects => {
      projects.forEach(project => {
        if (!this.ownerMap[project.ownerId]) {
          this.loadOwner(project.ownerId);
        }
      });
    });

  }

  async loadOwner(uid: string) {

    const userRef =
      doc(this.firestore, 'users', uid);

    const snap =
      await getDoc(userRef);

    if (snap.exists()) {

      this.ownerMap[uid] =
        snap.data();

    }

  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  createProject() {
    this.projectService.createProject({
      name: this.name,
      description: this.description,
      ownerId: this.authService.currentUser!.uid,
      members: [this.authService.currentUser!.uid],
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
