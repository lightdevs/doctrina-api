import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../courses/courses.component';
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Message } from '../../../core/extension/messages';
import { configureToastr, toastrTitle } from '../../../core/helpers';
import { CoursesService } from '../courses.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  @Output() openSignIn = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  createCourseForm: FormGroup;
  loading = false;
  message = Message;

  constructor(
    private apollo: Apollo,
    private coursesService: CoursesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.createForm();
    configureToastr(this.toastr);
  }

  onSubmit(): void {
    if (this.createCourseForm.valid) {
      this.createCourse();
    } else {
      this.createCourseForm.markAllAsTouched();
    }

    console.log(this.createCourseForm.value);
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
        () => {
          this.clearForm();
          this.toastr.success(this.message.COURSE_CREATED, toastrTitle.Success);
          this.openSignIn.next(null);
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
  }
}
