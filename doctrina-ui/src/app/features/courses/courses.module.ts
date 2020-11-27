import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CoursesComponent } from './courses/courses.component';
import {SharedModule} from '../../shared/shared.module';
import { CoursesRoutingModule } from './courses-routing.module';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { FilterPipe } from './courses/filter.pipe';
import { CourseInfoComponent } from './course-info/course-info.component';
import { StudentListComponent } from './student-list/student-list.component';
import { LessonsComponent } from './lessons/lessons.component';
import { AddLessonsComponent } from './add-lessons/add-lessons.component';
import { EditLessonComponent } from './edit-lesson/edit-lesson.component';
import { LessonInfoComponent } from './lesson-info/lesson-info.component';


@NgModule({
  declarations: [
    CreateCourseComponent,
    CoursesComponent,
    EditCourseComponent,
    FilterPipe,
    CourseInfoComponent,
    StudentListComponent,
    LessonsComponent,
    AddLessonsComponent,
    EditLessonComponent,
    LessonInfoComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule
  ]
})
export class CoursesModule { }
