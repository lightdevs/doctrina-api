export interface  ITask {
  _id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  maxMark: number;
  answers: string[];
  links: string[];
  parentInstance: string;
}

