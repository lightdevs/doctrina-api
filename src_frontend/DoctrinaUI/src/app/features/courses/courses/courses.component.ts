import { Component, OnInit, ViewChild } from '@angular/core';
import {Apollo} from 'apollo-angular';
import { CreateCourseComponent } from '../create-course/create-course.component';
import gql from 'graphql-tag';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  @ViewChild(CreateCourseComponent) createCourse: CreateCourseComponent;

  courses = [];
  loading = false;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .query<any>({
        query: gql`
          {
            courses {
              title,
              description,
              dateStart,
              dateEnd,
              maxMark,
              teacher
            }
          }
        `
      })
      .subscribe(
        ({ data, loading }) => {
          this.courses = data && data.courses;
          this.loading = loading;
        }
      );
  }
}
