import { PrismaClient } from "@prisma/client";
import {
  IAdvertisement,
  IAdvertisementWithOwner,
} from "../interfaces/IAdvertisement";
import { IAdvertisementRepository } from "../interfaces/IAdvertisementRepository";

export class AdvertisimentRepository implements IAdvertisementRepository {
  private prisma: PrismaClient;
  private convert = (
    ad: IAdvertisement & {
      user: { id: string; login: string; score: number };
    }
  ) => {
    const convertedAd: IAdvertisementWithOwner = {
      ownerScore: ad.user.score,
      login: ad.user.login,
      ...ad,
    };

    return convertedAd;
  };

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  async get(id: string): Promise<IAdvertisement | null> {
    return this.prisma.advertisement.findFirst({ where: { id } });
  }

  async getAll(): Promise<IAdvertisement[]> {
    return this.prisma.advertisement.findMany({ orderBy: { address: "asc" } });
  }

  async update(newAdv: IAdvertisement): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        data: newAdv,
        where: { id: newAdv.id },
      });
    } catch (e) {
      throw new Error(`Failed to update advertisiment with id=${newAdv.id}.`);
    }
  }

  async create(data: IAdvertisement): Promise<void> {
    try {
      await this.prisma.advertisement.create({ data });
    } catch (e) {
      throw new Error(
        `Failed to create advertisiment. ${(e as Error).message}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.advertisement.delete({ where: { id } });
    } catch (e) {
      throw new Error("Failed to delete advertisiment");
    }
  }

  async updateScore(id: string, score: number): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { score },
      });
    } catch (e) {
      throw new Error(
        `Failed to update score of advertisiment with id = ${id}`
      );
    }
  }

  async updateDescription(id: string, descr: string): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { description: descr },
      });
    } catch (e) {
      throw new Error(
        `Failed to update description of advertisiment with id = ${id}`
      );
    }
  }

  async updatePrice(id: string, price: number): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { cost: price },
      });
    } catch (e) {
      throw new Error(
        `Failed to update price of advertisiment with id = ${id}`
      );
    }
  }

  async approve(id: string): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { isApproved: true },
      });
    } catch (e) {
      throw new Error(`Failed to approve advertisiment with id = ${id}`);
    }
  }

  async getUsersAdvertisiments(userId: string): Promise<IAdvertisement[]> {
    try {
      const ads = await this.prisma.advertisement.findMany({
        where: { ownerId: userId },
      });

      return ads;
    } catch (e) {
      throw new Error("Failed to get users advertisiments");
    }
  }

  async getAllWithOwner(): Promise<IAdvertisementWithOwner[]> {
    const ads = await this.prisma.advertisement.findMany({
      orderBy: { address: "asc" },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            score: true,
          },
        },
      },
    });

    const converted = ads.map((e) => this.convert(e));

    return converted;
  }

  async getWithOwner(id: string): Promise<IAdvertisementWithOwner | null> {
    const ad = await this.prisma.advertisement.findFirst({
      include: {
        user: {
          select: {
            id: true,
            login: true,
            score: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (ad) {
      return this.convert(ad);
    }
    return null;
  }
}
