import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { DatePipe } from '@angular/common';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ProfileService } from '../profile.service';
import { Subject } from 'rxjs';
import { Message } from '../../../core/extension/messages';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { configureToastr } from '../../../core/helpers';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  canEdit = false;
  currentUser: IUserInfo;
  message = Message;
  updateProfileForm: FormGroup;

  private destroy$ = new Subject<void>();
  constructor(
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    authService.currentUser.subscribe( x => this.currentUser = x);
  }

  ngOnInit() {
    this.createForm();
    configureToastr(this.toastr);
    this.getMe();

    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
        }).subscribe(res => {
          console.log(res);
          this.currentUser = res.data.updatePerson;
      });
    } else {
      this.updateProfileForm.markAllAsTouched();
    }
  }

  getMe(){
    return  this.apollo.query<any>({
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
        console.log('user: ', data.me);
        this.currentUser = data.me;
      }
    );
  }
}
