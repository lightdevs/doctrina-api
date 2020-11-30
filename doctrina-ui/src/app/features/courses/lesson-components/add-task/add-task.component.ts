import { LessonDataService } from './../lesson-data.service';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Message } from 'src/app/core/extension/messages';
import { configureToastr, toastrTitle } from 'src/app/core/helpers';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  createTaskForm: FormGroup;
  loading = false;
  message = Message;
  options: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  filteredOptions: Observable<number[]>;
  lessonId: string;
  private destroy$ = new Subject<void>();
  constructor(
    private lessonService: LessonDataService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTaskComponent>) {}

  ngOnInit(): void {
    this.createForm();
    configureToastr(this.toastr);
    this.filteredOptions = (this.createTaskForm.get('maxMark') as FormControl).valueChanges
    .pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  onSubmit(): void {
    if (this.createTaskForm.valid) {
      this.createLesson();
    } else {
      this.createTaskForm.markAllAsTouched();
    }

  }

  createForm(): void  {
    this.createTaskForm = this.formBuilder.group({
      title: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      description: null,
      maxMark: null,
    });
  }

  clearForm(): void {
    this.formDirective.resetForm();
  }

  createLesson(): void {
    this.lessonService.addTask(
      {
        parentInstance: this.data,
        ...this.createTaskForm.value,
      })
      .subscribe(
        (res) => {
          this.toastr.success(`Task created`, toastrTitle.Success);
          this.dialogRef.close();
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
  }

  close(): void {
    this.dialogRef.close()
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
