import { Injectable, inject } from '@angular/core';


import {
  authState,
  Auth,
  browserLocalPersistence,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc, docData
} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {AppUser} from '../models/appUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private _currentUser =
    new BehaviorSubject<AppUser | null>(null);

  constructor() {

    this.user$.subscribe(user => {

      if (user) {
        this.loadUserProfile(user.uid);
      } else {
        this._currentUser.next(null);
      }

    });
  }

  currentUser$ =
    this._currentUser.asObservable();

  user$ = authState(this.auth);

  loadUserProfile(uid: string) {

    const userRef =
      doc(this.firestore, 'users', uid);

    docData(userRef)
      .subscribe(user => {

        this._currentUser.next(
          user as AppUser
        );

      });
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {

    const credential =
      await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

    const user = credential.user;

    await setDoc(
      doc(this.firestore, 'users', user.uid),
      {
        uid: user.uid,

        firstName: firstName,
        lastName: lastName,

        displayName:
          `${firstName} ${lastName}`,

        email: user.email,

        createdAt: new Date()
      }
    );

    return credential;
  }

  async login(email: string, password: string) {

    await setPersistence(
      this.auth,
      browserLocalPersistence
    );

    return signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  logout() {
    this._currentUser.next(null);
    return signOut(this.auth);
  }

  //----------getters qnd setters -----------------
  //----------getters qnd setters -----------------
  //----------getters qnd setters -----------------
  //----------getters qnd setters -----------------

  get currentUser(): AppUser | null {
    return this._currentUser.value;
  }
}
