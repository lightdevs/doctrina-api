import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  constructor(private apollo: Apollo, private http: HttpClient) {}

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
  }taskById

  getTaskById(taskId: string): Observable<any> {
    return  this.apollo.query<any>({
      query: gql `query taskById($id: String!) {
        taskById(id: $id) {
          _id
          title
          description
          dateStart
          dateEnd
          maxMark
        }
      }`,
      variables: {
        id: taskId,
      },
    });
  }


  getLessonById(lessonId: string): Observable<any> {
    return  this.apollo.query<any>({
      query: gql `query lessonById($id: String!) {
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

  updateTask(form): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation updateTask($id: ID!, $title: String!, $description: String, $dateStart: Date!, $dateEnd: Date!, $maxMark: Int) {
        updateTask(id: $id, title: $title, description: $description, dateStart: $dateStart, dateEnd: $dateEnd, maxMark: $maxMark) {
          _id
          title
          description
          dateStart
          dateEnd
          maxMark
        }
      }
    `,
      variables: {
        ...form
      },
    });
  }

  uploadTaskFile(uploadFile , lessonId: string): Observable<any> {
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
}
