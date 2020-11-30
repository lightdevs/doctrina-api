import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ICreateCourseForm} from 'src/app/core/interfaces/course.interface';
import {Apollo, gql} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private apollo: Apollo) {
  }

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

  getMyCourse(userId: string) {
    return this.apollo.query<any>({
      query: gql`query personById($id: String!, $page: Int!, $count: Int!) {
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

  getCourses(page: number = 0, count: number = 5, filterValue: string = null, sort: string = null): Observable<any> {
    return this.apollo.query<any>({
      query: gql`query courses($sort: String, $title: String, $page: Int!, $count: Int!) {
          courses(sort: $sort, title: $title, page: $page, count: $count) {
          courses {
            course{
                _id
                title
                description
                dateStart
                dateEnd
                maxMark
                teacher
            }
            teacher { name surname email}
            }
          }
        }`,
      variables: {
        sort,
        title: filterValue,
        page,
        count
      },
    });
  }
}
