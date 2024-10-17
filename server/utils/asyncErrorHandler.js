const asyncErrorHandler = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);
    if (result && result.statusCode) {
      res.status(result.statusCode).json(result.body);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export default asyncErrorHandler;
