import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlsTestComponent } from './shared/components/controls-test/controls-test.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  { path: 'control', component: ControlsTestComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
