import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';

@Component({
  selector: 'app-gimnasios',
  standalone: true,
  imports: [],
  templateUrl: './gimnasios.component.html',
  styleUrl: './gimnasios.component.css'
})
export class GimnasiosComponent {
  private map!: L.Map;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Use the browser's geolocation API to get the current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Initialize the map with the user's location
        this.map = L.map('map', {
          center: [userLat, userLon],
          zoom: 13
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(this.map);

        // Load gyms around the user's location
        this.loadGyms(userLat, userLon);
      }, () => {
        // Handle location error (optional: you can show a message to the user)
        console.error('Geolocation failed or permission denied.');
      });
    } else {
      // Handle the case when geolocation is not supported by the browser
      console.error('Geolocation is not supported by this browser.');
    }
  }

  private loadGyms(lat: number, lon: number): void {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
      [out:json];
      node
        ["leisure"="fitness_centre"]
        (around:5000,${lat},${lon}); // 5000 metros alrededor de las coordenadas especificadas
      out;
    `;

    this.http.get(overpassUrl, {
      params: {
        data: query
      }
    }).subscribe((data: any) => {
      const gyms = data.elements;
      gyms.forEach((gym: any) => {
        const marker = L.marker([gym.lat, gym.lon]).addTo(this.map);
        marker.bindPopup(`<b>Gimnasio</b><br>${gym.tags.name || 'Sin nombre'}`);
      });
    });
  }
}
