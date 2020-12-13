import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './core/extension/auth.guard';
import {ControlsTestComponent} from './shared/components/controls-test/controls-test.component';
import {ProfileComponent} from './features/profile/profile/profile.component';
import {ScheduleComponent} from "./features/schedule/schedule/schedule.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'control',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'control', component: ControlsTestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/courses/courses.module').then(m => m.CoursesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/task/task.module').then(m => m.TaskModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
