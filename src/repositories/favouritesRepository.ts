import { PrismaClient } from "@prisma/client";
import { IFavourites, IFavouritesWithUser } from "../interfaces/IFavourites";
import { IFavouritesRepository } from "../interfaces/IFavouritesRepository";

export class FavouritesRepository implements IFavouritesRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }
  async getUsersFavourites(userId: string): Promise<IFavourites[]> {
    return this.prisma.favourites.findMany({ where: { userId } });
  }
  async getAll(): Promise<IFavourites[]> {
    return await this.prisma.favourites.findMany();
  }
  async create(data: IFavourites): Promise<void> {
    try {
      await this.prisma.favourites.create({ data });
    } catch (e) {
      throw new Error("Failed to create favourites");
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.favourites.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new Error("Failed to delete favourites");
    }
  }
  async update(n: IFavourites): Promise<void> {
    try {
      await this.prisma.favourites.update({ data: n, where: { id: n.id } });
    } catch (e) {
      throw new Error("Failed to update favourites");
    }
  }

  async get(id: string): Promise<IFavourites | null> {
    return this.prisma.favourites.findFirst({ where: { id } });
  }

  async getWithUser(id: string): Promise<IFavouritesWithUser | null> {
    const res = await this.prisma.favourites.findFirst({
      include: {
        user: {
          select: {
            role: true,
            login: true,
          },
        },
      },
    });

    if (res) {
      return {
        role: res.user.role,
        login: res.user.login,
        ...res,
      };
    }
    return res;
  }
}
