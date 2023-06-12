import { IFavourites, IFavouritesWithUser } from "./IFavourites";
import { IRepository } from "./IRepository";

export interface IFavouritesRepository extends IRepository<IFavourites> {
  getUsersFavourites(userId: string): Promise<IFavourites[]>;
  getWithUser(id: string): Promise<IFavouritesWithUser | null>;
}
