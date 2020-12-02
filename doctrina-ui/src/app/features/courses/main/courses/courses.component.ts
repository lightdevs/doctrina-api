import {Component, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CreateCourseComponent} from '../create-course/create-course.component';
import gql from 'graphql-tag';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {IUserInfo} from 'src/app/core/interfaces/user.interface';
import {AuthenticationService} from 'src/app/features/authentication/authentication.service';
import {CoursesService} from '../courses-data.service';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [DatePipe]
})
export class CoursesComponent implements OnInit, OnDestroy {

  @ViewChild(CreateCourseComponent) createCourse: CreateCourseComponent;

  filterTerm: string;
  courses = [];
  loading = false;
  currentUser: IUserInfo;
  querySubscription: Subscription;
  count = 5;

  constructor(
    private authService: AuthenticationService,
    private courseService: CoursesService,
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private datepipe: DatePipe
  ) {
    authService.currentUser.subscribe(x => this.currentUser = x);
  }

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.getCourses();
  }

  getCourses(): void {
    this.querySubscription = this.courseService.getCourses(0, this.count, this.filterTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {

        const data = JSON.parse(JSON.stringify(res.data.courses.courses));

        const transformData = data.map(x => {
          return {
            teacher: x.teacher,
            course: {
              ...x.course,
              dateStart: this.datepipe.transform(x.course.dateStart, 'dd.MM.yy'),
              dateEnd: this.datepipe.transform(x.course.dateEnd, 'dd.MM.yy'),
            },
          };
        });

        console.log('transformData:', transformData);
        this.courses = transformData && transformData.length > 0 ? transformData : [];
      });
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

  onScrollDown() {
    this.count += 1;
    this.getCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
