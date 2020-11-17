import { EditLessonComponent } from './edit-lesson/edit-lesson.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

const routes: Routes = [
  { path: '', redirectTo: 'main'},
  { path: 'main', component: CoursesComponent },
  { path: 'course/:id', component: EditCourseComponent },
  { path: 'lesson/:id/:lessonId', component: EditLessonComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
