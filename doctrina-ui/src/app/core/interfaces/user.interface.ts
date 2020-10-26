export interface IUser {
    token?: string;
    rw_role: string;
    name: string;
    id?: string;
    user_id?: string;
}

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
}

export interface IRegistrationForm {
  email: string;
  name: string;
  password: string;
  accountType: string;
}
