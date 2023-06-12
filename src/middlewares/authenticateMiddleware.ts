import { NextFunction, Request, Response } from "express";
import { AccountManager } from "../managers/accountManager";
import { RepoFactory } from "../repositories/repoFactory";

export class AuthenticateMiddleware {
  private _userManager: AccountManager;
  constructor() {
    const fact = new RepoFactory();
    const accRepo = fact.getUserRepository();

    this._userManager = new AccountManager(accRepo);
  }

  public async authenticateMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      const userId = await this._userManager.authenticateUser(token);

      req.body.userId = userId;

      next();
    } catch (e) {
      res.status(401).json({ errors: "User is not authorized" });
    }
  }
}
