import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    NgForOf
  ],
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  userData = {
    name: '',
    email: '',
    gender: '',
    height: 0,
    weight: 0,
    age : 0
  };
  token: string | null = null;
  metrics: any[] = [];
  interestedEvents: any[] = [];
  attendedEvents: any[] = [];
  userReviews: any[] = [];
  eventMap: { [id: string]: string } = {};
  newReview = { event: '', comment: '', rating: 0 };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        user.getIdToken().then(token => {
          this.token = token;
          this.userData.email = user.email || '';
          this.loadUserInfo();
          this.loadMetrics();
          this.loadInterestedEvents();
          this.loadAttendedEvents();
          this.loadUserReviews();
        });
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }

  loadUserInfo() {
    if (this.token) {
      this.authService.getUserInfo(this.token).subscribe({
        next: (data) => {
          this.userData = {
            ...data,
            email: this.userData.email,
            name: data.name || '',
            gender: data.gender || '',
            height: data.height || 0,
            weight: data.weight || 0,
            age: data.age || 0
          };
        },
        error: (error) => {
          console.error('Error al cargar la información del usuario:', error);
        }
      });
    }
  }

  updateUserData() {
    if (this.token) {
      this.authService.affiliate(
        this.token,
        this.userData.name,
        this.userData.gender,
        this.userData.weight,
        this.userData.height,
        this.userData.age
      ).subscribe({
        next: () => {
          console.log('Datos actualizados correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar los datos del usuario:', error);
        }
      });
    }
  }

  loadMetrics() {
    if (this.token) {
      this.authService.getMetrics(this.token).subscribe({
        next: (data) => {
          this.metrics = data.metrics.map((metric: any) => {
            const localDate = new Date(metric.measurementDate._seconds * 1000);
            localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
            return {
              ...metric,
              measurementDate: localDate
            };
          }).sort((a: { measurementDate: number; }, b: { measurementDate: number; }) => a.measurementDate - b.measurementDate);
        },
        error: (error) => {
          console.error('Error al cargar las métricas:', error);
        }
      });
    }
  }

  loadInterestedEvents() {
    if (this.token) {
      this.authService.getInterestedEvents(this.token).subscribe({
        next: (data) => {
          this.interestedEvents = data;
        },
        error: (error) => {
          console.error('Error al cargar eventos de interés:', error);
        }
      });
    }
  }

  loadAttendedEvents() {
    if (this.token) {
      this.authService.getAttendedEvents(this.token).subscribe({
        next: (data: any) => {
          this.attendedEvents = data.map((event: any) => {
            // Actualizar el mapeo de ID de evento a nombre de evento
            this.eventMap[event.id] = event.title || 'Evento Sin Nombre';
            return {
              ...event,
              name: event.title || 'Evento Sin Nombre'
            };
          });
          console.log('Eventos asistidos cargados:', this.attendedEvents);
        },
        error: (error: any) => {
          console.error('Error al cargar eventos asistidos:', error);
        }
      });
    }
  }

  loadUserReviews() {
    if (this.token) {
      this.authService.getUserReviewsWithEvents(this.token).subscribe({
        next: (data) => {
          this.userReviews = data; // Aquí ya tendrás la reseña con el nombre del evento
          console.log('Reseñas del usuario cargadas con eventos:', this.userReviews);
        },
        error: (error) => {
          console.error('Error al cargar las reseñas del usuario con eventos:', error);
        }
      });
    }
  }

  addReview() {
    if (this.token && this.newReview.event && this.newReview.comment && this.newReview.rating > 0) {
      console.log('Datos a enviar:', this.newReview);

      this.authService.submitReview(this.token, this.newReview).subscribe({
        next: () => {
          console.log('Reseña enviada correctamente');
          this.newReview = { event: '', comment: '', rating: 0 };
          this.loadUserReviews();
        },
        error: (error: any) => {
          console.error('Error al enviar la reseña:', error);
        }
      });
    } else {
      console.warn('Faltan datos para enviar la reseña.');
    }
  }
}
