import {Component, OnDestroy, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { Router } from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgForOf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
Chart.register(...registerables);
@Component({
  selector: 'app-mi-progreso',
  templateUrl: './mi-progreso.component.html',
  styleUrls: ['./mi-progreso.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    DatePipe
  ],
  standalone: true
})
export class MiProgresoComponent implements OnInit, OnDestroy {
  metrics: any[] = [];
  events: any[] = [];
  newMetric = { weight: null, measurementDate: '' };
  today: string = new Date().toISOString().split('T')[0];
  token: string | null = null;
  chart: any; // Variable para almacenar la instancia del gráfico

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        user.getIdToken().then(token => {
          this.token = token;
          this.getMetrics();
          this.getEvents();
        });
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getMetrics() {
    if (this.token) {
      this.authService.getMetrics(this.token).subscribe((data: any) => {
        this.metrics = data.metrics.map((metric: any) => {
          // Convertir la fecha almacenada en UTC a la fecha local
          const localDate = new Date(metric.measurementDate._seconds * 1000);
          localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
          return {
            ...metric,
            measurementDate: localDate
          };
        }).sort((a: { measurementDate: number; }, b: { measurementDate: number; }) => a.measurementDate - b.measurementDate); // Ordenar las métricas por fecha
        this.renderChart();
      });
    }
  }

  getEvents() {
    if (this.token) {
      this.authService.getEvents().subscribe((data: any) => {
        this.events = data.events;
      });
    }
  }

  addMetric() {
    if (this.token) {
      const measurementDate = new Date(this.newMetric.measurementDate);
      measurementDate.setDate(measurementDate.getDate() + 1);
      this.authService.saveMetrics(this.token, this.newMetric.weight, measurementDate.toISOString())
        .subscribe(() => {
          this.getMetrics();
          this.newMetric = { weight: null, measurementDate: '' };
        });
    }
  }


  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.metrics.map(metric => metric.measurementDate.toLocaleDateString());
    const data = this.metrics.map(metric => metric.weight);

    const ctx = document.getElementById('metricsChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Peso (kg)',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            type: 'linear'
          }
        }
      }
    });
  }

  getTotalEventsAttended(): number {
    return this.events.length;
  }
}