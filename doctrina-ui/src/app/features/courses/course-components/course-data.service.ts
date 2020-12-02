import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IEditCourseForm} from 'src/app/core/interfaces/course.interface';
import {Apollo, gql} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class CourseDataService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

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

  addLesson(title: string, idCourse: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addLesson($title: String!, $idCourse: ID!) {
        addLesson(title: $title, idCourse: $idCourse) {
          _id
        }
      }
    `,
      variables: {
        title,
        idCourse
      },
    });
  }

  updateLesson(form): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation updateLesson($id: ID!, $title: String!, $description: String, $dateStart: Date!, $dateEnd: Date!, $type: String, $maxMark: Int) {
        updateLesson(id: $id, title: $title, description: $description, dateStart: $dateStart, dateEnd: $dateEnd, type: $type, maxMark: $maxMark) {
          _id
          title
          description
          dateStart
          dateEnd
          maxMark
          type
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

  deleteLesson(lessonId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteLesson($id: ID!) {
        deleteLesson(id: $id) {
          affectedRows
        }
      }
    `,
        variables: {
          id: lessonId
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
        count: 1000
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

  uploadFile(uploadFile , currentCourseId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation uploadCourseMaterial($courseId: String!, $file: Upload!) {
        uploadCourseMaterial(courseId: $courseId, file: $file)
      }
    `,
        variables: {
          courseId: currentCourseId,
          file: uploadFile
        },
        context: {
          useMultipart: true
       }
    });
  }

  getCourseMaterial(courseId: string): Observable<any> {
    return  this.apollo.query<any>({
      query: gql `query filesByCourse($courseId: String!, $mimetype: String) {
        filesByCourse(courseId: $courseId, mimetype: $mimetype) {
          _id
          title
          fileId
          description
          size
          mimetype
        }
      }`,
      variables: {
        courseId,
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

  getLessonsByCourse(id: string): Observable<any> {
    return  this.apollo.query<any>({
      query: gql `query lessonsByCourse($courseId: String!) {
        lessonsByCourse(courseId: $courseId) {
            _id
            course
            title
            type
            description
            dateStart
            dateEnd
            maxMark
          }
        }`,
      variables: {
        courseId: id,
      },
    });
  }

  downloadFile(id: string): Observable<any> {
    return this.http.get(`http://localhost:5000/download?id=` + id, {responseType: 'blob'});
  }



  addCourseLink(idCourse: string , form): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addCourseLink($idCourse: ID!, $description: String!, $link: String!) {
        addCourseLink(idCourse: $idCourse, description: $description, link: $link) {
          _id
        }
      }
    `,
        variables: {
          idCourse,
          ...form
        },
        context: {
          useMultipart: true
       }
    });
  }

  deleteCourseLink(linkId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteCourseLink($id: ID!) {
        deleteCourseLink(id: $id) {
          affectedRows
        }
      }
    `,
        variables: {
          id: linkId
        },
    });
  }

  deleteFile(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteFile($id: String!) {
        deleteFile(id: $id) {
          affectedRows
        }
      }
    `,
        variables: {
          id
        },
    });
  }

  getCourseLinks(courseId: string): Observable<any> {
    return  this.apollo.query<any>({
      query: gql `query linksByCourse($id: String!) {
        linksByCourse(id: $id) {
          _id
          description
          link
        }
      }`,
      variables: {
        id: courseId,
      },
    });
  }
}
