import fs from "fs";
import morgan from "morgan";
import path from "path";
import { config } from "./config";

export class ExpressLogger {
  public static createFileLogger() {
    const stream = fs.createWriteStream(
      path.join(__dirname, "../../logs", `${new Date().toISOString()}.log`),
      { flags: "a+" }
    );
    return morgan(config.loggerFormat, { stream });
  }

  public static createConsoleLogger() {
    return morgan(config.loggerFormat);
  }
}
