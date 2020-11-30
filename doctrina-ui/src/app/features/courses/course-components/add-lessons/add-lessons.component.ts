import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/core/extension/messages';
import { configureToastr, toastrTitle } from 'src/app/core/helpers';
import { CourseDataService } from '../course-data.service';

@Component({
  selector: 'app-add-lessons',
  templateUrl: './add-lessons.component.html',
  styleUrls: ['./add-lessons.component.scss']
})
export class AddLessonsComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  createLessonForm: FormGroup;
  loading = false;
  message = Message;
  options: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  filteredOptions: Observable<number[]>;
  lessonId: string;
  private destroy$ = new Subject<void>();
  constructor(
    private coursesService: CourseDataService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddLessonsComponent>) {}

  ngOnInit(): void {
    this.createForm();
    configureToastr(this.toastr);
    this.filteredOptions = (this.createLessonForm.get('maxMark') as FormControl).valueChanges
    .pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  onSubmit(): void {
    if (this.createLessonForm.valid) {
      this.addLesson();
    } else {
      this.createLessonForm.markAllAsTouched();
    }

  }

  createForm(): void  {
    this.createLessonForm = this.formBuilder.group({
      title: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      description: null,
      maxMark: null,
      type: null
    });
  }

  clearForm(): void {
    this.formDirective.resetForm();
  }

  createLesson(): void {
    this.coursesService.updateLesson(
      {
        id: this.lessonId,
        ...this.createLessonForm.value,
      })
      .subscribe(
        (res) => {
          this.toastr.success(`Lesson Created`, toastrTitle.Success);
          this.dialogRef.close();
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
  }

  addLesson(): void {
    this.coursesService.addLesson(this.createLessonForm.get('title').value, this.data)
      .subscribe(
        (res) => {
          this.lessonId = res.data.addLesson._id;
          this.createLesson();
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
  }

  close(): void {
    if (this.lessonId) {
      this.coursesService.deleteLesson(this.lessonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe( () => this.dialogRef.close())
    } else {
      this.dialogRef.close()
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
