import { ILesson } from 'src/app/core/interfaces/lesson.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/core/extension/messages';
import { toastrTitle } from 'src/app/core/helpers';
import { ICourses } from 'src/app/core/interfaces/course.interface';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { DeletePopUpComponent } from 'src/app/shared/components/delete-pop-up/delete-pop-up.component';
import { AuthenticationService } from 'src/app/features/authentication/authentication.service';
import { LessonDataService } from '../lesson-data.service';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit, OnDestroy {

  courseId: string;
  lessonId: string;
  course = new  BehaviorSubject<ICourses>(null);
  lesson = new  BehaviorSubject<ILesson>(null);
  teacherInfo: IUserInfo;
  canEdit = false;
  currentUser: IUserInfo;
  message = Message;

  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private lessonService: LessonDataService,
              private router: Router,
              public toastr: ToastrService,
              public dialog: MatDialog) {
    this.courseId = this.route.snapshot.params.id;
    this.lessonId = this.route.snapshot.params.lessonId;
    authService.currentUser.subscribe( x => this.currentUser = x);
  }


  ngOnInit(): void {
    this.getCoursesInfo();
    this.getLessonInfo();
  }

  getCoursesInfo(): void {
    if (this.courseId) {
      this.lessonService.getCourseById(this.courseId)
        .subscribe(res => {
          if (res.data.courseById.course) {
            this.course.next(res.data.courseById.course);
            this.getTheacherName(res.data.courseById.course.teacher);
          } else {
            this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
            this.router.navigate(['/courses/course/', this.courseId]);
          }
      });
    }
  }


  getLessonInfo(): void {
    if (this.courseId) {
      this.lessonService.getLessonById(this.lessonId)
        .subscribe(res => {
          if (res.data.lessonById) {
            this.lesson.next(res.data.lessonById);
          } else {
            this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
            this.router.navigate(['/courses/course/', this.courseId]);
          }
      });
    }
  }

  getTheacherName(teacherId: string): void {
    this.lessonService.getTeacherName(teacherId)
      .subscribe(res => {
        this.teacherInfo =  res.data.personById.person;
        if (this.teacherInfo) {
          this.canEdit = this.teacherInfo._id === this.currentUser._id;
        }
    });
  }

  deleteLesson(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '500px';
    config.height = '200px';
    config.data = {
      title: `Are you sure?`,
      body: `Lesson will be deleted`
    };
    const dialogRef = this.dialog.open(DeletePopUpComponent, config);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result != null) {
          if (result === true ) {
            this.lessonService.deleteLesson(this.lessonId)
              .subscribe(() => {
                this.toastr.success(`Lesson Deleted`, toastrTitle.Success);
                this.router.navigate(['/courses/course/', this.courseId]);
            });
          }
        }
        return;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
