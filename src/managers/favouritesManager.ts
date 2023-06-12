import { v4 as uuidv4 } from "uuid";
import { IFavourites } from "../interfaces/IFavourites";
import { IFavouritesRepository } from "../interfaces/IFavouritesRepository";

export class FavouritesManager {
  private _favouritesRepo: IFavouritesRepository;

  constructor(favouritesRepo: IFavouritesRepository) {
    this._favouritesRepo = favouritesRepo;
  }

  public async addFavourite(userId: string, adId: string) {
    const fav = FavouritesBuilder.buildFavourite(userId, adId);
    await this._favouritesRepo.create(fav);

    return fav.id;
  }

  public async getFavourites(userId: string) {
    return await this._favouritesRepo.getUsersFavourites(userId);
  }

  public async deleteFavourite(userId: string, id: string) {
    const f = await this._favouritesRepo.get(id);

    if (!f) {
      throw new Error(`Favourite with id ${id} doesn't exist`);
    }

    if (f.userId === userId) {
      await this._favouritesRepo.delete(id);
    } else {
      throw new Error("user is not an owner of favourite");
    }
  }
}

class FavouritesBuilder {
  static buildFavourite(userId: string, adId: string): IFavourites {
    return {
      id: uuidv4(),
      userId,
      adId,
    };
  }
}
