import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUserInfo} from '../../core/interfaces/user.interface';

const getTokenValue = (): any => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user;
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentUserSubject: BehaviorSubject<IUserInfo>;
  public currentUser: Observable<IUserInfo>;
  constructor(private apollo: Apollo) {
    this.currentUserSubject = new BehaviorSubject<IUserInfo>(getTokenValue());
    this.currentUser = this.currentUserSubject.asObservable();
  }
}
