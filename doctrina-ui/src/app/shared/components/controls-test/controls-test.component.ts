import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DOCUMENT } from '@angular/common';

export interface ISelectInfo {
  name: string;
  id: number | string;
  createdAt: Date | null;
}

@Component({
  selector: 'app-controls-test',
  templateUrl: './controls-test.component.html',
  styleUrls: ['./controls-test.component.scss']
})
export class ControlsTestComponent implements OnInit {
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  testOptions: ISelectInfo[] = [
    { id: 0, name: 'Steak', createdAt: new Date() },
    { id: 1, name: 'Pizza', createdAt: new Date() },
    { id: 2, name: 'Tacos', createdAt: new Date() }
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  onSetTheme(event: MatSlideToggleChange): void {
    const classList = this.document.body.classList;
    if (event.checked) {
      classList.add('theme-alternate');
    } else {
      classList.remove('theme-alternate');
    }
  }

  ngOnInit(): void {
  }

  setErrors(control: FormControl): void {
    const errors = this.getErrorMessages(control);
    if (errors) {
      control.setErrors({ description: errors });
    } else {
      control.setErrors(null);
    }
  }

  getErrorMessages(control: FormControl): any {
    if (control.hasError('required')) {
      return 'You must enter a value';
    }

    if (control.hasError('email')) {
      return 'Not a valid email';
    }
    return control.errors && control.errors[0];
  }
}
