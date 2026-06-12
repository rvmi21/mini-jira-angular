import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private authService = inject(AuthService);

  email = '';
  password = '';

  async register() {
    try {
      const result = await this.authService.register(
        this.email,
        this.password
      );

      console.log('User created!', result.user);

    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  }
}
