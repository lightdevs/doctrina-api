import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { ICourses } from 'src/app/core/interfaces/course.interface';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';
import { toastrTitle } from 'src/app/core/helpers';
import { Message } from 'src/app/core/extension/messages';
import { DeletePopUpComponent } from 'src/app/shared/components/delete-pop-up/delete-pop-up.component';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/features/authentication/authentication.service';
import { StudentListComponent } from '../student-list/student-list.component';
import { CourseDataService } from '../course-data.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit, OnDestroy {

  courseId: string;
  course = new  BehaviorSubject<ICourses>(null);
  teacherInfo: IUserInfo;
  canEdit = false;
  currentUser: IUserInfo;
  message = Message;

  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private courseService: CourseDataService,
              private router: Router,
              public toastr: ToastrService,
              public dialog: MatDialog) {
    this.courseId = this.route.snapshot.params.id;
    authService.currentUser.subscribe( x => this.currentUser = x);
  }


  ngOnInit(): void {
    this.getCoursesInfo();
  }

  getCoursesInfo(): void {
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId)
        .subscribe(res => {
          if (res.data.courseById.course) {
            this.course.next(res.data.courseById.course);
            this.getTheacherName(res.data.courseById.course.teacher);
          } else {
            this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
            this.router.navigate(['/courses/main']);
          }
      });
    }
  }

  getTheacherName(teacherId: string): void {
    this.courseService.getTeacherName(teacherId)
      .subscribe(res => {
        this.teacherInfo =  res.data.personById.person;
        if (this.teacherInfo) {
          this.canEdit = this.teacherInfo._id === this.currentUser._id;
        }
    });
  }

  deleteCourse(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '500px';
    config.height = '200px';
    config.data = {
      title: `Are you sure?`,
      body: `Course will be deleted`
    };
    const dialogRef = this.dialog.open(DeletePopUpComponent, config);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result != null) {
          if (result === true ) {
            this.courseService.deleteCourse(this.courseId)
              .subscribe(() => {
                this.toastr.success(this.message.COURSE_DELETED, toastrTitle.Success);
                this.router.navigate(['/courses/main']);
            });
          }
        }
        return;
      });
  }

  viewStudentList(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '1000px';
    config.height = '500px';
    config.data = this.courseId;
    const dialogRef = this.dialog.open(StudentListComponent, config);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
