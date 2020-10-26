import { IUserInfo } from './../core/interfaces/user.interface';
import { AuthenticationService } from './../features/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser: IUserInfo;
  constructor(private authService: AuthenticationService, private router: Router) {
    authService.currentUser.subscribe( x => this.currentUser = x);
  }

  ngOnInit(): void {
  }

  onSearch(value: string): void {

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
