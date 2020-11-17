import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr';
import { ControlsTestComponent } from './components/controls-test/controls-test.component';
import { CancelPopUpComponent } from './components/cancel-pop-up/cancel-pop-up.component';
import { DeletePopUpComponent } from './components/delete-pop-up/delete-pop-up.component';
import { AddLinkComponent } from './components/add-link/add-link.component';


@NgModule({
  declarations: [
    ControlsTestComponent,
    CancelPopUpComponent,
    DeletePopUpComponent,
    AddLinkComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule.forRoot(),
    MaterialModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
