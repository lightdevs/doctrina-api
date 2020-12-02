import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditTaskComponent } from './edit-task/edit-task.component';


const routes: Routes = [
  { path: '', redirectTo: 'main'},
  { path: 'main', component: MainComponent },
  { path: 'zema/:id/:lessonId/:taskId', component: EditTaskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
