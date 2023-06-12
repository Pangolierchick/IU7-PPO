export enum UserRole {
  Admin,
  User,
  None,
}

export const INITIAL_SCORE = 0;

export interface IUser {
  id: string;
  login: string;
  password: string;
  score: number;
  role: UserRole;
}
