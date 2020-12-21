export interface Group {
  _id: string;
  author: string;
  title: string;
  courses: string[];
  lessons: string[];
  tasks: string[];
  selected: boolean;
  color: string;
}
