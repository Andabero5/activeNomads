import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  standalone: true,
  styleUrls: ['./event-details-dialog.component.css']
})
export class EventDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  addEventToInterested(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.addInterestedEvent(token, this.data.id).subscribe(() => {
        this.dialogRef.close(true); // Close the modal and refresh interested events
      });
    }
  }
}
