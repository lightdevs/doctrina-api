import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ICoursesInfo, ICreateCourseForm, IEditCourseForm} from 'src/app/core/interfaces/course.interface';
import {Apollo, gql} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private apollo: Apollo) {}

  createCourse(form: ICreateCourseForm): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation createCourse($title: String!, $description: String!, $dateStart: Date!, $dateEnd: Date!, $maxMark: Int!) {
        createCourse(title: $title, description: $description, dateStart: $dateStart, dateEnd: $dateEnd, maxMark: $maxMark) {
          _id
        }
      }
    `,
      variables: {
        ...form
      },
    });
  }

  updateCourse(form: IEditCourseForm): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation updateCourse($id: ID!, $title: String!, $description: String!, $dateStart: Date!, $dateEnd: Date!, $maxMark: Int!, $teacher: ID!) {
        updateCourse(id: $id, title: $title, description: $description, dateStart: $dateStart, dateEnd: $dateEnd, maxMark: $maxMark, teacher: $teacher) {
          _id
          title
          description
          dateStart
          dateEnd
          maxMark
          teacher
          students
        }
      }
    `,
      variables: {
        ...form
      },
    });
  }


  getCourseById(courseId: string): Observable<any> {
    return  this.apollo.query<any>({
      query: gql `query courseById($id: String!, $page: Int!, $count: Int!) {
        courseById(id: $id, page: $page, count: $count) {
          course {
            _id
            title
            description
            dateStart
            dateEnd
            maxMark
            teacher
            students
          }
        }
      }`,
      variables: {
        id: courseId,
        page: 0,
        count: 0
      },
    });
  }

  getTeacherName(teacherId: string): Observable<any> {
    return  this.apollo.query<any>({
      query: gql `query personById($id: String!, $page: Int!, $count: Int!) {
        personById(id: $id, page: $page, count: $count) {
          person {
            _id
            email
            name
            surname
            country
            city
            institution
          }
        }
      }`,
      variables: {
        id: teacherId,
        page: 0,
        count: 0
      },
    });
  }

  getStudentsOfCourse(courseId: string): Observable<any> {
    return  this.apollo.query<any>({
        query: gql `query courseById($id: String!, $page: Int!, $count: Int!) {
          courseById(id: $id, page: $page, count: $count) {
            students {
              _id
              email
              name
              surname
              country
              city
            }
          }
        }`,
        variables: {
          id: courseId,
          page: 0,
          count: 1000
        },
    });
  }

  getStudents(): Observable<any> {
    return  this.apollo.query<any>({
        query: gql `query persons($id: String!, $page: Int!, $count: Int!) {
          persons(id: $id, page: $page, count: $count) {
            students {
              _id
              email
              name
              surname
              country
              city
            }
          }
        }`,
        variables: {
          page: 0,
          count: 1000
        },
    });
  }
}
