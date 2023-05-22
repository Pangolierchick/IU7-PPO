import { v4 as uuidv4 } from "uuid";
import { IAdvertisement } from "../interfaces/IAdvertisement";
import { IAdvertisementRepository } from "../interfaces/IAdvertisementRepository";
import { IRent } from "../interfaces/IRent";
import { IRentRepository } from "../interfaces/IRentRepository";
import { INITIAL_SCORE, UserRole } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";

type AdvertisimentToBeApproved = {
  description: string;
  cost: number;
  address: string;
  ownerId: string;
};

export class AdvertisementManager {
  private _advertisimentRepository: IAdvertisementRepository;

  private _userRepository: IUserRepository;

  private _rentRepository: IRentRepository;

  constructor(
    adRepo: IAdvertisementRepository,
    userRepo: IUserRepository,
    rentRepo: IRentRepository
  ) {
    this._advertisimentRepository = adRepo;
    this._userRepository = userRepo;
    this._rentRepository = rentRepo;
  }

  public async getAdvertisiment(adId: string) {
    const ad = await this._advertisimentRepository.get(adId);

    if (!ad) {
      throw new Error(`Advertisiment with id ${adId} was not found`);
    }

    return ad;
  }

  public async createAdvertisiment(data: AdvertisimentToBeApproved) {
    const adv = AdvertisimentBuilder.buildAdvertisiment(data);
    await this._advertisimentRepository.create(adv);

    return adv.id;
  }

  public async getUsersAdvertisiments(userId: string) {
    const ads = await this._advertisimentRepository.getUsersAdvertisiments(
      userId
    );

    return ads;
  }

  public async newRent(adId: string, userId: string, from: Date, to: Date) {
    const user = await this._userRepository.get(userId);
    const ad = await this._advertisimentRepository.get(adId);

    if (from > to) {
      [from, to] = [to, from];
    }

    const today = new Date();

    if (from < today) {
      throw new Error("Date can't be less than today date");
    }

    if (user === null) {
      throw new Error(`User ${userId} doesn't exist`);
    }

    if (ad === null) {
      throw new Error(`Ad ${adId} doesn't exist`);
    }

    if (userId === ad.ownerId) {
      throw new Error("Owner cant rent own advertisement");
    }

    if (!ad.isApproved) {
      throw new Error(`Ad ${adId} is not approved`);
    }

    const rents = await this._rentRepository.getInDate(adId, from, to);

    if (rents.length !== 0) {
      throw new Error(`Ad ${adId} already occupied in this dates`);
    }

    const rent = RentBuilder.buildRent(adId, userId, from, to);
    await this._rentRepository.create(rent);

    return rent.id;
  }

  public async addAdvertisiment(ad: AdvertisimentToBeApproved) {
    const user = await this._userRepository.get(ad.ownerId);

    if (user === null) {
      throw new Error(`User ${ad.ownerId} doesn't exist`);
    }

    const _ad = AdvertisimentBuilder.buildAdvertisiment(ad);
    await this._advertisimentRepository.create(_ad);
    return _ad.id;
  }

  public async approveAd(adId: string, adminId: string) {
    const user = await this._userRepository.get(adminId);

    if (user === null) {
      throw new Error(`User ${adminId} doesn't exist`);
    }

    if (user.role !== UserRole.Admin) {
      throw new Error(`User ${adminId} not an admin`);
    }

    const ad = await this._advertisimentRepository.get(adId);

    if (ad === null) {
      throw new Error(`Advertisement ${adId} doesn't exist`);
    }

    await this._advertisimentRepository.approve(adId);

    return user.id;
  }

  public async deleteAd(adId: string, userId: string) {
    const user = await this._userRepository.get(userId);
    const ad = await this._advertisimentRepository.get(adId);

    if (user === null) {
      throw new Error(`User ${userId} doesn't exist`);
    }

    if (ad === null) {
      throw new Error(`Ad with id ${adId} doesn't exist`);
    }

    if (user.role === UserRole.Admin || userId === ad.ownerId) {
      await this._advertisimentRepository.delete(adId);
    } else {
      throw new Error("User neither admin nor owner");
    }
  }

  public async searchAdvertisiments(needle: string) {
    const ads = await this._advertisimentRepository.getAllWithOwner();

    if (needle) {
      const city = needle.split(",")[0]; //FIXME: search by city (maybe someday ill fix it)

      const byCity = ads.filter(
        (x) =>
          x.address.split(",")[0].toLowerCase() === city.toLowerCase() &&
          x.isApproved
      );

      return byCity;
    }

    return ads.filter((x) => x.isApproved);
  }

  public async getAdvertisimentWithOwner(id: string) {
    const ad = await this._advertisimentRepository.getWithOwner(id);

    if (!ad) {
      throw new Error(`Advertisiment with id ${id} was not found`);
    }

    return ad;
  }

  public async getAdvertisimentsRentDates(id: string) {
    const rents = await this._rentRepository.getAdvertisimentRents(id);
    const dates: string[] = [];

    rents.forEach((r) => {
      dates.push(`${r.dateFrom.toISOString()}:${r.dateUntil.toISOString()}`);
    });

    return dates;
  }

  public async getUsersRents(id: string) {
    try {
      const rents = await this._rentRepository.getUsersRents(id);
      return rents;
    } catch (e) {
      throw new Error("Failed to get users rents");
    }
  }
}

class RentBuilder {
  public static buildRent(
    adId: string,
    userId: string,
    from: Date,
    to: Date
  ): IRent {
    return {
      id: uuidv4(),
      adId: adId,
      userId: userId,
      dateFrom: from,
      dateUntil: to,
    };
  }
}

class AdvertisimentBuilder {
  public static buildAdvertisiment(
    ad: AdvertisimentToBeApproved
  ): IAdvertisement {
    return {
      id: uuidv4(),
      description: ad.description,
      ownerId: ad.ownerId,
      cost: ad.cost,
      address: ad.address,
      score: INITIAL_SCORE,
      isApproved: false,
    };
  }
}
