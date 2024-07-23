import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./affiliate-form.component.css']
})
export class AffiliateFormComponent {
  name: string = '';
  gender: string = '';
  weight: number | null = null;
  height: number | null = null;
  age: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  submitDetails() {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Imprime el token en la consola
    if (token) {
      this.http.post('http://localhost:5000/affiliate', {
        token,
        name: this.name,
        gender: this.gender,
        weight: this.weight,
        height: this.height,
        age: this.age
      }).subscribe({
        next: (response) => {
          console.log('User details saved:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error saving user details:', error);
        }
      });
    } else {
      console.error('No token found');
    }
  }
}
