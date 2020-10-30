import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CoursesComponent } from './courses/courses.component';
import {SharedModule} from '../../shared/shared.module';
import { CoursesRoutingModule } from './courses-routing.module';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { FilterPipe } from '../courses/courses/filter.pipe';


@NgModule({
  declarations: [
    CreateCourseComponent,
    CoursesComponent,
    EditCourseComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule
  ]
})
export class CoursesModule { }
