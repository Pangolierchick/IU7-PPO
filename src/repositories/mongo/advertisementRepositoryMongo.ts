import { Collection, Db, Document } from "mongodb";
import {
  IAdvertisement,
  IAdvertisementWithOwner,
} from "../../interfaces/IAdvertisement";
import { IAdvertisementRepository } from "../../interfaces/IAdvertisementRepository";

export class AdvertisimentRepositoryMongo implements IAdvertisementRepository {
  private collection: Collection<IAdvertisement>;

  constructor(db: Db) {
    this.collection = db.collection<IAdvertisement>("advertisement");
  }

  convert(ad: Document): IAdvertisementWithOwner {
    return {
      ownerId: ad.user.id,
      login: ad.user.login,
      ownerScore: ad.user.score,
      id: ad.id,
      description: ad.description,
      score: ad.score,
      isApproved: ad.isApproved,
      cost: ad.cost,
      address: ad.address,
    };
  }

  async get(id: string): Promise<IAdvertisement | null> {
    const advertisement = await this.collection.findOne({
      id,
    });
    return advertisement;
  }

  async getAll(): Promise<IAdvertisement[]> {
    const advertisements = await this.collection
      .find()
      .sort({ address: 1 })
      .toArray();
    return advertisements;
  }

  async update(newAdv: IAdvertisement): Promise<void> {
    try {
      await this.collection.updateOne({ id: newAdv.id }, { $set: newAdv });
    } catch (e) {
      throw new Error(`Failed to update advertisement with id=${newAdv.id}.`);
    }
  }

  async create(data: IAdvertisement): Promise<void> {
    try {
      await this.collection.insertOne(data);
    } catch (e) {
      throw new Error(
        `Failed to create advertisement. ${(e as Error).message}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ id });
    } catch (e) {
      throw new Error("Failed to delete advertisement");
    }
  }

  async updateScore(id: string, score: number): Promise<void> {
    try {
      await this.collection.updateOne({ id }, { $set: { score } });
    } catch (e) {
      throw new Error(`Failed to update score of advertisement with id=${id}`);
    }
  }

  async updateDescription(id: string, descr: string): Promise<void> {
    try {
      await this.collection.updateOne({ id }, { $set: { description: descr } });
    } catch (e) {
      throw new Error(
        `Failed to update description of advertisement with id=${id}`
      );
    }
  }

  async updatePrice(id: string, price: number): Promise<void> {
    try {
      await this.collection.updateOne({ id }, { $set: { cost: price } });
    } catch (e) {
      throw new Error(`Failed to update price of advertisement with id=${id}`);
    }
  }

  async approve(id: string): Promise<void> {
    try {
      await this.collection.updateOne({ id }, { $set: { isApproved: true } });
    } catch (e) {
      throw new Error(`Failed to approve advertisement with id=${id}`);
    }
  }

  async getUsersAdvertisiments(userId: string): Promise<IAdvertisement[]> {
    try {
      const advertisements = await this.collection
        .find({ ownerId: userId })
        .toArray();
      return advertisements;
    } catch (e) {
      throw new Error("Failed to get users advertisements");
    }
  }

  async getAllWithOwner(): Promise<IAdvertisementWithOwner[]> {
    const advertisements = await this.collection
      .aggregate([
        {
          $lookup: {
            from: "user",
            localField: "ownerId",
            foreignField: "id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $sort: { address: 1 },
        },
      ])
      .toArray();

    const converted = advertisements.map((ad) => {
      return this.convert(ad);
    });

    return converted;
  }

  async getWithOwner(id: string): Promise<IAdvertisementWithOwner | null> {
    const advertisement = await this.collection
      .aggregate([
        {
          $match: { id },
        },
        {
          $lookup: {
            from: "user",
            localField: "ownerId",
            foreignField: "id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
      ])
      .toArray();

    if (advertisement.length > 0) {
      const ad = advertisement[0];

      return this.convert(ad);
    }

    return null;
  }
}
