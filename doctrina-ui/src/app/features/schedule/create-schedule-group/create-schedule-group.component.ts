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
import {Message} from '../../../core/extension/messages';

@Component({
  selector: 'app-create-schedule-group',
  templateUrl: './create-schedule-group.component.html',
  styleUrls: ['./create-schedule-group.component.scss'],
})
export class CreateScheduleGroupComponent implements OnInit, OnDestroy {

  message = Message;

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
    if (this.groupTitle === undefined) {
      this.toastr.error(this.message.INVALID_GROUP_TITLE, toastrTitle.Success);
      return;
    }
    this.scheduleService.createGroup(this.groupTitle)
      .subscribe((result) => {
          this.groupId = result.data.createGroup._id;
          this.collectGroupEllements(result.data.createGroup._id);
        }
      );
  }

  collectGroupEllements(groupId) {
    const courses: string[] = [];
    const lessons: string[] = [];
    const tasks: string[] = [];

    this.courses.forEach(course => {
      const courseLessons: string[] = [];
      course.lessons.forEach(lesson => {
        const lessonTasks: string[] = [];
        lesson.tasks.forEach(task => {
          if (task.selected) {
            lessonTasks.push(task._id);
          }
        });
        if (lessonTasks.length === lesson.tasks.length && lesson.tasks.length !== 0) {
          courseLessons.push(lesson.lesson._id);
        } else {
          tasks.push(...lessonTasks);
        }
      });
      if (courseLessons.length === course.lessons.length  && course.lessons.length !== 0) {
        courses.push(course.course._id);
      } else {
        lessons.push(...courseLessons);
      }
    });

    console.log(courses.length);
    console.log(lessons.length);
    console.log(tasks.length);
    if (courses.length === 0 && lessons.length === 0 && tasks.length === 0) {
      this.toastr.error(this.message.DID_NOT_SELECT_ANY_ELEMENT, toastrTitle.Success);
      return;
    }

    this.addGroupEllements(groupId, courses, lessons, tasks);
  }

  addGroupEllements(groupId, courses, lessons, tasks) {
    if (courses.length > 0) {
      this.scheduleService.addGroupCourse(groupId, courses).subscribe((x) => {
        console.log(x);
      });
    }

    if (lessons.length > 0) {
      this.scheduleService.addGroupLesson(groupId, lessons).subscribe((y) => {
        console.log(y);
      });
    }

    if (tasks.length > 0) {
      this.scheduleService.addGroupLesson(groupId, tasks).subscribe((z) => {
        console.log(z);
      });
    }

    this.toastr.success(this.message.SCHEDULE_GROUP_CREATED, toastrTitle.Success);
  }


  ngOnInit() {
    configureToastr(this.toastr);
    this.getFullCoursesByPerson();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
