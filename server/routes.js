import usersRouter from "./api/controllers/users/router.js";
import workspacesRouter from "./api/controllers/workspaces/router.js";
import pagesRouter from "./api/controllers/pages/router.js";
import tasksRouter from "./api/controllers/tasks/router.js";
import authRouter from "./api/controllers/auth/router.js";
import authMiddleware from "./security/auth-middleware.js";
export default function routes(app) {
  app.use("/api/v1", authRouter);
  app.use("/api/v1/users", authMiddleware, usersRouter);
  app.use("/api/v1/workspaces", authMiddleware, workspacesRouter);
  app.use("/api/v1/pages", authMiddleware, pagesRouter);
  app.use("/api/v1/tasks", authMiddleware, tasksRouter);
}
