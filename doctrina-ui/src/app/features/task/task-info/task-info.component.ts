import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {takeUntil, startWith, map} from 'rxjs/operators';
import {ICourses} from 'src/app/core/interfaces/course.interface';
import {ILesson} from 'src/app/core/interfaces/lesson.interface';
import {IUserInfo} from 'src/app/core/interfaces/user.interface';
import {CancelPopUpComponent} from 'src/app/shared/components/cancel-pop-up/cancel-pop-up.component';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ITask} from 'src/app/core/interfaces/task.interface';
import {TaskDataService} from '../task-data.service';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements OnInit, OnDestroy {

  @Input() course: BehaviorSubject<ICourses>;
  @Input() lesson: BehaviorSubject<ILesson>;
  @Input() task: BehaviorSubject<ITask>;
  @Input() teacherInfo: IUserInfo;
  @Input() canEdit: boolean;
  options: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  filteredOptions: Observable<number[]>;
  editTaskForm: FormGroup;
  editTask = false;
  isUploading: boolean;
  currentUser: IUserInfo;

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private http: HttpClient,
              private taskService: TaskDataService,
              private toastr: ToastrService,
              public dialog: MatDialog) {
    authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  // tslint:disable-next-line:typedef
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editTaskForm.dirty) {
      $event.returnValue = false;
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.task
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.task.value) {
          this.initForm(this.task.value);
        }
      })
    this.filteredOptions = (this.editTaskForm.get('maxMark') as FormControl).valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(''),
        map(value => this._filter(value))
      );
  }

  createForm(): void {
    this.editTaskForm = this.formBuilder.group({
      id: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      maxMark: [null, Validators.required],
    });
  }

  initForm(task: ITask): void {
    this.editTaskForm.reset();
    this.editTaskForm.patchValue(task);
    this.editTaskForm.get('dateStart').setValue(new Date(task.dateStart));
    this.editTaskForm.get('dateEnd').setValue(new Date(task.dateEnd));
    this.editTaskForm.get('id').setValue(task._id);
  }

  updateLessonInfo(): void {
    if (this.editTaskForm.valid) {

      this.taskService.updateTask(
        {
          ...this.editTaskForm.value
        })
        .subscribe(res => {
          this.editTask = false;
          this.lesson.next(res.data.updateTask);
        });
    } else {
      this.editTaskForm.markAllAsTouched();
    }
  }

  uploadDocument(event: any): void {
    if (event.target.files.length === 0) {
      return;
    }

    this.isUploading = true;
    /*this.lessonService.uploadLessonFile(event.target.files[0], this.lesson.value._id)
      .subscribe(() => {
          this.isUploading = false;
          this.getLessonMaterial();
          this.toastr.success('Document has been uploaded!', toastrTitle.Success);
        },
        () => {
          this.isUploading = false;
        }
      );*/

    event.target.value = '';
  }

  getDate(date: string): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }

  startEdit(): void {
    this.editTask = !this.editTask;
  }

  cancelEdit(): void {
    if (this.editTaskForm.dirty) {
      const config = new MatDialogConfig();
      config.panelClass = `modal-setting`;
      config.width = '500px';
      config.height = '200px';
      const dialogRef = this.dialog.open(CancelPopUpComponent, config);
      dialogRef.afterClosed()
        .pipe(
          takeUntil(this.destroy$))
        .subscribe(result => {
          if (result != null) {
            if (result) {
              this.editTaskForm.reset();
              this.editTask = !this.editTask;
              this.initForm(this.task.value);
            }
          }
        });
    } else {
      this.editTask = !this.editTask;
    }
  }

  /* downloadFile(fileId: string, fileName: string, filteType: string): void {
     this.taskService.downloadFile(fileId)
     .subscribe(response => {
       saveAs(response, `${fileName}.${filteType.split('/')[1]}`);
       });
   }*/

  protected saveFile(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;

    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  getfile(link: string): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        Authorization: this.authenticationService.currentUserValue.token,
      })
    };


    return this.http.get<Blob>(link, httpOptions);
  }

  deleteFile(id): void {
    this.taskService.deleteFile(id)
      .subscribe();
  }

  protected getFileName(response: HttpResponse<Blob>): string {
    const disposition = response.headers.get('content-disposition');
    return disposition?.split(';')[1]?.split('=')[1]?.replace(/"/g, '') ?? 'document1';
  }

  formatSize(bytes): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = 1 < 0 ? 0 : 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  private _filter(value: string): number[] {
    if (value) {
      return this.options.filter(option => (option.toString()).indexOf(value) === 0);
    }
    return this.options;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
