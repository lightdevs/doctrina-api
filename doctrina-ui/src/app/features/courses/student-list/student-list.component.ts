import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

  courseId: string;
  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute,
              private courseService: CoursesService,
              public dialog: MatDialog) {
    this.courseId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
  }

}
