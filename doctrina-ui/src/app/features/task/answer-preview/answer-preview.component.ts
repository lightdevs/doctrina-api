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


@Component({
  selector: 'app-answer-preview',
  templateUrl: './answer-preview.component.html',
  styleUrls: ['./answer-preview.component.scss'],
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
  ) {
    this.answer = data.answer;
    this.answerId = data.answer._id;
    this.student = data.author;
  }

  ngOnInit(): void {
    this.getComments();
    this.getFilesOfAnswer();
    this.createCommentForm();
    this.createMarkForm();
  }

  getComments() {
    this.taskService.getAnswerById(this.answerId).subscribe(res => {
      this.answer = res.data.answerById;

      for ( let i = 0 ; i < this.answer.comments.length; i++) {
        this.taskService.getCommentById(this.answer.comments[i]).subscribe(y => {
          this.comments[i] = y.data.commentById;
        });
      }
    });
  }

  getFilesOfAnswer(): void {
    this.taskService.getFilesOfAnswer(this.answerId).subscribe(res => {
      this.materials = res.data;
    });
  }

  createCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      text: [null, Validators.required]
    });
  }

  createMarkForm(): void {
    this.markForm = this.formBuilder.group({
      mark: [this.answer.mark, Validators.required],
      answerId: this.answerId
    });
  }

  setAnswerMark(): void {
    console.log(this.markForm);
    this.taskService.setAnswerMark(this.markForm.value.answerId, this.markForm.value.mark).subscribe(res => {
      this.getComments();
    });
  }

  addComment(): void {
    this.taskService.addComment(this.commentForm.value.text, this.answerId).subscribe(res => {
      this.getComments();
      this.commentForm.reset({
        text: ' '
      });
    });
  }

  onCommentFormSubmit(): void {
    if (this.commentForm.valid) {
      this.addComment();
    } else {
      this.commentForm.markAllAsTouched();
    }
  }

  onMarkFormSubmit(): void {
    if (this.markForm.valid) {
      this.setAnswerMark();
    } else {
      this.markForm.markAllAsTouched();
    }
  }

  getDate(date: string): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}
