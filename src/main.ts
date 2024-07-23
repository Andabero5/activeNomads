import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule, RouterModule.forRoot([]))
  ]
}).catch(err => console.error(err));

