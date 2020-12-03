import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormGroupDirective, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject} from 'rxjs';
import { Message } from 'src/app/core/extension/messages';
import { configureToastr, toastrTitle } from 'src/app/core/helpers';
import { CoursesService } from '../courses-data.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  createCourseForm: FormGroup;
  loading = false;
  message = Message;
  options: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  filteredOptions: Observable<number[]>;
  private destroy$ = new Subject<void>();
  constructor(
    private coursesService: CoursesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateCourseComponent>) {}

  ngOnInit(): void {
    this.createForm();
    configureToastr(this.toastr);
    this.filteredOptions = (this.createCourseForm.get('maxMark') as FormControl).valueChanges
    .pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  onSubmit(): void {
    if (this.createCourseForm.valid) {
      this.createCourse();
    } else {
      this.createCourseForm.markAllAsTouched();
    }
  }

  createForm(): void  {
    this.createCourseForm = this.formBuilder.group({
      title: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      description: [null, Validators.required],
      maxMark: [null, Validators.required],
    });
  }

  clearForm(): void {
    this.formDirective.resetForm();
  }

  createCourse(): void {
    this.coursesService.createCourse(
      {
        ...this.createCourseForm.value
      })
      .subscribe(
        (res) => {
          this.toastr.success(this.message.COURSE_CREATED, toastrTitle.Success);
          this.dialogRef.close(res.data.createCourse._id);
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
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
