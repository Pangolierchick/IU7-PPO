import { PrismaClient } from '@prisma/client';
import { IRentRepository } from '../interfaces/IRentRepository';
import { IRent } from '../interfaces/IRent';

export class RentRepository implements IRentRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  async get(id: string): Promise<IRent | null> {
    return await this.prisma.rent.findFirst({ where: { id } });
  }

  async getAll(): Promise<IRent[]> {
    return await this.prisma.rent.findMany();
  }

  async update(newUsr: IRent): Promise<void> {
    await this.prisma.rent.update({ data: newUsr, where: { id: newUsr.id } });
  }

  async create(data: IRent): Promise<void> {
    await this.prisma.rent.create({data});
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rent.delete({ where: { id } });
  }

  async getInDate(adId: string, from: Date, to: Date): Promise<IRent[]> {
    return await this.prisma.rent.findMany({ where: {
      adId,
      dateFrom: { lt: to },
      dateUntil: { gt: from },
    }});
  }
}
