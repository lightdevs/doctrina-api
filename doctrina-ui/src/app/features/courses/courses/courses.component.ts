import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CreateCourseComponent } from '../create-course/create-course.component';
import gql from 'graphql-tag';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  @ViewChild(CreateCourseComponent) createCourse: CreateCourseComponent;

  courses = [];
  loading = false;
  animal: string;
  name: string;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog
  ) {}

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

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateCourseComponent, {
      width: '400px',
      height: '400px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}

export interface DialogData {
  animal: string;
  name: string;
}
