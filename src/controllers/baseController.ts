import { PrismaClient } from "@prisma/client";

export class BaseController {
  protected _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }
}
