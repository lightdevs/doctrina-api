import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, OnDestroy {

  refreshGroup = new BehaviorSubject<any>(null);
  private destroy$ = new Subject<void>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
