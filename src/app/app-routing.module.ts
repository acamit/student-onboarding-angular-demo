import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegistrationComponent } from './modules/onboarding/registration/registration.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component:LoginComponent
  },
  { 
    path: 'registration',
    pathMatch: 'full',
    component:RegistrationComponent,
    canActivate:[AuthGuard]
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
