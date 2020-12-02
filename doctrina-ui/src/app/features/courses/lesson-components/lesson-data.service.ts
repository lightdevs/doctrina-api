import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonDataService {

  constructor(private apollo: Apollo, private http: HttpClient) {
  }

  getCourseById(courseId: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query courseById($id: String!, $page: Int!, $count: Int!) {
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
    return this.apollo.query<any>({
      query: gql`query personById($id: String!, $page: Int!, $count: Int!) {
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


  getLessonMaterial(lessonId: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query filesByLesson($lessonId: String!, $mimetype: String) {
        filesByLesson(lessonId: $lessonId, mimetype: $mimetype) {
          _id
          title
          fileId
          description
          size
          mimetype
        }
      }`,
      variables: {
        lessonId,
      },
    });
  }

  uploadLessonFile(uploadFile, lessonId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation uploadLessonMaterial($lessonId: String!, $file: Upload!) {
        uploadLessonMaterial(lessonId: $lessonId, file: $file)
      }
    `,
      variables: {
        lessonId,
        file: uploadFile
      },
      context: {
        useMultipart: true
      }
    });
  }


  downloadFile(id: string): Observable<any> {
    return this.http.get(`http://localhost:5000/download?id=` + id, {responseType: 'blob'});
  }

  getLessonLinks(lessonId: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query linksByLesson($id: String!) {
        linksByLesson(id: $id) {
          _id
          description
          link
        }
      }`,
      variables: {
        id: lessonId,
      },
    });
  }

  deleteLessonLink(linkId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteLessonLink($id: ID!) {
        deleteLessonLink(id: $id) {
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

  addLessonLink(idLesson: string, form): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addLessonLink($idLesson: ID!, $description: String!, $link: String!) {
        addLessonLink(idLesson: $idLesson, description: $description, link: $link) {
          _id
        }
      }
    `,
      variables: {
        idLesson,
        ...form
      },
      context: {
        useMultipart: true
      }
    });
  }

  addTask(form: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addTask($title: String!, $description: String, $dateStart: Date, $dateEnd: Date, $maxMark: Int, $parentInstance: String!) {
        addTask(title: $title, description: $description, dateStart: $dateStart, dateEnd: $dateEnd, maxMark: $maxMark, parentInstance: $parentInstance) {
          _id
        }
      }
    `,
      variables: {
        ...form
      },
    });
  }

  getTasksByLessons(id: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query tasksByLesson($id: String!) {
        tasksByLesson(id: $id) {
          task {
            _id
            title
            description
            dateStart
            dateEnd
            maxMark
            answers
            links
            parentInstance
          }
        }
      }`,
      variables: {
        id
      },
    });
  }

  deleteTask(taskId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteTask($id: String!) {
        deleteTask(id: $id) {
          affectedRows
        }
      }
    `,
      variables: {
        id: taskId
      },
    });
  }


  markVisited(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation markVisited($id: String!) {
        markVisited(id: $id)
      }
    `,
      variables: {
        id
      },
    });
  }

  getVisitorsByLesson(id: string): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query visitorsByLesson($id: String!) {
        visitorsByLesson(id: $id) {
          _id
          email
          name
          surname
          country
          city
        }
      }`,
      variables: {
        id
      },
    });
  }
}
