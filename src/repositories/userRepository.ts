import { IUser } from '../interfaces/IUser';
import { IUserRepository } from '../interfaces/IUserRepository';
import { PrismaClient } from '@prisma/client';

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  async updatePassword(id: string, newPsw: string): Promise<void> {
    try {
      await this.prisma.user.update({ data: { password: newPsw }, where: { id: id } });
    } catch (e) {
      throw new Error(`Failed to update password of user with id = ${id}`);
    }
  }

  async updateLogin(id: string, newLogin: string): Promise<void> {
    try {
      await this.prisma.user.update({ data: { login: newLogin }, where: { id: id } });
    } catch (e) {
      throw new Error(`Failed to update login of user with id = ${id}`);
    }
  }

  async updateScore(id: string, newScore: number): Promise<void> {
    try {
      await this.prisma.user.update({ data: { score: newScore }, where: { id: id } });
    } catch (e) {
      throw new Error(`Failed to update score of user with id = ${id}`);
    }
  }

  async get(id: string): Promise<IUser | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async getAll(): Promise<IUser[]> {
    return await this.prisma.user.findMany();
  }

  async create(data: IUser): Promise<void> {
    try {
      await this.prisma.user.create({ data });
    } catch (e) {
      throw new Error('Failed to create new user');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      throw new Error('Failed to delete user');
    }
  }

  async update(newUsr: IUser): Promise<void> {
    try {
      await this.prisma.user.update({ data: newUsr, where: { id: newUsr.id } });
    } catch (e) {
      throw new Error('Failed to update user');
    }
  }
}
