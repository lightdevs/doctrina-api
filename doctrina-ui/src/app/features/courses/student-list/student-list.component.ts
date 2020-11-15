import { takeUntil, finalize } from 'rxjs/operators';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CoursesService } from '../courses.service';
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
  querySubscription: Subscription;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private courseService: CoursesService,
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
        console.log(res.data.courseById.persons);
        if (res.data.courseById.persons && res.data.courseById.persons.length > 0) {
          this.courseStudents = JSON.parse(JSON.stringify(res.data.courseById.persons));
        }
        // this.getAllStudents();
      });
  }

  /*getAllStudents(): void {
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
  }*/

  getStudentsNotOnThisCourse(filterEmail: string = null): void {
    this.querySubscription = this.courseService.getStudentsNotOnThisCourse(this.courseId, filterEmail)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      console.log(res.data.personsNotOnCourse.persons);
      const data = JSON.parse(JSON.stringify(res.data.personsNotOnCourse.persons));
      this.students = data && data.length > 0 ? data : [];
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
      .pipe(
        takeUntil(this.destroy$)
        )
      .subscribe(res => console.log(res, 'add'));
  }

  deleteStudent(studentId: string) {
    this.courseService.deleteStudent(studentId, this.courseId)
    .pipe(
      takeUntil(this.destroy$)
      )
      .subscribe(res => console.log(res, 'del'));
  }

  filterStudents(filterValue: string): void {
    this.courseService.getStudents(filterValue)
    .subscribe(res => {
      this.students = res.data.persons.persons
        .filter(o => this.courseStudents.filter(z => z._id === o._id).length === 0);
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.querySubscription.unsubscribe();
    this.destroy$.unsubscribe();
  }
}
