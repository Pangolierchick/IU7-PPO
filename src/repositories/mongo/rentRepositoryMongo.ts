import { Collection, Db } from "mongodb";
import { IRent } from "../../interfaces/IRent";
import { IRentRepository } from "../../interfaces/IRentRepository";

export class RentRepositoryMongo implements IRentRepository {
  private collection: Collection<IRent>;

  constructor(db: Db) {
    this.collection = db.collection<IRent>("rent");
  }

  async get(id: string): Promise<IRent | null> {
    const rent = await this.collection.findOne({ id });
    return rent;
  }

  async getAll(): Promise<IRent[]> {
    const rents = await this.collection.find().toArray();
    return rents;
  }

  async update(newRent: IRent): Promise<void> {
    try {
      await this.collection.updateOne({ id: newRent.id }, { $set: newRent });
    } catch (e) {
      throw new Error(`Failed to update rent with id = ${newRent.id}`);
    }
  }

  async create(data: IRent): Promise<void> {
    try {
      await this.collection.insertOne(data);
    } catch (e) {
      throw new Error("Failed to create new rent");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ id });
    } catch (e) {
      throw new Error("Failed to delete rent");
    }
  }

  async getInDate(adId: string, from: Date, to: Date): Promise<IRent[]> {
    const rents = await this.collection
      .find({
        adId,
        dateFrom: { $lt: to },
        dateUntil: { $gt: from },
      })
      .toArray();
    return rents;
  }

  async getAdvertisimentRents(adId: string): Promise<IRent[]> {
    const rents = await this.collection
      .find({
        adId,
      })
      .toArray();
    return rents;
  }

  async getUsersRents(id: string): Promise<IRent[]> {
    const rents = await this.collection
      .find({
        userId: id,
      })
      .toArray();
    return rents;
  }
}
