import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUserInfo} from '../../core/interfaces/user.interface';
import {IEditPersonForm} from '../../core/interfaces/user.interface';

const getTokenValue = (): any => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user;
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private apollo: Apollo) { }

  updatePerson(form: IEditPersonForm): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation updatePerson(
        $id: ID!,
        $email: String,
        $name: String,
        $surname: String,
        $country: String,
        $city: String,
        $institution: String,
        $description: String,
        $photo: String
      ) {
        updatePerson(
          id: $id,
          email: $email,
          name: $name,
          surname: $surname,
          country: $country,
          city: $city,
          institution: $institution,
          description: $description,
          photo: $photo
        ) {
          _id
          email
          name
          surname
          country
          city
          institution
          description
        }
      }
    `,
      variables: {
        ...form
      },
    });
  }
}
