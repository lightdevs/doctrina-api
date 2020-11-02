import { takeUntil } from 'rxjs/operators';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CoursesService } from '../courses.service';
import { OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  constructor(private courseService: CoursesService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog) {
    this.courseId = data;
  }

  ngOnInit(): void {
    this.getStudentsOfCurrentCourse();
  }


  getStudentsOfCurrentCourse(): void {
    this.courseService.getStudentsOfCourse(this.courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.data.courseById.persons && res.data.courseById.persons.length > 0) {
          this.courseStudents = res.data.courseById.persons;
        }
        this.getAllStudents();
      });
  }

  getAllStudents(): void {
    this.courseService.getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.data.persons.persons && res.data.persons.persons.length > 0) {
          console.log(res.data.persons.persons as IUserInfo[]);
          const filterStud = res.data.persons.persons
          .filter(o => this.courseStudents.filter(z => z._id === o._id).length === 0);
          this.students = filterStud && filterStud.length > 0 ? filterStud : [];
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

  assignStudent(studentId: string) {
    this.courseService.assignStudent(studentId, this.courseId)
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
