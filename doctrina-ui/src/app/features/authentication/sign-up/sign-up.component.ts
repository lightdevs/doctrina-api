import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/core/extension/messages';
import { configureToastr, MustMatch, toastrTitle } from 'src/app/core/helpers';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../authentication.service';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  createUserAccountForm: FormGroup;
  loading = false;
  message = Message;
  currentUser: IUser;

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

    console.log(this.createUserAccountForm.value)
  }

  createUserAccount(): void {
    this.authService.registration(
      {
        role: 'Owner',
        ...this.createUserAccountForm.value
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.router.navigate(['/auth']);
          this.toastr.success(this.message.ACCOUNT_CREATED, toastrTitle.Success);
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
  }

  createForm(): void  {
    this.createUserAccountForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: ['', Validators.required],
      isTeacher: false,
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  clearForm(): void {
    this.createUserAccountForm.reset();
    this.createUserAccountForm.get('isTeacher').setValue(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
