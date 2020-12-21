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

  groupsByPerson(userId: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query groupsByPerson($id: String!) {
        groupsByPerson(id: $id) {
          _id
          author
          title
          courses
          lessons
          tasks
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

  addGroupCourses(idGroup: string, idCourse: string[]): Observable<any> {
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

  addGroupLessons(idGroup: string, idLesson: string[]): Observable<any> {
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

  addGroupTasks(idGroup: string, idTask: string[]): Observable<any> {
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

  getScheduleByGroups(form: any): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query getScheduleByGroups($groups: [ID!], $dateStart: Date, $dateEnd: Date, $expandLessons: Boolean) {
        getScheduleByGroups(groups: $groups, dateStart: $dateStart, dateEnd: $dateEnd, expandLessons: $expandLessons) {
          dateStart
          dateEnd
          events {
            __typename
            ... on Task {
              title
              _id
              dateStart
              dateEnd
              parentInstance
              currentGroup
            }
            ... on Lesson {
              title
              _id
              course
              dateStart
              dateEnd
              type
              currentGroup
            }
          }
        }
      }
    `,
      variables: {
        ...form
      },
    });
  }

  getLessonById(lessonId: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query lessonById($id: String!) {
        lessonById(id: $id) {
          _id
          course
          title
          description
          type
          dateStart
          dateEnd
          maxMark
        }
      }`,
      variables: {
        id: lessonId,
      },
    });
  }
}
