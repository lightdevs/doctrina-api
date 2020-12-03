import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { DatePipe } from '@angular/common';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ProfileService } from '../profile.service';
import {Observable, Subject} from 'rxjs';
import { Message } from '../../../core/extension/messages';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {configureToastr, toastrTitle} from '../../../core/helpers';
import { ToastrService } from 'ngx-toastr';
import {DeletePopUpComponent} from '../../../shared/components/delete-pop-up/delete-pop-up.component';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  currentUser: IUserInfo;
  message = Message;
  updateProfileForm: FormGroup;


  private destroy$ = new Subject<void>();
  constructor(
    private profileService: ProfileService,
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getMe();
    configureToastr(this.toastr);
  }

  createForm(): void  {
    this.updateProfileForm = this.formBuilder.group({
      _id: [this.currentUser._id],
      email: [this.currentUser.email, Validators.required],
      name: [this.currentUser.name, Validators.required],
      surname: [this.currentUser.surname, Validators.required],
      country: [this.currentUser.country],
      city: [this.currentUser.city],
      institution: [this.currentUser.institution],
      description: [this.currentUser.description],
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateProfile(): void {
    if (this.updateProfileForm.valid) {
      this.profileService.updatePerson(
        {
          ...this.updateProfileForm.value
        }).subscribe(
        (res) => {
          this.currentUser = res.data.updatePerson;
          this.createForm();
          this.getMe();
          this.toastr.success(this.message.PROFILE_UPDATED, toastrTitle.Success);
        },
        () => {
          this.toastr.error(this.message.SOMETHING_IS_WRONG, toastrTitle.Error);
        }
      );
    } else {
      this.updateProfileForm.markAllAsTouched();
    }
  }

  getMe(): void {
    this.apollo.query<any>({
      query: gql `
        query {
        me {
          _id
          email
          name
          surname
          country
          city
          institution
          description
        }
      }`,
    }).subscribe(
      ({ data }) => {
        this.currentUser = data.me;
        this.createForm();
      }
    );
  }



  deleteProfile(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '500px';
    config.height = '200px';
    config.data = {
      title: `Are you sure?`,
      body: `Your profile will be deleted.`
    };
    const dialogRef = this.dialog.open(DeletePopUpComponent, config);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result != null) {
          if (result === true ) {
            this.profileService.deleteProfile(this.currentUser._id)
              .subscribe(() => {
                this.authService.logout();
                this.router.navigate(['/']);
              });
          }
        }
        return;
      });
  }
}
