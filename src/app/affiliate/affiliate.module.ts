import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AffiliateFormComponent } from './affiliate-form/affiliate-form.component';
import {SignupComponent} from "./signup/signup.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AffiliateFormComponent,
    SignupComponent
  ],
  exports: [AffiliateFormComponent, SignupComponent]
})
export class AffiliateModule { }
