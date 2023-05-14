import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { AccountManager } from "../managers/accountManager";
import { UserRepository } from "../repositories/userRepository";
import { BaseController } from "./baseController";

export class UserController extends BaseController {
  private _userManager: AccountManager;
  constructor(prisma: PrismaClient) {
    super(prisma);
    const _userRepo = new UserRepository(this._prisma);
    this._userManager = new AccountManager(_userRepo);
  }
  public async signup(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { login, password } = matchedData(req);

      try {
        const userId = await this._userManager.addUser(login, password);
        res.json({ userId });
      } catch (e) {
        res.status(500).json({ errors: `Something went wrong ${e}` });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async login(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { login, password } = matchedData(req);

      try {
        const token = await this._userManager.loginUser(login, password);
        res.json({ token });
      } catch (e) {
        res.status(401).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getUserInfo(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { login } = matchedData(req);

      try {
        const user = await this._userManager.getByLogin(login);

        res.json({
          id: user.id,
          login: user.login,
          score: user.score,
          role: user.role,
        });
      } catch (e) {
        console.log(e);
        res.status(401).json({ errors: e as Error });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }
}
