import {LessonDataService} from './../lesson-data.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {toastrTitle} from 'src/app/core/helpers';
import {DeletePopUpComponent} from 'src/app/shared/components/delete-pop-up/delete-pop-up.component';
import {AddTaskComponent} from '../add-task/add-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  @Input() courseId: string;
  @Input() lessonId: string;
  @Input() canEdit: boolean;

  tasks: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
              private lessonService: LessonDataService,
              private toastr: ToastrService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    console.log(this.lessonId);
    this.getTasks();
  }

  getTasks(): void {
    this.lessonService.getTasksByLessons(this.lessonId)
      .subscribe(res => {
        if (res.data.tasksByLesson) {
          res.data.tasksByLesson.forEach(x => {
            x.task.dateStart = new Date(x.task.dateStart);
            x.task.dateEnd = new Date(x.task.dateEnd);
          });
          this.tasks = res.data.tasksByLesson;
        }
      });
  }

  addTask(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.disableClose = true;
    config.data = this.lessonId;
    const dialogRef = this.dialog.open(AddTaskComponent, config);
    dialogRef.afterClosed()
      .subscribe(() => this.getTasks());
  }

  deleteTask(taskId: string): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '500px';
    config.height = '200px';
    config.data = {
      title: `Are you sure?`,
      body: `Task will be deleted`
    };
    const dialogRef = this.dialog.open(DeletePopUpComponent, config);
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          if (result === true) {
            this.lessonService.deleteTask(taskId)
              .subscribe(() => {
                this.toastr.success(`Task Deleted`, toastrTitle.Success);
                this.getTasks();
              });
          }
        }
        return;
      });
  }

  openTask(id: string): void {
    this.router.navigate(['/tasks/zema/', this.courseId, this.lessonId, id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
