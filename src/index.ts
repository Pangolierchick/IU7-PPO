import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config";
import apiRouter from "./routes/api";
import homeRouter from "./routes/home";

const app = express();

app.set("views", "src/views");
app.use(express.static("src/static/"));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use("/api", apiRouter);
app.use("/", homeRouter);

app.listen(config.port, () => {
  console.log("Running");
});
