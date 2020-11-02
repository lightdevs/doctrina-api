import {Component, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CreateCourseComponent } from '../create-course/create-course.component';
import gql from 'graphql-tag';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  currentUser: IUserInfo;
  constructor(
    private authService: AuthenticationService,
    private courseService: CoursesService,
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
  ) {
    authService.currentUser.subscribe( x => this.currentUser = x);
  }

  @ViewChild(CreateCourseComponent) createCourse: CreateCourseComponent;

  courses = [];
  loading = false;
  animal: string;
  name: string;
  filterTerm: string;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.apollo
      .query<any>({
        query: gql`
          {
             courses(page:0, count: 10000) {
               person {
                email,
                name,
                surname
               }
               courses {
                _id,
                title,
                description,
                dateStart,
                dateEnd,
                maxMark,
                teacher
               }
               isEnd
            }
          }
        `
      })
      .subscribe(
        ({ data, loading }) => {
          this.courses = data && data.courses.courses;
          this.loading = loading;
        }
      );

  }

  openDialog(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.disableClose = true;
    const openDialog = this.dialog.open(CreateCourseComponent, config);
    openDialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          console.log(data);
          this.router.navigate(['/courses/course/', data]);
        }
      });
  }

  editCourse(id): void {
    console.log(id);
    this.router.navigate(['/courses/course/', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
