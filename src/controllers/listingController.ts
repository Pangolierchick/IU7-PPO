import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { AdvertisementManager } from "../managers/advertisementManager";
import { RepoFactory } from "../repositories/repoFactory";

class ListingController {
  private _advManager: AdvertisementManager;

  constructor() {
    const fact = new RepoFactory();
    const _advRepo = fact.getAdvertisementRepository();
    const _rentRepo = fact.getRentRepository();
    const _userRepo = fact.getUserRepository();

    this._advManager = new AdvertisementManager(_advRepo, _userRepo, _rentRepo);
  }

  public async getAdvertisiment(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);

      try {
        const ad = await this._advManager.getAdvertisimentWithOwner(adId);

        res.status(200).json(ad);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getUsersAdvertisiments(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { ownerId } = matchedData(req);
      try {
        const ads = await this._advManager.getUsersAdvertisiments(ownerId);

        res.json(ads);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async createAdvertisiment(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const ownerId = req.body.userId;
      const { description, cost, address } = matchedData(req);

      try {
        const adId = await this._advManager.addAdvertisiment({
          ownerId,
          description,
          cost: Number(cost),
          address,
        });

        res.status(201).json({ adId });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async newRent(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { from, to, adId } = matchedData(req);
      const userId = req.body.userId;

      try {
        const rent = await this._advManager.newRent(
          adId,
          userId,
          new Date(from),
          new Date(to)
        );
        res.status(201).json({ rent });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async approveAdvertisiment(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);
      const adminId = req.body.userId;

      try {
        const r = await this._advManager.approveAd(adId, adminId);
        res.status(200).json({ r });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async deleteAdvertisiment(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);
      const ownerId = req.body.userId;

      try {
        await this._advManager.deleteAd(adId, ownerId);
        res.status(200).json({ result: "success" });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async searchAdvertisiments(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { address } = matchedData(req);

      try {
        const ads = await this._advManager.searchAdvertisiments(address);
        res.status(200).json({ ads });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getAdvertisimentRentDates(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);

      try {
        const dates = await this._advManager.getAdvertisimentsRentDates(adId);

        res.status(200).json(dates);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getUsersRents(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { id } = matchedData(req);

      try {
        const rents = await this._advManager.getUsersRents(id);
        res.status(200).json(rents);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }
}

export default ListingController;
