import { environment } from '../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { IRegistrationForm, IUserInfo } from 'src/app/core/interfaces/user.interface';
import { Apollo, ApolloBase, gql } from 'apollo-angular';

const getTokenValue = (): any => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user;
};

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<IUserInfo>;
  public currentUser: Observable<IUserInfo>;
  constructor(private apollo: Apollo) {
    this.currentUserSubject = new BehaviorSubject<IUserInfo>(getTokenValue());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(form): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            _id
            email
            name
            surname
            country
            city
            institution
            accountType
            token
          }
        }
      `,
      variables: {
        ...form
      },
    }).pipe(map((res: any) => {
      console.log(res?.data);
      if (res?.data?.login && res?.data?.login?.token) {
          localStorage.setItem('currentUser', JSON.stringify(res?.data?.login));
          this.currentUserSubject.next(res?.data?.login);
      }
      return res?.data?.login;
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken() {
    return localStorage.getItem('currentUser');
  }

  registration(form: IRegistrationForm): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation register($email: String!, $name: String!, $surname: String!, $password: String!, $accountType: String!) {
          register(email: $email, name: $name, surname: $surname, password: $password, accountType: $accountType) {
            _id
          }
        }
      `,
      variables: {
        ...form
      },
    });
  }
}

