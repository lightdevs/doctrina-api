import {ILesson} from 'src/app/core/interfaces/lesson.interface';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {toastrTitle} from 'src/app/core/helpers';
import {ICourses} from 'src/app/core/interfaces/course.interface';
import {IMaterials} from 'src/app/core/interfaces/filte.interface';
import {ILink} from 'src/app/core/interfaces/link.interface';
import {IUserInfo} from 'src/app/core/interfaces/user.interface';
import {AddLinkComponent} from 'src/app/shared/components/add-link/add-link.component';
import {CancelPopUpComponent} from 'src/app/shared/components/cancel-pop-up/cancel-pop-up.component';
import {AuthenticationService} from 'src/app/features/authentication/authentication.service';
import {LessonDataService} from '../lesson-data.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-lesson-info',
  templateUrl: './lesson-info.component.html',
  styleUrls: ['./lesson-info.component.scss']
})
export class LessonInfoComponent implements OnInit, OnDestroy {

  @Input() course: BehaviorSubject<ICourses>;
  @Input() lesson: BehaviorSubject<ILesson>;
  @Input() teacherInfo: IUserInfo;
  @Input() canEdit: boolean;
  options: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  filteredOptions: Observable<number[]>;
  editLessoForm: FormGroup;
  editLesson = false;
  isUploading: boolean;
  materials: IMaterials[] = [];
  links: ILink[] = [];
  visitors = [];
  currentUser: IUserInfo;

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private http: HttpClient,
              private lessonService: LessonDataService,
              private toastr: ToastrService,
              public dialog: MatDialog) {
    authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  // tslint:disable-next-line:typedef
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editLessoForm.dirty) {
      $event.returnValue = false;
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.lesson
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.lesson.value) {
          this.initForm(this.lesson.value);
          this.getLessonLinks();
          this.getLessonMaterial();
          if (!this.lessonWill()) {
            this.getVisitorsByLesson();
          }
        }
      });
    this.filteredOptions = (this.editLessoForm.get('maxMark') as FormControl).valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(''),
        map(value => this._filter(value))
      );
  }

  createForm(): void {
    this.editLessoForm = this.formBuilder.group({
      id: [null, Validators.required],
      title: [null, Validators.required],
      type: [null, Validators.required],
      description: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      maxMark: [null, Validators.required],
    });
  }

  initForm(lesson: ILesson): void {
    this.editLessoForm.reset();
    this.editLessoForm.patchValue(lesson);
    this.editLessoForm.get('dateStart').setValue(new Date(lesson.dateStart));
    this.editLessoForm.get('dateEnd').setValue(new Date(lesson.dateEnd));
    this.editLessoForm.get('id').setValue(lesson._id);
  }


  updateLessonInfo(): void {
    if (this.editLessoForm.valid) {

      this.lessonService.updateLesson(
        {
          ...this.editLessoForm.value
        })
        .subscribe(res => {
          console.log(res);
          this.editLesson = false;
          this.lesson.next(res.data.updateLesson);
        });
    } else {
      this.editLessoForm.markAllAsTouched();
    }
  }

  uploadDocument(event: any): void {
    if (event.target.files.length === 0) {
      return;
    }

    this.isUploading = true;
    this.lessonService.uploadLessonFile(event.target.files[0], this.lesson.value._id)
      .subscribe(() => {
          this.isUploading = false;
          this.getLessonMaterial();
          this.toastr.success('Document has been uploaded!', toastrTitle.Success);
        },
        () => {
          this.isUploading = false;
        }
      );

    event.target.value = '';
  }

  getLessonMaterial(): void {
    this.lessonService.getLessonMaterial(this.lesson.value._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.materials = res.data.filesByLesson;
      });
  }

  getDate(date: string): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }

  startEdit(): void {
    this.editLesson = !this.editLesson;
  }


  cancelEdit(): void {
    if (this.editLessoForm.dirty) {
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
              this.editLessoForm.reset();
              this.editLesson = !this.editLesson;
              this.initForm(this.lesson.value);
            }
          }
        });
    } else {
      this.editLesson = !this.editLesson;
    }
  }

  downloadFile(fileId: string, fileName: string, filteType: string): void {
    this.lessonService.downloadFile(fileId)
      .subscribe(response => {
        saveAs(response, `${fileName}.${filteType.split('/')[1]}`);
      });
  }


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

  addLink(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '500px';
    config.height = '300px';
    const dialogRef = this.dialog.open(AddLinkComponent, config);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.lessonService.addLessonLink(this.lesson.value._id, result)
            .subscribe(() => this.getLessonLinks());
        }
      });
  }

  getLessonLinks(): void {
    this.lessonService.getLessonLinks(this.lesson.value._id)
      .subscribe(res => this.links = res.data.linksByLesson);
  }

  deleteLessonLink(id): void {
    this.lessonService.deleteLessonLink(id)
      .subscribe(() => this.getLessonLinks());
  }

  deleteFile(id): void {
    this.lessonService.deleteFile(id)
      .subscribe(() => this.getLessonMaterial());
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

  lessonWill(): boolean {
    return this.lesson.value?.dateStart > new Date();
  }

  lessonNow(): boolean {
    const today = new Date();
    return this.lesson.value?.dateEnd >= today && this.lesson.value?.dateStart <= today;
  }

  lessonEnded(): boolean {
    return this.lesson.value?.dateEnd < new Date();
  }


  getVisitorsByLesson(): void {
    this.lessonService.getVisitorsByLesson(this.lesson.value._id).subscribe(res => {
      this.visitors = res.data.visitorsByLesson;
      console.log(res.data.visitorsByLesson);
    });
  }

  markVisited(): void {
    this.lessonService.markVisited(this.lesson.value._id).subscribe(res => {
      this.getVisitorsByLesson();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
