import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss']
})
export class AddLinkComponent implements OnInit {


  linkForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddLinkComponent>) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void  {
    this.linkForm = this.formBuilder.group({
      link: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.linkForm.valid) {
      this.dialogRef.close(this.linkForm.value);
    } else {
      this.linkForm.markAllAsTouched();
    }
  }
}
