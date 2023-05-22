import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fetch from "node-fetch";
import { config } from "../config";
import { AccountManager } from "../managers/accountManager";
import { AdvertisementManager } from "../managers/advertisementManager";
import { AdvertisimentRepository } from "../repositories/advertisimentRepository";
import { RentRepository } from "../repositories/rentRepository";
import { UserRepository } from "../repositories/userRepository";
import { BaseController } from "./baseController";

export class HomeController extends BaseController {
  private _userManager: AccountManager;
  private _advManager: AdvertisementManager;

  constructor(prisma: PrismaClient) {
    super(prisma);

    const _advRepo = new AdvertisimentRepository(prisma);
    const _rentRepo = new RentRepository(prisma);
    const _userRepo = new UserRepository(prisma);

    this._advManager = new AdvertisementManager(_advRepo, _userRepo, _rentRepo);
    this._userManager = new AccountManager(_userRepo);
  }

  async isAuth(token: string) {
    try {
      await this._userManager.authenticateUser(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getIdFromToken(token: string) {
    try {
      return await this._userManager.authenticateUser(token);
    } catch (e) {
      return null;
    }
  }

  public async getHomePage(req: Request, res: Response) {
    const { token, login } = req.cookies;
    res.render("home", { loggedIn: await this.isAuth(token), login: login });
  }

  public async getLoginPage(req: Request, res: Response) {
    const { token } = req.cookies;

    res.render("login", { loggedIn: await this.isAuth(token) });
  }

  public async postLogin(req: Request, res: Response) {
    const { login, password } = req.body;

    const r = await fetch(
      `http://localhost:${config.port}/api/user/login?login=${login}&password=${password}`,
      { method: "POST" }
    );

    res.status(r.status);

    if (r.ok) {
      const token = await r.text();
      res.cookie("token", token);
      res.cookie("login", login);
      res.redirect("/");
    } else if (r.status === 400) {
      res.send("Incorrect login or password.");
    } else {
      res.send("Incorrect input.");
    }
  }

  public async getSignupPage(req: Request, res: Response) {
    const { token } = req.cookies;

    res.render("signup", { loggedIn: await this.isAuth(token) });
  }

  public async postSignup(req: Request, res: Response) {
    const { login, password } = req.body;

    const r = await fetch(`http://localhost:${config.port}/api/user/signup`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ login, password }),
    });

    res.status(r.status);

    if (r.ok) {
      try {
        const token = await this._userManager.loginUser(login, password);
        res.cookie("token", token);
        res.cookie("login", login);
        res.redirect("/");
      } catch (e) {
        res.status(500);
      }
    }
  }

  public async getSearchPage(req: Request, res: Response) {
    const { address } = req.query;
    const { token, login } = req.cookies;
    const r = await fetch(
      `http://localhost:${config.port}/api/listing/searchAds?address=${address}`
    );

    const ads = await r.json();

    res.render("./search", {
      loggedIn: await this.isAuth(token),
      login: login,
      ads: ads.ads,
    });
  }

  public async getAdvertisiment(req: Request, res: Response) {
    const { id } = req.query;
    const { token, login } = req.cookies;

    const r = await fetch(
      `http://localhost:${config.port}/api/listing/getAdvertisiment?adId=${id}`
    );

    const rd = await fetch(
      `http://localhost:${config.port}/api/listing/getAdvertisimentRentDates?adId=${id}`
    );

    const dates = await rd.json();

    const ad = await r.json();

    if (r.ok) {
      res.render("./advertisiment", {
        loggedIn: await this.isAuth(token),
        login: login,
        ad,
        dates,
      });
    } else {
      res.redirect("/");
    }
  }

  public async getAddAdvertisiment(req: Request, res: Response) {
    const { token, login } = req.cookies;

    res.render("addAdvertisiment", {
      loggedIn: await this.isAuth(token),
      login: login,
    });
  }

  public async addAdvertisiment(req: Request, res: Response) {
    const { address, cost, description } = req.body;
    const { token } = req.cookies;

    const r = await fetch(
      `http://localhost:${config.port}/api/listing/createAdvertisiment`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        method: "POST",
        body: JSON.stringify({ address, cost, description }),
      }
    );

    if (r.ok) {
      res.redirect("/");
    }
  }

  public async getProfile(req: Request, res: Response) {
    const { token } = req.cookies;
    const { login } = req.query;

    const ru = await fetch(
      `http://localhost:${config.port}/api/user/getUser?login=${login}`
    );

    const user = await ru.json();

    const ra = await fetch(
      `http://localhost:${config.port}/api/listing/getUsersAdvertisiments?ownerId=${user.id}`
    );

    const rr = await fetch(
      `http://localhost:${config.port}/api/listing/getUsersRents?id=${user.id}`
    );

    const ads = await ra.json();
    const rents = await rr.json();

    res.render("profile", {
      loggedIn: await this.isAuth(token),
      login: login,
      user,
      ads,
      rents,
    });
  }
}
