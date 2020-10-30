import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

const routes: Routes = [
  { path: '', redirectTo: 'main'},
  { path: 'main', component: CoursesComponent },
  { path: 'edit-course/:id', component: EditCourseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
