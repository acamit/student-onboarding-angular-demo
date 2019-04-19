import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentListComponent } from './student-list/student-list.component';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from '../onboarding/registration/registration.component';
import { NgbdModalConfirmAutofocus } from './modal-focus/modal-focus.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterStudentsPipe } from 'src/app/pipes/filter-students/filter-students.pipe';

const studentRoutes: Routes = [
  { path: 'students',  component: StudentListComponent ,canActivate:[AuthGuard]},
  { path: 'students/:id', component: RegistrationComponent,canActivate:[AuthGuard] },
  { path: 'students/edit/:id', component: RegistrationComponent, canActivate:[AuthGuard]}
];

@NgModule({
  declarations: [StudentListComponent, NgbdModalConfirmAutofocus,FilterStudentsPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(studentRoutes),
    NgbModule
  ],
  exports:[RouterModule, NgbdModalConfirmAutofocus],
  entryComponents: [NgbdModalConfirmAutofocus]
})
export class StudentsModule {}