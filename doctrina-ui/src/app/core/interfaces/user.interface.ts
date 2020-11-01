export interface IAssignUser {
    userId: string;
    projectId: number;
}

export interface IUserInfo {
    email: string;
    name: string;
    surname: string;
    country: string;
    city: string;
    institution: string;
    accountType: string;
    token: string;
    coursesTakesPart?: any[];
    coursesConducts?: any[];
}

export interface IRegistrationForm {
  email: string;
  name: string;
  password: string;
  accountType: string;
}
