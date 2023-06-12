import { UserRole } from "./IUser";

export interface IFavourites {
  id: string;
  userId: string;
  adId: string;
}

export interface IFavouritesWithUser extends IFavourites {
  role: UserRole;
  login: string;
}
