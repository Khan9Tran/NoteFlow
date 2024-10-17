import middleware from "swagger-express-middleware";
import * as path from "path";
import errorHandler from "../api/middlewares/error.handler.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Đường dẫn đến tệp hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default function swagger(app, routes) {
  return new Promise((resolve, reject) => {
    middleware(path.join(__dirname, "api.yml"), app, (err, mw) => {
      if (err) {
        return reject(err);
      }
      app.enable("case sensitive routing");
      app.enable("strict routing");

      app.use(mw.metadata());
      app.use(
        mw.files(
          {
            caseSensitive: false,
            strict: false,
          },
          {
            useBasePath: false,
            apiPath: process.env.SWAGGER_API_SPEC,
          }
        )
      );

      app.use(
        mw.parseRequest({
          cookie: {
            secret: process.env.SESSION_SECRET,
          },
          json: {
            limit: process.env.REQUEST_LIMIT,
          },
        })
      );
      app.use(mw.CORS(), mw.validateRequest());

      // Gọi routes với app
      routes(app);

      app.use(errorHandler); // Đảm bảo error handler được gọi sau cùng
      return resolve();
    });
  });
}
