import { takeUntil } from 'rxjs/operators';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CourseDataService } from '../course-data.service';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, OnDestroy {

  courseId: string;
  courseStudents: IUserInfo[] = [];
  students: IUserInfo[] = [];
  filterTerm: string;

  private destroy$ = new Subject<void>();
  constructor(private courseService: CourseDataService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog) {
    this.courseId = data;
  }

  ngOnInit(): void {
    this.getStudentsOfCurrentCourse();
    this.getStudentsNotOnThisCourse();
  }

  getStudentsOfCurrentCourse(): void {
    this.courseService.getStudentsOfCourse(this.courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.data.courseById.persons && res.data.courseById.persons.length > 0) {
          this.courseStudents = JSON.parse(JSON.stringify(res.data.courseById.persons));
        }
      });
  }

  getStudentsNotOnThisCourse(): void {
    this.courseService.getStudentsNotOnThisCourse(this.courseId, this.filterTerm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      if (res.data.personsNotOnCourse.persons && res.data.personsNotOnCourse.persons.length > 0) {
        const data = JSON.parse(JSON.stringify(res.data.personsNotOnCourse.persons));
        this.students = data && data.length > 0 ? data : [];
      } else {
        this.students = [];
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.assignStudent((event.previousContainer.data[event.previousIndex] as IUserInfo)._id);
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  dropDelete(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.deleteStudent((event.previousContainer.data[event.previousIndex] as IUserInfo)._id);
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  assignStudent(studentId: string) {
    this.courseService.assignStudent(studentId, this.courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  deleteStudent(studentId: string) {
    this.courseService.deleteStudent(studentId, this.courseId)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  filterStudents(filterValue: string): void {
    this.courseService.getStudents(filterValue)
    .subscribe(res => {
      this.students = res.data.persons.persons
        .filter(o => this.courseStudents.filter(z => z._id === o._id).length === 0);
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
