import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/core/extension/messages';
import { toastrTitle } from 'src/app/core/helpers';
import { ICourses } from 'src/app/core/interfaces/course.interface';
import { ILesson } from 'src/app/core/interfaces/lesson.interface';
import { ITask } from 'src/app/core/interfaces/task.interface';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { DeletePopUpComponent } from 'src/app/shared/components/delete-pop-up/delete-pop-up.component';
import { AuthenticationService } from '../../authentication/authentication.service';
import { LessonDataService } from '../../courses/lesson-components/lesson-data.service';
import { TaskDataService } from '../task-data.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit, OnDestroy {

  courseId: string;
  lessonId: string;
  taskId: string;
  course = new  BehaviorSubject<ICourses>(null);
  lesson = new  BehaviorSubject<ILesson>(null);
  task = new  BehaviorSubject<ITask>(null);
  teacherInfo: IUserInfo;
  canEdit = false;
  currentUser: IUserInfo;
  message = Message;

  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private taskService: TaskDataService,
              private router: Router,
              public toastr: ToastrService,
              public dialog: MatDialog) {
    this.courseId = this.route.snapshot.params.id;
    this.lessonId = this.route.snapshot.params.lessonId;
    this.taskId = this.route.snapshot.params.taskId;
    authService.currentUser.subscribe( x => this.currentUser = x);
  }


  ngOnInit(): void {
    this.getCoursesInfo();
    this.getLessonInfo();
    this.getTaskInfo();
  }

  getCoursesInfo(): void {
    if (this.courseId) {
      this.taskService.getCourseById(this.courseId)
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
    if (this.lessonId) {
      this.taskService.getLessonById(this.lessonId)
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

  getTaskInfo(): void {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId)
        .subscribe(res => {
          if (res.data.taskById) {
            this.task.next(res.data.taskById);
          } else {
            this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
            this.router.navigate(['/courses/course/', this.courseId]);
          }
      });
    }
  }

  getTheacherName(teacherId: string): void {
    this.taskService.getTeacherName(teacherId)
      .subscribe(res => {
        this.teacherInfo =  res.data.personById.person;
        if (this.teacherInfo) {
          this.canEdit = this.teacherInfo._id === this.currentUser._id;
        }
    });
  }

  deleteTask(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '500px';
    config.height = '200px';
    config.data = {
      title: `Are you sure?`,
      body: `Task will be deleted`
    };
    const dialogRef = this.dialog.open(DeletePopUpComponent, config);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result != null) {
          if (result === true ) {
            this.taskService.deleteTask(this.taskId)
              .subscribe(() => {
                this.toastr.success(`Task Deleted`, toastrTitle.Success);
                this.router.navigate(['/courses/course/', this.courseId,]);
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
