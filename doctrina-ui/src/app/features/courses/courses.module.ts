import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddTaskComponent} from './lesson-components/add-task/add-task.component';
import {TasksComponent} from './lesson-components/tasks/tasks.component';
import {EditLessonComponent} from './lesson-components/edit-lesson/edit-lesson.component';
import {LessonInfoComponent} from './lesson-components/lesson-info/lesson-info.component';
import {AddLessonsComponent} from './course-components/add-lessons/add-lessons.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {CourseInfoComponent} from './course-components/course-info/course-info.component';
import {EditCourseComponent} from './course-components/edit-course/edit-course.component';
import {LessonsComponent} from './course-components/lessons/lessons.component';
import {StudentListComponent} from './course-components/student-list/student-list.component';
import {CoursesRoutingModule} from './courses-routing.module';
import {CoursesComponent} from './main/courses/courses.component';
import {FilterPipe} from './main/courses/filter.pipe';
import {CreateCourseComponent} from './main/create-course/create-course.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';


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
    LessonInfoComponent,
    AddTaskComponent,
    TasksComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    InfiniteScrollModule
  ]
})
export class CoursesModule {
}
