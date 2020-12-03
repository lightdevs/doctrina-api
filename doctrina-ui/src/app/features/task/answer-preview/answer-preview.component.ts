import {IAnswer} from './../../../core/interfaces/answer.interface';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from '../../authentication/authentication.service';
import {TaskDataService} from '../task-data.service';
import {DOCUMENT} from '@angular/common';
import {IUserInfo} from '../../../core/interfaces/user.interface';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-answer-preview',
  templateUrl: './answer-preview.component.html',
  styleUrls: ['./answer-preview.component.scss'],
  providers: [DatePipe]
})
export class AnswerPreviewComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  commentForm: FormGroup;
  markForm: FormGroup;
  answerId: string;
  answer: IAnswer;
  student: IUserInfo;
  materials = [];
  comments = [];

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    @Inject(DOCUMENT) document,
    private taskService: TaskDataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private datepipe: DatePipe
  ) {
    this.answer = data.answer;
    this.answerId = data.answer._id;
    this.student = data.author;
  }

  ngOnInit(): void {
    this.getAnswerById();
    this.getFilesOfAnswer();
    this.getComments();

    this.createCommentForm();
    this.createMarkForm();
  }

  getAnswerById(): void {
    this.taskService.getAnswerById(this.answer._id).subscribe(res => {
      this.answer = res.data.nswerById;
    });
    this.getComments();
  }

  getFilesOfAnswer(): void {
    this.taskService.getFilesOfAnswer(this.answer._id).subscribe(res => {
      this.materials = res.data;
    });
  }

  createCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      text: [null, Validators.required],
      parentInstance: this.answer.parentInstance
    });
  }

  createMarkForm(): void {
    this.markForm = this.formBuilder.group({
      mark: [this.answer.mark, Validators.required],
      answerId: this.answer._id
    });
  }

  setAnswerMark(): void {
    console.log(this.markForm);
    this.taskService.setAnswerMark(this.markForm.value.answerId, this.markForm.value.mark).subscribe(res => {
      console.log(res.data);
    });
    this.getAnswerById();
  }

  addComment(): void {
    this.taskService.addComment(this.commentForm.value.text, this.commentForm.value.parentInstance).subscribe(res => {
      console.log(res.data);
    });
    this.getAnswerById();
  }

  onCommentFormSubmit(): void {
    if (this.commentForm.valid
    ) {
      this.setAnswerMark();
    } else {
      this.commentForm.markAllAsTouched();
    }
  }

  onMarkFormSubmit(): void {
    if (this.markForm.valid
    ) {
      this.setAnswerMark();
    } else {
      this.markForm.markAllAsTouched();
    }
  }

  getComments() {
    this.answer.comments.forEach(x => {
      this.taskService.getCommentById(x)
        .subscribe(res => {
          this.comments.push(
            res.data.commentById
          );
        });
    });
  }

  getDate(date: string): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}
