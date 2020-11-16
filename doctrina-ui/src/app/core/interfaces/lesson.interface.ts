import { ILink } from './link.interface';

export interface ILesson {
  _id: string;
  course: string;
  title: string;
  description?: string;
  materials: string[];
  links: ILink[]
  dateStart: Date;
  dateEnd: Date;
  maxMark: number;
  type: string;
}
