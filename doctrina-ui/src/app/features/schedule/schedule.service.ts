import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private apollo: Apollo) {}

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

  createGroup(title: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation createGroup($title: String!) {
        createGroup(title: $title) {
          _id
          title
        }
      }
    `,
      variables: {
        title
      },
    });
  }

  addGroupCourse(idGroup: string, idCourse: string[]): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addGroupCourse($idGroup: ID!, $idCourse: [ID!]) {
        addGroupCourse(idGroup: $idGroup, idCourse: $idCourse) {
         lessons
        }
      }
    `,
      variables: {
        idGroup,
        idCourse,
      },
    });
  }

  addGroupLesson(idGroup: string, idLesson: string[]): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addGroupLesson($idGroup: ID!, $idLesson: [ID!]) {
        addGroupLesson(idGroup: $idGroup, idLesson: $idLesson) {
          lessons
        }
      }
    `,
      variables: {
        idGroup,
        idLesson,
      },
    });
  }

  addGroupTask(idGroup: string, idTask: string[]): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addGroupTask($idGroup: ID!, $idTask: [ID!]) {
        addGroupTask(idGroup: $idGroup, idTask: $idTask) {
          lessons
        }
      }
    `,
      variables: {
        idGroup,
        idTask,
      },
    });
  }
}
