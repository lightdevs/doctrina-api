import { StudentListComponent } from './../student-list/student-list.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { ICourses } from 'src/app/core/interfaces/course.interface';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit, OnDestroy {

  courseId: string;
  course = new  BehaviorSubject<ICourses>(null);
  teacherInfo: IUserInfo;

  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute,
              private courseService: CoursesService,
              public dialog: MatDialog) {
    this.courseId = this.route.snapshot.params.id;
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
          }
      });
    }
  }

  getTheacherName(teacherId: string): void {
    this.courseService.getTeacherName(teacherId)
      .subscribe(res => {
        this.teacherInfo =  res.data.personById.person;
    });
  }

  viewStudentList(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '1000px';
    config.height = '500px';
    config.data = this.courseId;
    this.dialog.open(StudentListComponent, config);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
