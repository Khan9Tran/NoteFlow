import usersRouter from './api/controllers/users/router.js';
import workspacesRouter from './api/controllers/workspaces/router.js';
import pagesRouter from './api/controllers/pages/router.js';
import tasksRouter from './api/controllers/tasks/router.js';

export default function routes(app) {
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/workspaces', workspacesRouter);
  app.use('/api/v1/pages', pagesRouter);
  app.use('/api/v1/tasks', tasksRouter);
}
