import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  async login() {
    try {
      const result = await this.authService.login(
        this.email,
        this.password
      );

      console.log('Logged in!', result.user);

      this.router.navigate(['/dashboard']);

    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  }
}
