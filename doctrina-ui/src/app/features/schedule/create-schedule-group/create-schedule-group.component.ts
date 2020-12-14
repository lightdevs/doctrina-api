import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {IUserInfo} from 'src/app/core/interfaces/user.interface';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ScheduleService} from '../schedule.service';
import {Subject} from 'rxjs';
import {Message} from '../../../core/extension/messages';
import {FormGroup, FormBuilder, Validators, FormGroupDirective} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {configureToastr, toastrTitle} from '../../../core/helpers';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {takeUntil} from "rxjs/operators";


@Component({
  selector: 'app-create-schedule-group',
  templateUrl: './create-schedule-group.component.html',
  styleUrls: ['./create-schedule-group.component.scss'],
})
export class CreateScheduleGroupComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  currentUser: IUserInfo;
  courses = [];

  private destroy$ = new Subject<void>();

  constructor(
    private scheduleService: ScheduleService,
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getFullCoursesByPerson(): void {
    console.log(this.currentUser._id);
    this.scheduleService.getFullCoursesByPerson(this.currentUser._id)
      .subscribe(res => {
        console.log(res.data.fullCoursesByPerson);
        this.courses = res.data.fullCoursesByPerson

      });
  }

  ngOnInit() {
    this.getFullCoursesByPerson();
    configureToastr(this.toastr);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}