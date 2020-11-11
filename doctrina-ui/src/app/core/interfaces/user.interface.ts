export interface IAssignUser {
    userId: string;
    projectId: number;
}

export interface IUserInfo {
  _id: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  country: string;
  city: string;
  institution: string;
  description: string;
  photo: string;
  accountType: string;
  coursesTakesPart: any[];
  coursesConducts: any[];
  token: string;
}

export interface IRegistrationForm {
  email: string;
  name: string;
  password: string;
  accountType: string;
}

export interface IEditPersonForm {
  _id: string;
  email: string;
  name: string;
  surname: string;
  country: string;
  city: string;
  institution: string;
  description: string;
  photo: string;
}
