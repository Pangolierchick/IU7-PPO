import { IUser } from '../interfaces/IUser';
import { IUserRepository } from '../interfaces/IUserRepository';
import { PrismaClient } from '@prisma/client';

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  async updatePassword(id: string, newPsw: string): Promise<void> {
    await this.prisma.user.update({ data: { password: newPsw }, where: { id: id } });
  }

  async updateLogin(id: string, newLogin: string): Promise<void> {
    await this.prisma.user.update({ data: { login: newLogin }, where: { id: id } });
  }

  async updateScore(id: string, newScore: number): Promise<void> {
    await this.prisma.user.update({ data: { score: newScore }, where: { id: id } });
  }

  async get(id: string): Promise<IUser | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async getAll(): Promise<IUser[]> {
    return await this.prisma.user.findMany();
  }

  async create(data: IUser): Promise<void> {
    await this.prisma.user.create({ data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async update(newUsr: IUser): Promise<void> {
    await this.prisma.user.update({ data: newUsr, where: { id: newUsr.id } });
  }
}
