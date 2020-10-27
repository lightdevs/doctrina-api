import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ICreateCourseForm} from 'src/app/core/interfaces/course.interface';
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
}
