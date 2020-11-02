import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/core/extension/messages';
import { configureToastr, MustMatch, toastrTitle } from 'src/app/core/helpers';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../authentication.service';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  @Output() openSignIn = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  createUserAccountForm: FormGroup;
  loading = false;
  message = Message;
  currentUser: IUserInfo;

  private destroy$ = new Subject<void>();
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthenticationService,
              private toastr: ToastrService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    if (this.currentUser){
      this.router.navigate(['/project']);
    }
    this.createForm();
    configureToastr(this.toastr);
  }

  onSubmit(): void {
    if (this.createUserAccountForm.valid) {
      this.createUserAccount();
    } else {
      this.createUserAccountForm.markAllAsTouched();
    }
  }

  createUserAccount(): void {
    this.authService.registration(
      {
        ...this.createUserAccountForm.value
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.clearForm();
          this.toastr.success(this.message.ACCOUNT_CREATED, toastrTitle.Success);
          this.openSignIn.next(null);
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
  }

  createForm(): void  {
    this.createUserAccountForm = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      accountType: 'student',
    });
  }

  clearForm(): void {
    this.formDirective.resetForm();
    this.createUserAccountForm.get('accountType').setValue('student');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
