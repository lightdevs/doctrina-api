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
    return  this.apollo.query({
        query: gql `query courseById($id: String!, $page: Int!, $count: Int!) {
          courseById(id: $id, page: $page, count: $count) {
            persons {
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

  getStudents(filterEmail: string = null): Observable<any> {
    return  this.apollo.query<any>({
        query: gql `query persons($email: String, $page: Int!, $count: Int!) {
          persons(email: $email, page: $page, count: $count) {
            persons {
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
          email: filterEmail,
          page: 0,
          count: 1000
        },
    });
  }

  getStudentsNotOnThisCourse(courseId: string, filterEmail: string | null): Observable<any> {
    return  this.apollo.query({
      query: gql `query personsNotOnCourse($courseId: String, $email: String, $page: Int!, $count: Int!) {
        personsNotOnCourse(courseId: $courseId, email: $email, page: $page, count: $count) {
          persons {
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
        courseId,
        email: filterEmail,
        page: 0,
        count: 100000
      },
    });
  }

  assignStudent(studentId: string, courseId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addStudent($idCourse: ID!, $idPerson: ID!) {
        addStudent(idCourse: $idCourse, idPerson: $idPerson) {
          _id
        }
      }
    `,
        variables: {
          idCourse: courseId,
          idPerson: studentId,
        },
    });
  }

  deleteStudent(studentId: string, courseId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation removeStudent($idCourse: ID!, $idPerson: ID!) {
        removeStudent(idCourse: $idCourse, idPerson: $idPerson) {
          _id
        }
      }
    `,
        variables: {
          idCourse: courseId,
          idPerson: studentId,
        },
    });
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteCourse($id: ID!) {
        deleteCourse(id: $id) {
          affectedRows
        }
      }
    `,
        variables: {
          id: courseId
        },
    });
  }

  getMyCourse(userId: string) {
    return  this.apollo.query<any>({
      query: gql `query personById($id: String!, $page: Int!, $count: Int!) {
        personById(id: $id, page: $page, count: $count) {
          courses {
            _id
            title
            description
            dateStart
            dateEnd
            maxMark
            teacher
          }
        }
      }`,
      variables: {
        id: userId,
        page: 0,
        count: 1000
      },
  });
  }

  getCourses(filterValue: string = null, sort: string = null): Observable<any> {
    console.log(filterValue);
    return  this.apollo.query<any>({
      query: gql `query courses($sort: String, $title: String, $page: Int!, $count: Int!) {
          courses(sort: $sort, title: $title, page: $page, count: $count) {
          courses {
              _id,
              title,
              description,
              dateStart,
              dateEnd,
              maxMark,
              teacher
            }
          }
        }`,
      variables: {
        sort,
        title: filterValue,
        page: 0,
        count: 1000
      },
    });
  }
}
