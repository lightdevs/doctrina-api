import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCourseComponent } from './course-components/edit-course/edit-course.component';
import { EditLessonComponent } from './lesson-components/edit-lesson/edit-lesson.component';
import { CoursesComponent } from './main/courses/courses.component';


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
