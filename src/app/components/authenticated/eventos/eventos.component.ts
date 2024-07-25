import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {CalendarOptions, EventClickArg} from "@fullcalendar/core";
import {FullCalendarModule} from "@fullcalendar/angular";
import {NgForOf} from "@angular/common";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {EventDetailsDialogComponent} from "../../event-details-dialog/event-details-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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

export class EventosComponent implements OnInit {
  events: any[] = [];
  interestedEvents: any[] = [];
  attendedEvents: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    eventClick: this.handleEventClick.bind(this),
    events: [],
    eventContent: this.renderEventContent.bind(this)
  };

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadInterestedEvents();
    this.loadAttendedEvents();
  }

  loadEvents(): void {
    this.authService.getEvents().subscribe(events => {
      this.events = events;
      this.updateCalendarEvents();
    });
  }

  loadInterestedEvents(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getInterestedEvents(token).subscribe(events => {
        this.interestedEvents = events;
        this.updateCalendarEvents();
      });
    }
  }

  loadAttendedEvents(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getAttendedEvents(token).subscribe(events => {
        this.attendedEvents = events;
        this.updateCalendarEvents();
      });
    }
  }

  updateCalendarEvents(): void {
    this.calendarOptions.events = this.events.map(event => {
      const isInterested = this.interestedEvents.some(ie => ie.id === event.id);
      const isAttended = this.attendedEvents.some(ae => ae.id === event.id);
      return {
        ...event,
        color: isInterested ? 'green' : (isAttended ? 'red' : ''), // Change color if interested or attended
        textColor: isInterested || isAttended ? 'white' : ''
      };
    });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const eventId = clickInfo.event.id;
    const isInterested = this.interestedEvents.some(event => event.id === eventId);
    const isAttended = this.attendedEvents.some(event => event.id === eventId);

    if (!isInterested && !isAttended) {
      this.viewEventDetails(clickInfo.event);
    }
  }

  handleAddEvent(eventId: string): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.addInterestedEvent(token, eventId).subscribe(() => {
        this.loadInterestedEvents();
      });
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
        this.loadAttendedEvents();
      });
    }
  }

  renderEventContent(eventInfo: any): any {
    const isInterested = this.interestedEvents.some(event => event.id === eventInfo.event.id);
    const isAttended = this.attendedEvents.some(event => event.id === eventInfo.event.id);
    const eventElement = document.createElement('div');
    eventElement.className = 'event-content';

    const titleElement = document.createElement('div');
    titleElement.innerText = eventInfo.event.title;

    const buttonsElement = document.createElement('div');
    buttonsElement.className = 'event-buttons';
    buttonsElement.innerHTML = `
      <button class="btn-add" ${isInterested || isAttended ? 'disabled style="background-color: grey; color: white;"' : ''}>Agregar</button>
    `;


    eventElement.appendChild(titleElement);
    eventElement.appendChild(buttonsElement);

    return { domNodes: [eventElement] };
  }

  viewEventDetails(event: any): void {
    const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
      data: {
        id: event.id,
        title: event.title,
        description: event.extendedProps.description,
        date: event.start.toLocaleDateString()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.handleAddEvent(event.id); // Add event if confirmed in modal
      }
    });
  }
}
