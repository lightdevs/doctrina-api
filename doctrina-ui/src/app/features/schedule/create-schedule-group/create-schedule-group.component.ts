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
  selectedCourses = [];
  selectedLessons = [];
  selectedTasks = [];
  groupTitle: string;
  groupId: string;


  private destroy$ = new Subject<void>();

  constructor(
    private scheduleService: ScheduleService,
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
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

  changeCourseSelection(id) {
    if (this.selectedCourses.indexOf(id) == -1) {
      this.selectedCourses.push(id);
    } else {
      this.selectedCourses = this.removeItemOnce( this.selectedCourses, id);
    }

    const course = this.courses.find(x => x.course._id == id);
    course.lessons.forEach(x => {
      this.changeLessonSelection(x._id);
    })
  }

  changeLessonSelection(id) {
    if (this.selectedLessons.indexOf(id) == -1) {
      this.selectedLessons.push(id);
    } else {
      this.selectedLessons = this.removeItemOnce(this.selectedLessons, id);
    }
    this.courses.forEach(x => {
      return x.lessons.forEach(y => {
        this.changeTaskSelection(y.lesson._id);
      });
    });
  }

  changeTaskSelection(id) {
    if (this.selectedTasks.indexOf(id) == -1) {
      this.selectedTasks.push(id);
    } else {
      this.selectedTasks = this.removeItemOnce(this.selectedTasks, id);
    }
  }

  removeItemOnce(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  createGroup(): void {
    this.scheduleService.createGroup(this.groupTitle)
      .subscribe(
        (result) => {
          this.groupId = result.data.createCourse._id;
        }
      );
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
