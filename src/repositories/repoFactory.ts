import { PrismaClient } from "@prisma/client";
import { Db, MongoClient } from "mongodb";
import { config } from "../config";
import { IAdvertisementRepository } from "../interfaces/IAdvertisementRepository";
import { IFavouritesRepository } from "../interfaces/IFavouritesRepository";
import { IRentRepository } from "../interfaces/IRentRepository";
import { IUserRepository } from "../interfaces/IUserRepository";
import { AdvertisimentRepositoryMongo } from "./mongo/advertisementRepositoryMongo";
import { FavouritesRepositoryMongo } from "./mongo/favouritesRepositoryMongo";
import { RentRepositoryMongo } from "./mongo/rentRepositoryMongo";
import { UserRepositoryMongo } from "./mongo/userRepositoryMongo";
import { AdvertisimentRepository } from "./sql/advertisimentRepository";
import { FavouritesRepository } from "./sql/favouritesRepository";
import { RentRepository } from "./sql/rentRepository";
import { UserRepository } from "./sql/userRepository";

export class RepoFactory {
  private db;
  private prisma;
  constructor() {
    const mongo = new MongoClient(config.mongouri);
    this.db = new Db(mongo, config.mongodbname);
    this.prisma = new PrismaClient();
  }
  public getAdvertisementRepository(): IAdvertisementRepository {
    if (config.dbtype === "mongo") {
      return new AdvertisimentRepositoryMongo(this.db);
    } else {
      return new AdvertisimentRepository(this.prisma);
    }
  }

  public getFavouritesRepository(): IFavouritesRepository {
    if (config.dbtype === "mongo") {
      return new FavouritesRepositoryMongo(this.db);
    } else {
      return new FavouritesRepository(this.prisma);
    }
  }

  public getUserRepository(): IUserRepository {
    if (config.dbtype === "mongo") {
      return new UserRepositoryMongo(this.db);
    } else {
      return new UserRepository(this.prisma);
    }
  }

  public getRentRepository(): IRentRepository {
    if (config.dbtype === "mongo") {
      return new RentRepositoryMongo(this.db);
    } else {
      return new RentRepository(this.prisma);
    }
  }
}
