import {Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ProfileService } from '../profile.service';



@Component({
  selector: 'app-courses',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit, OnDestroy {

  currentUser: IUserInfo;

  constructor(
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private datepipe: DatePipe
  ) {
    authService.currentUser.subscribe( x => this.currentUser = x);
  }


  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
