import { PrismaClient } from '@prisma/client';
import { IAdvertisement } from '../interfaces/IAdvertisement';
import { IAdvertisementRepository } from '../interfaces/IAdvertisementRepository';

export class AdvertisimentRepository implements IAdvertisementRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  async get(id: string): Promise<IAdvertisement | null> {
    return await this.prisma.advertisement.findFirst({ where: { id } });
  }

  async getAll(): Promise<IAdvertisement[]> {
    return await this.prisma.advertisement.findMany();
  }

  async update(newUsr: IAdvertisement): Promise<void> {
    await this.prisma.advertisement.update({ data: newUsr, where: { id: newUsr.id } });
  }

  async create(data: IAdvertisement): Promise<void> {
    await this.prisma.advertisement.create({ data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.advertisement.delete({ where: { id } });
  }

  async updateScore(id: string, score: number): Promise<void> {
    await this.prisma.advertisement.update({ where: { id }, data: {score} });
  }

  async updateDescription(id: string, descr: string): Promise<void> {
    await this.prisma.advertisement.update({ where: { id }, data: {description: descr} });
  }

  async updatePrice(id: string, price: number): Promise<void> {
    await this.prisma.advertisement.update({ where: { id }, data: {cost: price} });
  }

  async approve(id: string): Promise<void> {
    await this.prisma.advertisement.update({ where: { id }, data: {isApproved: true} });
  }
}
