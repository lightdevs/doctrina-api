import { IMaterials } from './filte.interface';

export interface IAnswer {
  _id: string;
  title: string;
  person: string;
  parentInstance: string;
  timeAdded: Date;
  mark: number;
  comments: string[];
  materials: IMaterials[];
}
