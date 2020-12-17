import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {IUserInfo} from 'src/app/core/interfaces/user.interface';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ScheduleService} from '../schedule.service';
import {Subject} from 'rxjs';
import {FormGroup, FormBuilder, Validators, FormGroupDirective} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {configureToastr, toastrTitle} from '../../../core/helpers';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-create-schedule-group',
  templateUrl: './create-schedule-group.component.html',
  styleUrls: ['./create-schedule-group.component.scss'],
})
export class CreateScheduleGroupComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  currentUser: IUserInfo;
  courses = [];
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
        this.courses = res.data.fullCoursesByPerson.map(course => {
          course.lessons.map(lesson => {
            lesson.tasks.map(task => {
              task.selected = false;
              return task;
            });
            lesson.lesson.selected = false;
            return lesson;
          });
          course.course.selected = false;
          return course;
        });
        console.log(this.courses);
      });
  }

  changeCourseSelection(id) {
    this.courses.map(course => {
      if (course.course._id === id) {
        course.course.selected = !course.course.selected;
        course.lessons.forEach(lesson => {
          this.changeLessonSelection(lesson.lesson._id);
        });
      }
    });
  }

  changeLessonSelection(id) {
    this.courses.map(course => {
      course.lessons.map(lesson => {
        if (lesson.lesson._id === id) {
          lesson.lesson.selected = !lesson.lesson.selected;
          lesson.tasks.forEach(task => {
            this.changeTaskSelection(task._id);
          });
        }
      });
    });
  }

  changeTaskSelection(id) {
    this.courses.map(course => {
      course.lessons.map(lesson => {
        lesson.tasks.forEach(task => {
          if (task._id === id) {
            task.selected = !task.selected;
          }
        });
      });
    });
  }

  createGroup(): void {
    this.scheduleService.createGroup(this.groupTitle)
      .subscribe(
        (result) => {
          this.groupId = result.data.createCourse._id;
        }
      );
  }

  addGroupEllements() {
    const courses = [];
    const lessons = [];
    const tasks = [];

    this.courses.forEach(course => {
      const courseLessons = [];
      course.lessons.forEach(lesson => {
        const lessonTasks = [];
        lesson.tasks.forEach(task => {
          if (task.selected) {
            lessonTasks.push(task._id);
          }
        });
        if (lessonTasks.length === lesson.tasks.length) {
          courseLessons.push(lesson._id);
        } else {
          tasks.push(lessonTasks);
        }
      });
      if (courseLessons.length === course.lessons.length) {
        courses.push(course._id);
      } else {
        lessons.push(courseLessons);
      }
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
