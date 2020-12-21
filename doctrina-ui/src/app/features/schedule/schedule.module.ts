import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScheduleComponent} from './schedule/schedule.component';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../shared/material.module';
import {CreateScheduleGroupComponent} from './create-schedule-group/create-schedule-group.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { WeekSheduleComponent } from './week-shedule/week-shedule.component';


@NgModule({
  declarations: [
    ScheduleComponent,
    CreateScheduleGroupComponent,
    WeekSheduleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange', logEnabled: false }),
  ]
})
export class ScheduleModule {
}
