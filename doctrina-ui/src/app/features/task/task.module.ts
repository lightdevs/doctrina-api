import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { TaskRoutingModule } from './task-routing.module';
import { MainComponent } from './main/main.component';
import { TaskInfoComponent } from './task-info/task-info.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { AddAnswerComponent } from './add-answer/add-answer.component';
import { AnswersComponent } from './answers/answers.component';


@NgModule({
  declarations: [MainComponent, TaskInfoComponent, EditTaskComponent, AddAnswerComponent, AnswersComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
    SharedModule
  ]
})
export class TaskModule { }
