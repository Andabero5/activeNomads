import { Component } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {CalendarOptions, EventClickArg} from "@fullcalendar/core";
import {FullCalendarModule} from "@fullcalendar/angular";
import {NgForOf} from "@angular/common";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    FullCalendarModule,
    NgForOf
  ],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})

export class EventosComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };
  interestedEvents: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadInterestedEvents();
  }

  loadEvents(): void {
    const token = localStorage.getItem('token');
    this.authService.getEvents().subscribe(events => {
      this.calendarOptions.events = events;
    });
  }

  loadInterestedEvents(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getInterestedEvents(token).subscribe(events => {
        this.interestedEvents = events;
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const eventId = clickInfo.event.id;
    const isInterested = this.interestedEvents.some(event => event.id === eventId);

    if (!isInterested) {
      const token = localStorage.getItem('token');
      if (token) {
        this.authService.addInterestedEvent(token, eventId).subscribe(() => {
          this.loadInterestedEvents();
        });
      }
    }
  }

  removeInterestedEvent(eventId: string): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.removeInterestedEvent(token, eventId).subscribe(() => {
        this.loadInterestedEvents();
      });
    }
  }

  markAsAttended(eventId: string): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.markEventAsAttended(token, eventId).subscribe(() => {
        this.loadInterestedEvents();
      });
    }
  }
}
