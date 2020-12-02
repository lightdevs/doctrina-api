import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-answer',
  templateUrl: './add-answer.component.html',
  styleUrls: ['./add-answer.component.scss']
})
export class AddAnswerComponent implements OnInit {


  answerForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddAnswerComponent>) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void  {
    this.answerForm = this.formBuilder.group({
      title: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.answerForm.valid) {
      this.dialogRef.close(this.answerForm.value);
    } else {
      this.answerForm.markAllAsTouched();
    }
  }
}
