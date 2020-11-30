import { toastrTitle } from 'src/app/core/helpers';
import { ToastrService } from 'ngx-toastr';
import { HostListener, Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { ICourses } from 'src/app/core/interfaces/course.interface';
import { IUserInfo } from 'src/app/core/interfaces/user.interface';
import { CancelPopUpComponent } from 'src/app/shared/components/cancel-pop-up/cancel-pop-up.component';

import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { IMaterials } from 'src/app/core/interfaces/filte.interface';
import { ILink } from 'src/app/core/interfaces/link.interface';
import { AuthenticationService } from 'src/app/features/authentication/authentication.service';
import { AddLinkComponent } from 'src/app/shared/components/add-link/add-link.component';
import { CourseDataService } from '../course-data.service';
import { DomService } from 'src/app/core/services/dom.service';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit, OnDestroy {

  @Input() course: BehaviorSubject<ICourses>;
  @Input() teacherInfo: IUserInfo;
  @Input() canEdit: boolean;
  options: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  filteredOptions: Observable<number[]>;
  editCourseForm: FormGroup;
  editCourse = false;
  isUploading: boolean;
  materials: IMaterials[] = [];
  links: ILink[] = [];

  private destroy$ = new Subject<void>();
  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private http: HttpClient,
              private courseService: CourseDataService,
              private toastr: ToastrService,
              private domService: DomService,
              public dialog: MatDialog) { }

      // tslint:disable-next-line:typedef
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editCourseForm.dirty) {
        $event.returnValue = false;
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.course
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if(this.course.value) {
          this.initForm(this.course.value);
          this.getCourseLinks();
          this.getCourseMaterial();
        }
      })
    this.filteredOptions = (this.editCourseForm.get('maxMark') as FormControl).valueChanges
    .pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  createForm(): void  {
    this.editCourseForm = this.formBuilder.group({
      id: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      maxMark: [null, Validators.required],
      teacher: [null,  Validators.required],
      identifier: { value: null, disabled: true }
    });
  }

  initForm(course: ICourses): void {
    this.editCourseForm.reset();
    this.editCourseForm.patchValue(course);
    this.editCourseForm.get('dateStart').setValue(new Date(course.dateStart));
    this.editCourseForm.get('dateEnd').setValue(new Date(course.dateEnd));
    this.editCourseForm.get('id').setValue(course._id);
  }


  updateCourseInfo(): void {
    if (this.editCourseForm.valid) {

      this.courseService.updateCourse(
        {
          ...this.editCourseForm.value
        })
        .subscribe(res => {
          console.log(res);
          this.editCourse = false;
          this.course.next(res.data.updateCourse);
        });
    } else {
      this.editCourseForm.markAllAsTouched();
    }
  }

  uploadDocument(event: any): void {
    if (event.target.files.length === 0){
      return;
    }

    this.isUploading = true;
    this.courseService.uploadFile(event.target.files[0], this.course.value._id)
      .subscribe(() => {
          this.isUploading = false;
          this.getCourseMaterial();
          this.toastr.success('Document has been uploaded!', toastrTitle.Success);
        },
        () => {
          this.isUploading = false;
        }
      );

    event.target.value = '';
  }

  getCourseMaterial(): void {
    this.courseService.getCourseMaterial(this.course.value._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.materials = res.data.filesByCourse;
      });
  }

  getDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  startEdit(): void {
    this.editCourse = !this.editCourse;
  }


  cancelEdit(): void {
    if (this.editCourseForm.dirty) {
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
              this.editCourseForm.reset();
              this.editCourse = !this.editCourse;
              this.initForm(this.course.value);
            }
          }
        });
    } else {
      this.editCourse = !this.editCourse;
    }
  }

  downloadFile(fileId: string, fileName: string, filteType: string): void {
    this.courseService.downloadFile(fileId)
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
              this.courseService.addCourseLink(this.course.value._id, result)
              .subscribe(() => this.getCourseLinks());
            }
        });
  }

  getCourseLinks(): void {
    this.courseService.getCourseLinks(this.course.value._id)
      .subscribe(res => this.links = res.data.linksByCourse);
  }

  deleteCourseLinks(id): void {
    this.courseService.deleteCourseLink(id)
      .subscribe(() => this.getCourseLinks());
  }

  deleteFile(id): void {
    this.courseService.deleteFile(id)
      .subscribe(() => this.getCourseMaterial());
  }

  protected getFileName(response: HttpResponse<Blob>): string {
    const disposition = response.headers.get('content-disposition');
    return disposition?.split(';')[1]?.split('=')[1]?.replace(/"/g, '') ?? 'document1';
  }

  formatSize(bytes): string {
    if (bytes === 0) return '0 Bytes';

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
