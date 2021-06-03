export interface BaseUser {
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
};

export interface IUser extends BaseUser {
    id: number;
}

export interface IResult {
    page: number,
    total_pages: number,
    total: number,
    users: Array<IUser>
};

export interface Errors {
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    submit: boolean;
}