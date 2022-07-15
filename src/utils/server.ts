import express from "express";
import deserializeUser from "../middleware/deserializeUser";
import routes from "../routes";
import cors from "cors";
import config from "config";
import mustacheExpress from "mustache-express";

function creatServer() {
  const app = express();

  app.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );

  // Register '.mustache' extension with The Mustache Express
  app.engine("mustache", mustacheExpress());

  app.set("view engine", "mustache");
  app.set("views", __dirname + "/views");

  app.use(express.json());

  app.use(deserializeUser);

  routes(app);

  return app;
}

export default creatServer;
