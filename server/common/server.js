import express from "express";
import cookieParser from "cookie-parser";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as os from "os";
import l from "./logger";
import oas from "./swagger";
import connectDB from "../databases/mongoose";
import routes from "../routes";

const app = express();
const root = path.normalize(`${__dirname}/../..`);

function configureApp() {
  app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" }));
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: process.env.REQUEST_LIMIT || "100kb",
    })
  );
  app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || "100kb" }));
  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(express.static(`${root}/public`));
}

function setRoutes(routes) {
  routes(app);
}

function startServer(port = process.env.PORT) {
  const welcome = (p) => () =>
    l.info(
      `up and running in ${
        process.env.NODE_ENV || "development"
      } @: ${os.hostname()} on port: ${p}`
    );

  oas(app, routes)
    .then(() => {
      http.createServer(app).listen(port, welcome(port));
    })
    .catch((e) => {
      l.error(e);
      process.exit(1);
    });

  return app;
}

connectDB();

configureApp();

export { setRoutes, startServer };
