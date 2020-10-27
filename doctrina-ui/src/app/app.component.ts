import { Component } from '@angular/core';
import { IUserInfo } from './core/interfaces/user.interface';
import { AuthenticationService } from './features/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'doctrina-ui';

  currentUser: IUserInfo;
  constructor(private authService: AuthenticationService) {
    authService.currentUser.subscribe( x => this.currentUser = x);
  }
}
