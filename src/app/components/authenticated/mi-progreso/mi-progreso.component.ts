import {Component, OnDestroy, OnInit} from '@angular/core';
import { Chart, registerables, ChartType } from 'chart.js';
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
  newMetric = { weight: null, measurementDate: '' };
  today: string = new Date().toISOString().split('T')[0];
  token: string | null = null;
  weightChart: any;
  imcChart: any;
  weightChartType: ChartType = 'bar';
  imcChartType: ChartType = 'bar';
  height: number | null = null; // Altura del usuario

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        user.getIdToken().then(token => {
          this.token = token;
          this.loadUserInfo(); // Cargar la información del usuario
          this.getMetrics();    // Cargar las métricas del usuario
        });
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }

  ngOnDestroy() {
    if (this.weightChart) {
      this.weightChart.destroy();
    }
    if (this.imcChart) {
      this.imcChart.destroy();
    }
  }

  // Función para cargar la información del usuario (incluyendo la altura)
  loadUserInfo() {
    if (this.token) {
      this.authService.getUserInfo(this.token).subscribe((data: any) => {
        // Asignamos la altura del usuario al valor obtenido de su perfil
        if (data.height && data.height > 0) {
          this.height = data.height;
        } else {
          console.error('La altura no está definida correctamente.');
        }
      });
    }
  }

  getMetrics() {
    if (this.token) {
      this.authService.getMetrics(this.token).subscribe((data: any) => {
        this.metrics = data.metrics.map((metric: any) => {
          const localDate = new Date(metric.measurementDate._seconds * 1000);
          localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
          return {
            ...metric,
            measurementDate: localDate
          };
        }).sort((a: { measurementDate: number; }, b: { measurementDate: number; }) => a.measurementDate - b.measurementDate);

        this.renderWeightChart(); // Renderiza el gráfico de peso
        this.renderImcChart();    // Renderiza el gráfico de IMC
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

  renderWeightChart() {
    if (this.weightChart) {
      this.weightChart.destroy();
    }

    const labels = this.metrics.map(metric => metric.measurementDate.toLocaleDateString());
    const weightData = this.metrics.map(metric => metric.weight);

    const ctx = document.getElementById('weightChart') as HTMLCanvasElement;
    this.weightChart = new Chart(ctx, {
      type: this.weightChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Peso (kg)',
            data: weightData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
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

  renderImcChart() {
    if (this.imcChart) {
      this.imcChart.destroy();
    }

    if (!this.height || this.height <= 0) {
      console.error('La altura no está disponible para calcular el IMC.');
      return;
    }

    const labels = this.metrics.map(metric => metric.measurementDate.toLocaleDateString());
    const heightInMeters = this.height / 100; // Convertir altura a metros

    const imcData = this.metrics.map(metric => {
      const imc = (metric.weight / (heightInMeters * heightInMeters)).toFixed(2);
      return parseFloat(imc);
    });

    const ctx = document.getElementById('imcChart') as HTMLCanvasElement;
    this.imcChart = new Chart(ctx, {
      type: this.imcChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'IMC',
            data: imcData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
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
}
