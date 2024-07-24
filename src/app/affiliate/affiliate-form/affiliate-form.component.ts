import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AffiliateFormComponent {
  name: string = '';
  gender: string = '';
  weight: number | null = null;
  height: number | null = null;
  age: number | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  submitDetails() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.affiliate(token, this.name, this.gender, this.weight, this.height, this.age).subscribe({
        next: (response: any) => {
          this.saveInitialMetrics(token);
          this.router.navigate(['/mi-progreso']);
        },
        error: (error: any) => {
          console.error('Error saving user details:', error);
        }
      });
    } else {
      console.error('No token found');
    }
  }

  saveInitialMetrics(token: string) {
    if (this.weight !== null) {
      const initialDate = new Date();
      this.authService.saveMetrics(token, this.weight, initialDate.toISOString()).subscribe({
        next: (response: any) => {
          console.log('Initial metrics saved:', response);
          this.router.navigate(['/mi-progreso']);
        },
        error: (error: any) => {
          console.error('Error saving initial metrics:', error);
        }
      });
    }
  }
}
