import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastComponent} from './shared/toast/toast';
import {ConfirmationDialogComponent} from './shared/confirmation-dialog/confirmation-dialog';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import {CommonModule} from '@angular/common';
import {AuthService} from './services/auth';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmationDialogComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  isAuthPage = false;

  protected title = 'G-RELLO';

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const url = this.router.url;

        this.isAuthPage =
          url.includes('/login') ||
          url.includes('/register');
      });
  }
}
