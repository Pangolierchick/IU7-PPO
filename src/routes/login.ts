import { Router } from "express";
import { body, query } from "express-validator";
import { UserController } from "../controllers/userController";

const loginRouter = Router();
const userController = new UserController();

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

loginRouter.get(
  "/checkUser",
  query(["login", "password"]).notEmpty().escape(),
  userController.checkUser.bind(userController)
);

loginRouter.get(
  "/validateToken",
  query(["token"]).notEmpty().escape(),
  userController.validateToken.bind(userController)
);
loginRouter.get(
  "/getUserById",
  query(["id"]).isUUID(),
  userController.getUserById.bind(userController)
);

export default loginRouter;
