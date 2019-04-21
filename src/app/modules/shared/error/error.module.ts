import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { Routes, RouterModule } from '@angular/router';
const errorRoutes: Routes = [
  { path: 'error/404',  component: PageNotFoundComponent },
  { path: '**',  component: PageNotFoundComponent }
];
@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(errorRoutes)
  ],
  exports:[PageNotFoundComponent]
})
export class ErrorModule { }
