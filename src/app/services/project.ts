
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Project } from '../models/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private projectsRef = collection(this.firestore, 'projects');

  createProject(data: Project) {
    return addDoc(this.projectsRef, {
      ...data,
      ownerId: this.auth.currentUser?.uid,
      createdAt: new Date()
    });
  }

  getProjects() {

    const q = query(
      this.projectsRef,
      where(
        'members',
        'array-contains',
        this.auth.currentUser?.uid
      )
    );

    return collectionData(
      q,
      { idField: 'id' }
    ) as Observable<Project[]>;
  }
}
