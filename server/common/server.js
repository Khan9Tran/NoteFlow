import express from "express";
import cookieParser from "cookie-parser";
import * as path from "path";
import bodyParser from "body-parser";
import * as http from "http";
import * as os from "os";
import l from "./logger.js";
import oas from "./swagger.js";
import connectDB from "../databases/mongoose.js";
import routes from "../routes.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

// Đường dẫn đến tệp hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
