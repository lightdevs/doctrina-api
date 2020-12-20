import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { Message } from 'src/app/core/extension/messages';
import { configureToastr, toastrTitle } from 'src/app/core/helpers';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  message = Message;

  private destroy$ = new Subject<void>();
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              public toastr: ToastrService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    configureToastr(this.toastr);
    this.generateForm();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  generateForm() {
    this.loginForm = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required]
      }
    );
  }

  clearForm(): void {
    this.loginForm.reset();
  }

  get fields() { return this.loginForm.controls; }

  onSubmit() {
    if (true) {
    this.loading = true;
    console.log(this.loginForm.value);
    this.authenticationService.login({
      ...this.loginForm.value
    })
    .pipe(
      finalize(() => {
        this.loading = false;
      }))
    .subscribe(
        () => {
          this.toastr.success(this.message.LOGGED_IN, toastrTitle.Success);
          this.router.navigateByUrl(this.returnUrl);
        },
        err => {
          console.log(err);
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
