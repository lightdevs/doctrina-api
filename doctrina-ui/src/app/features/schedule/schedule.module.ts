import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScheduleComponent} from './schedule/schedule.component';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../shared/material.module';
import {CreateScheduleGroupComponent} from './create-schedule-group/create-schedule-group.component';


@NgModule({
  declarations: [
    ScheduleComponent,
    CreateScheduleGroupComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
  ]
})
export class ScheduleModule {
}
