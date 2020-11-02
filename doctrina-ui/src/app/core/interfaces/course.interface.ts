import { IUserInfo } from './user.interface';

export interface ICreateCourseForm {
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  maxMark: number;
}

export interface IEditCourseForm {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  maxMark: number;
  teacher: string;
}


export interface ICourses {
  _id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  maxMark: number;
  teacher: string;
  identifier?: string;
  students?: any[];
}

export interface ICoursesInfo {
  course: ICourses;
  students: IUserInfo[];
  isEnd: boolean;
}
