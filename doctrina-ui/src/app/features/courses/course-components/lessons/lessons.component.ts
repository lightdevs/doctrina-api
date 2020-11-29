import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ILesson } from 'src/app/core/interfaces/lesson.interface';
import { Subject } from 'rxjs/internal/Subject';
import { toastrTitle } from 'src/app/core/helpers';
import { DeletePopUpComponent } from 'src/app/shared/components/delete-pop-up/delete-pop-up.component';
import { AddLessonsComponent } from '../add-lessons/add-lessons.component';
import { CourseDataService } from '../course-data.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, OnDestroy {

  @Input() courseId: string;
  @Input() canEdit: boolean;

  lessons: ILesson[] = [];
  private destroy$ = new Subject<void>();
  constructor(private router: Router,
              private courseService: CourseDataService,
              private toastr: ToastrService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getLessons();
  }

  getLessons(): void {
    this.courseService.getLessonsByCourse(this.courseId)
      .subscribe(res => {
        if (res.data.lessonsByCourse) {
          res.data.lessonsByCourse.forEach(x => {
            x.dateStart = new Date(x.dateStart);
            x.dateEnd = new Date(x.dateEnd);
          });
          this.lessons = res.data.lessonsByCourse;
        }
      });
  }

  addLesson(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.disableClose = true;
    config.data = this.courseId;
    const dialogRef = this.dialog.open(AddLessonsComponent, config);
    dialogRef.afterClosed()
      .subscribe(() => this.getLessons());
  }

  deleteLesson(lessonId: string): void {
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
      .subscribe(result => {
        if (result != null) {
          if (result === true ) {
            this.courseService.deleteLesson(lessonId)
              .subscribe(() => {
                this.toastr.success(`Lesson Deleted`, toastrTitle.Success);
                this.getLessons();
            });
          }
        }
        return;
      });
  }

  openLesson(id: string): void {
    this.router.navigate(['/courses/lesson/', this.courseId, id, ]);
  }

  lessonEnded(lesson: ILesson): boolean {
    return lesson?.dateEnd < new Date();
  }

  lessonWill(lesson: ILesson): boolean {
    return lesson?.dateStart > new Date();
  }

  lessonNow(lesson: ILesson): boolean {
    const today = new Date();
    return lesson.dateEnd >= today && lesson.dateStart <= today;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
