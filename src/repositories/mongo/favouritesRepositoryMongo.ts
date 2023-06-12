import { Collection, Db } from "mongodb";
import { IFavourites, IFavouritesWithUser } from "../../interfaces/IFavourites";
import { IFavouritesRepository } from "../../interfaces/IFavouritesRepository";

export class FavouritesRepositoryMongo implements IFavouritesRepository {
  private collection: Collection<IFavourites>;

  constructor(db: Db) {
    this.collection = db.collection<IFavourites>("favourites");
  }

  async getUsersFavourites(userId: string): Promise<IFavourites[]> {
    const favourites = await this.collection.find({ userId }).toArray();
    return favourites;
  }

  async getAll(): Promise<IFavourites[]> {
    const favourites = await this.collection.find().toArray();
    return favourites;
  }

  async create(data: IFavourites): Promise<void> {
    try {
      await this.collection.insertOne(data);
    } catch (e) {
      throw new Error("Failed to create favourites");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ id });
    } catch (e) {
      throw new Error("Failed to delete favourites");
    }
  }

  async update(n: IFavourites): Promise<void> {
    try {
      await this.collection.updateOne({ id: n.id }, { $set: n });
    } catch (e) {
      throw new Error("Failed to update favourites");
    }
  }

  async get(id: string): Promise<IFavourites | null> {
    const favourite = await this.collection.findOne({ id });
    return favourite;
  }

  async getWithUser(id: string): Promise<IFavouritesWithUser | null> {
    const favourite = await this.collection
      .aggregate([
        {
          $match: { id },
        },
        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            role: "$user.role",
            login: "$user.login",
            id: 0,
            userId: 0,
          },
        },
      ])
      .toArray();

    if (favourite.length > 0) {
      const fav = favourite[0];

      return {
        id: fav.id,
        role: fav.user.role,
        login: fav.user.login,
        userId: fav.user.id,
        adId: fav.adId,
      };
    }

    return null;
  }
}
