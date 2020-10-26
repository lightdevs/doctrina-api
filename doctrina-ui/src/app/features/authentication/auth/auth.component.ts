import { SignUpComponent } from './../sign-up/sign-up.component';
import { SignInComponent } from './../sign-in/sign-in.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  @ViewChild(SignInComponent) signIn: SignInComponent;
  @ViewChild(SignUpComponent) signUp: SignUpComponent;
  @ViewChild('tabs') tabGroup: MatTabGroup;

  constructor() { }

  ngOnInit(): void {
  }

  onTabChanged(): void {
    this.signIn.clearForm();
    this.signUp.clearForm();
  }

  openSignIn(event: any): void {
    this.tabGroup.selectedIndex = 2;
  }

}
