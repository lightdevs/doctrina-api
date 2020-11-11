import {Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DatePipe } from '@angular/common';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ProfileService } from '../profile.service';
import { Subject } from 'rxjs';
import { Message } from '../../../core/extension/messages';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-courses',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit, OnDestroy {
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
    public dialogRef: MatDialogRef<ProfileComponent>
  ) {
    authService.currentUser.subscribe( x => this.currentUser = x);
  }

  ngOnInit() {
    this.createForm();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  createForm(): void  {
    this.updateProfileForm = this.formBuilder.group({
      _id: [null, Validators.required],
      email: [null, Validators.required],
      name: [null, Validators.required],
      surname: [null, Validators.required],
      country: [null, Validators.required],
      city: [null, Validators.required],
      institution: [null,  Validators.required],
      description: [null,  Validators.required],
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }







}
