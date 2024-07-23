import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    if (!this.emailPattern.test(this.email)) {
      console.error('Invalid email format');
      return;
    }

    if (this.password.length < 6) {
      console.error('Password must be at least 6 characters');
      return;
    }

    this.authService.signup(this.email, this.password).subscribe({
      next: (idToken) => {
        console.log('ID Token:', idToken); // Imprime el ID token
        localStorage.setItem('token', idToken);
        this.router.navigate(['/affiliate-form']);
      },
      error: (error) => {
        console.error('Error signing up:', error);
      }
    });
  }
}
