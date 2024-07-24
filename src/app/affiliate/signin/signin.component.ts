import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(private authService: AuthService, private router: Router) {}

  signin() {
    if (!this.emailPattern.test(this.email)) {
      console.error('Invalid email format');
      return;
    }

    if (this.password.length < 6) {
      console.error('Password must be at least 6 characters');
      return;
    }

    this.authService.signin(this.email, this.password).subscribe({
      next: (idToken: string) => {
        console.log('ID Token:', idToken);
        localStorage.setItem('token', idToken);
        this.router.navigate(['/mi-progreso']);
      },
      error: (error: any) => {
        console.error('Error signing in:', error);
      }
    });
  }
}
