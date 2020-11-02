import { HostListener, Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { ICourses } from 'src/app/core/interfaces/course.interface';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { CancelPopUpComponent } from 'src/app/shared/components/cancel-pop-up/cancel-pop-up.component';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit, OnDestroy {

  @Input() course: BehaviorSubject<ICourses>;
  @Input() teacherInfo: IUserInfo;
  @Input() canEdit: boolean;
  options: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  filteredOptions: Observable<number[]>;
  editCourseForm: FormGroup;
  editCourse = false;

  private destroy$ = new Subject<void>();
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private courseService: CoursesService,
              public dialog: MatDialog) { }

      // tslint:disable-next-line:typedef
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editCourseForm.dirty) {
        $event.returnValue = false;
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.course
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if(this.course.value) {
          this.initForm(this.course.value);
        }
      })
    this.filteredOptions = (this.editCourseForm.get('maxMark') as FormControl).valueChanges
    .pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  createForm(): void  {
    this.editCourseForm = this.formBuilder.group({
      id: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      maxMark: [null, Validators.required],
      teacher: [null,  Validators.required],
      identifier: { value: null, disabled: true }
    });
  }

  initForm(course: ICourses): void {
    this.editCourseForm.reset();
    this.editCourseForm.patchValue(course);
    this.editCourseForm.get('dateStart').setValue(new Date(course.dateStart));
    this.editCourseForm.get('dateEnd').setValue(new Date(course.dateEnd));
    this.editCourseForm.get('id').setValue(course._id);
  }

  updateCourseInfo(): void {
    if (this.editCourseForm.valid) {
      console.log(this.editCourseForm.value)
      this.courseService.updateCourse(
        {
          ...this.editCourseForm.value
        })
        .subscribe(res => {
          console.log(res);
          this.editCourse = false;
          this.course.next(res.data.updateCourse);
        });
    } else {
      this.editCourseForm.markAllAsTouched();
    }
  }

  getDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  startEdit(): void {
    this.editCourse = !this.editCourse;
  }


  cancelEdit(): void {
    if (this.editCourseForm.dirty) {
      const config = new MatDialogConfig();
      config.panelClass = `modal-setting`;
      config.width = '500px';
      config.height = '200px';
      const dialogRef = this.dialog.open(CancelPopUpComponent, config);
      dialogRef.afterClosed()
        .pipe(
          takeUntil(this.destroy$))
        .subscribe(result => {
          if (result != null) {
            if (result) {
              this.editCourseForm.reset();
              this.editCourse = !this.editCourse;
              this.initForm(this.course.value);
            }
          }
        });
    } else {
      this.editCourse = !this.editCourse;
    }
  }

  private _filter(value: string): number[] {
    if (value) {
      return this.options.filter(option => (option.toString()).indexOf(value) === 0);
    }
    return this.options;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
