import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import {
  OnboardingModule
} from "./modules/onboarding/onboarding.module";

import {
  AppRoutingModule
} from './app-routing.module';
import {
  AppComponent
} from './app.component';
import {
  LoginComponent
} from './modules/login/login.component';
import {
  StudentsModule
} from './modules/students/students.module';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  JwtInterceptor
} from './helpers/jwt.interceptor';
import {
  ErrorInterceptor
} from './helpers/error.interceptor';
import {
  fakeBackendProvider
} from './helpers/fake-backend';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],

  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    fakeBackendProvider
  ],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    OnboardingModule,
    StudentsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
