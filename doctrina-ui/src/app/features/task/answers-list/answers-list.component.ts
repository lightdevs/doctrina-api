import {IAnswer} from './../../../core/interfaces/answer.interface';
import {Component, Inject, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Subject} from 'rxjs';
import {AuthenticationService} from '../../authentication/authentication.service';
import {TaskDataService} from '../task-data.service';
import {saveAs} from 'file-saver';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-answers-list',
  templateUrl: './answers-list.component.html',
  styleUrls: ['./answers-list.component.scss']
})
export class AnswersListComponent implements OnInit {

  answers = [];
  isUploading: boolean;
  taskId: string;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    @Inject(DOCUMENT) document,
    private taskService: TaskDataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
    this.taskId = this.route.snapshot.params.taskId;
  }

  ngOnInit(): void {
    this.getAnswersByTask();
  }

  getAnswersByTask(): void {
    this.taskService.getAnswersByTask(this.taskId)
      .subscribe(res => {
        this.answers = res.data.answersByTask;
      });
  }

  downloadFile(fileId: string, fileName: string, filteType: string): void {
    this.taskService.downloadFile(fileId)
      .subscribe(response => {
        saveAs(response, `${fileName}.${filteType.split('/')[1]}`);
      });
  }
}
