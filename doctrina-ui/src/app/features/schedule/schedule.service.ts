import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private apollo: Apollo) {
  }


  getFullCoursesByPerson(userId: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query fullCoursesByPerson($id: String!) {
        fullCoursesByPerson(id: $id) {
          course {
            _id
            title
          }
          lessons {
            lesson {
              _id
              title
            }
            tasks {
              _id
              title
            }
          }
        }
      }`,
      variables: {
        id: userId,
      },
    });
  }
}
