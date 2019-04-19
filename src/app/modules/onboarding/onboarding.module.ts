import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
const routes: Routes = [
  { 
    path: 'registration',
    pathMatch: 'full',
    component:RegistrationComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports:[RegistrationComponent]
})
export class OnboardingModule { }
