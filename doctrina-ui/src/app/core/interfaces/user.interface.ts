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
    roles: any;
    userName: string;
    id: number;
}
