import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../shared/material.module';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule
  ]
})
export class ProfileModule { }
