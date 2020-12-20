import { takeUntil } from 'rxjs/operators';
import { Group } from './../../../core/interfaces/group.interface';
import { getTestBed } from '@angular/core/testing';
import { ScheduleService } from './../schedule.service';
import { Component, Inject, Input, LOCALE_ID, OnInit, OnDestroy } from '@angular/core';
import { CalendarDateFormatter, CalendarView, DateAdapter } from 'angular-calendar';
import { endOfDay, addMonths, subYears, addMinutes, subMinutes } from 'date-fns';
import { addPeriod, CalendarSchedulerEvent, CalendarSchedulerEventAction, DAYS_IN_WEEK, endOfPeriod,
  SchedulerDateFormatter, SchedulerEventTimesChangedEvent, SchedulerViewDay, SchedulerViewHour, SchedulerViewHourSegment, startOfPeriod, subPeriod } from 'angular-calendar-scheduler';
import { Subject, BehaviorSubject } from 'rxjs';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-week-shedule',
  templateUrl: './week-shedule.component.html',
  styleUrls: ['./week-shedule.component.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: SchedulerDateFormatter
  }]
})

export class WeekSheduleComponent implements OnInit, OnDestroy  {

  @Input() refreshGroup: BehaviorSubject<any>;

  currentUser: IUserInfo;
  userGroups: Group[] = [];
  schedule: any;
  CalendarView = CalendarView;


  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  viewDays: number = DAYS_IN_WEEK;
  forceViewDays: number = DAYS_IN_WEEK;
  refresh: Subject<any> = new Subject();
  locale = 'en';
  hourSegments = 2;
  weekStartsOn = 1;
  startsWithToday = true;
  activeDayIsOpen = true;
  excludeDays: number[] = []; // [0];
  dayStartHour = 6;
  dayEndHour = 24;

  minDate: Date = endOfDay(subYears(new Date(), 1));
  maxDate: Date = endOfDay(addMonths(new Date(), 1));
  dayModifier: Function;
  hourModifier: Function;
  segmentModifier: Function;
  eventModifier: Function;
  prevBtnDisabled = false;
  nextBtnDisabled = false;

  actions: CalendarSchedulerEventAction[] = [
      {
          when: 'enabled',
          label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
          title: 'Delete',
          onClick: (event: CalendarSchedulerEvent): void => {
          }
      },
      {
          when: 'cancelled',
          label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">autorenew</i></span>',
          title: 'Restore',
          onClick: (event: CalendarSchedulerEvent): void => {
          }
      }
  ];

  events: CalendarSchedulerEvent[] =  [];

  private destroy$ = new Subject<void>();
  constructor(@Inject(LOCALE_ID) locale: string,
              private appService: ScheduleService,
              private dateAdapter: DateAdapter,
              private router: Router,
              private authenticationService: AuthenticationService) {
    authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.locale = locale;

    // this.dayModifier = ((day: SchedulerViewDay): void => {
    //     day.cssClass = this.isDateValid(day.date) ? '' : 'cal-disabled';
    // }).bind(this);

    // this.hourModifier = ((hour: SchedulerViewHour): void => {
    //     hour.cssClass = this.isDateValid(hour.date) ? '' : 'cal-disabled';
    // }).bind(this);

    this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
        segment.isDisabled = !this.isDateValid(segment.date);
    }).bind(this);

    this.eventModifier = ((event: CalendarSchedulerEvent): void => {
        event.isDisabled = !this.isDateValid(event.start);
    }).bind(this);

    this.dateOrViewChanged();
  }

  ngOnInit(): void {
    this.refreshGroup
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.groupsByPerson();
      })
    this.groupsByPerson();
    /*this.appService.getTestBed(this.actions)
        .then((events: CalendarSchedulerEvent[]) => this.events = events);*/
  }

  viewDaysOptionChanged(viewDays: number): void {
      this.forceViewDays = viewDays;
  }

  changeDate(date: Date): void {
      this.viewDate = date;
      this.dateOrViewChanged();
  }

  changeView(view: CalendarView): void {
      this.view = view;
      this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
      if (this.startsWithToday) {
          this.prevBtnDisabled = !this.isDateValid(subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
          this.nextBtnDisabled = !this.isDateValid(addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
      } else {
          this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
          this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
      }
      console.log(this.minDate, this.maxDate)
      if (this.viewDate < this.minDate) {
          this.changeDate(this.minDate);
      } else if (this.viewDate > this.maxDate) {
          this.changeDate(this.maxDate);
      }
  }

  private isDateValid(date: Date): boolean {
      return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
  }

  viewDaysChanged(viewDays: number): void {
      console.log('viewDaysChanged', viewDays);
      this.viewDays = viewDays;
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
      console.log('dayHeaderClicked Day', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
      console.log('hourClicked Hour', hour);
  }

  segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
      console.log('segmentClicked Action', action);
      console.log('segmentClicked Segment', segment);
  }

  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    const element = this.schedule.events.find(x => x._id ===  event.id);
    if (element.__typename === 'Lesson') {
      this.router.navigate(['/courses/lesson/', element.course, element._id, ]);
    } else {
      this.appService.getLessonById(element.parentInstance)
        .subscribe( res => {
          this.router.navigate(['/tasks/zema/', res.data.lessonById.course, element.parentInstance, element._id]);
        });
    }
  }

  eventTimesChanged({ event, newStart, newEnd, type }: SchedulerEventTimesChangedEvent): void {
      const ev: CalendarSchedulerEvent = this.events.find(e => e.id === event.id);
      ev.start = newStart;
      ev.end = newEnd;
      this.refresh.next();
  }

  groupsByPerson(): void {
    this.appService.groupsByPerson(this.currentUser._id)
      .subscribe(res => {
        this.userGroups = res.data.groupsByPerson;
        this.userGroups.forEach(x => {
          x.selected = true;
          x.color = this.getRandomColor();
        });
        this.getScheduleByGroups();
      });
  }

  getScheduleByGroups(): void {
    this.appService.getScheduleByGroups({
      groups: this.userGroups.filter(x => x.selected).map(x => x._id),
      dateStart: this.minDate,
      dateEnd: this.maxDate,
      expandLessons: true
    })
    .subscribe(res => {
      this.schedule = res.data.getScheduleByGroups;
      this.events = [];
      this.schedule.events.forEach(element => {
        const color = this.userGroups.find(x => x._id === element.currentGroup).color;
        this.events.push({
          id: element._id,
          start: element.__typename === 'Task' ?  subMinutes(new Date(element.dateEnd), 30) : new Date(element.dateStart),
          end: new Date(element.dateEnd),
          title: element.title,
          content: 'Start At: ' + new Date(element.dateStart).toLocaleTimeString() + '<br>' + 'End At: ' + new Date(element.dateEnd).toLocaleTimeString(),
          actions: [],
          color: { primary: color, secondary: color },
          isClickable: true,
          isDisabled: false,
          draggable: false,
          resizable: {
              beforeStart: false,
              afterEnd: false
          }
        });
      });
      console.log(res.data.getScheduleByGroups);
    });
  }

  getRandomColor(): string {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

