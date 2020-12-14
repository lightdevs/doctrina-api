import { AddAnswerComponent } from './../add-answer/add-answer.component';
import { IAnswer } from './../../../core/interfaces/answer.interface';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TaskDataService } from '../task-data.service';
import { ITask } from 'src/app/core/interfaces/task.interface';
import { saveAs } from 'file-saver';
import { toastrTitle } from 'src/app/core/helpers';
import { DOCUMENT } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { AddLinkComponent } from 'src/app/shared/components/add-link/add-link.component';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {

  answers: IAnswer[] = [];
  isUploading: boolean;
  @Input() taskId: string;
  @Input() canEdit: boolean;

  private destroy$ = new Subject<void>();
  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private http: HttpClient,
              @Inject(DOCUMENT) document,
              private taskService: TaskDataService,
              private toastr: ToastrService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMyTaskAnswer();
  }

  getMyTaskAnswer(): void {
    this.taskService.getMyAnswerByTask(this.taskId)
      .subscribe(res => {
        if (res.data.myAnswersByTask) {
          this.answers = res.data.myAnswersByTask;
          this.getAnswersMaterials();
        }
      })
  }

  getAnswersMaterials(): void {
    this.answers.forEach(x => {
      this.taskService.getAnswersMaterial(x._id)
        .subscribe(res => {
          if (res.data.filesOfAnswer) {
            x.materials = res.data.filesOfAnswer;
          }
        });
    });
  }

  formatSize(bytes): string {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = 1 < 0 ? 0 : 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  downloadFile(fileId: string, fileName: string, filteType: string): void {
    this.taskService.downloadFile(fileId)
    .subscribe(response => {
      saveAs(response, `${fileName}.${filteType.split('/')[1]}`);
      });
  }

  deleteFile(id): void {
    /*this.taskService.deleteFile(id)
      .subscribe(() => this.getLessonMaterial());*/
  }

  uploadDocument(event: any, answerId: string): void {
    if (event.target.files.length === 0){
      return;
    }

    this.isUploading = true;
    this.taskService.uploadAnswerMaterial(event.target.files[0], answerId)
      .subscribe(() => {
          this.isUploading = false;
          this.getAnswersMaterials();
          this.toastr.success('Document has been uploaded!', toastrTitle.Success);
        },
        () => {
          this.isUploading = false;
        }
      );
    event.target.value = '';
  }

  clickElementWithId(index: number): void {
    document.getElementById('inputFile ' + index).click();
  }

  addAnswer(): void {
    const config = new MatDialogConfig();
    config.panelClass = `modal-setting`;
    config.width = '500px';
    config.height = '300px';
    const dialogRef = this.dialog.open(AddAnswerComponent, config);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
          if (result) {
            this.taskService.addAnswer({
              ...result,
              taskId: this.taskId
            })
            .subscribe(() => this.getMyTaskAnswer());
          }
      });
  }
}
