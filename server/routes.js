import usersRouter from './api/controllers/users/router';
import workspacesRouter from './api/controllers/workspaces/router';
import pagesRouter from './api/controllers/pages/router';

export default function routes(app) {
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/workspaces', workspacesRouter);
  app.use('/api/v1/pages', pagesRouter);
}
