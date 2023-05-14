import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import { UserController } from "../controllers/userController";

const loginRouter = Router();
const prisma = new PrismaClient();
const userController = new UserController(prisma);

loginRouter.post(
  "/login",
  query(["login", "password"]).notEmpty().escape(),
  userController.login.bind(userController)
);
loginRouter.post(
  "/signup",
  body(["login", "password"]).notEmpty().escape(),
  userController.signup.bind(userController)
);
loginRouter.get(
  "/getUser",
  query("login").notEmpty().escape(),
  userController.getUserInfo.bind(userController)
);

export default loginRouter;
