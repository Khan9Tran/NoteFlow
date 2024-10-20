const createHttpResponse = ({
  statusCode = 200,
  message = "",
  data = null,
  pagination = null,
  headers = {},
}) => ({
  statusCode,
  body: {
    status: statusCode >= 400 ? "error" : "success",
    message,
    data,
    pagination,
  },
  headers,
});

const ok = (data, message = "Success", pagination = null) =>
  createHttpResponse({
    statusCode: 200,
    message,
    data,
    pagination,
  });

const created = (data, message = "Resource created successfully") =>
  createHttpResponse({
    statusCode: 201,
    message,
    data,
  });

const badRequest = (error, message = "Bad request") =>
  createHttpResponse({
    statusCode: 400,
    message,
    data: { message: error.message },
  });

const unauthorized = (error, message = "Unauthorized") =>
  createHttpResponse({
    statusCode: 401,
    message,
    data: { message: error.message },
  });

const forbidden = (error, message = "Forbidden") =>
  createHttpResponse({
    statusCode: 403,
    message,
    data: { message: error.message },
  });

const notFound = (error, message = "Resource not found") =>
  createHttpResponse({
    statusCode: 404,
    message,
    data: { message: error.message },
  });

const serverError = (error, message = "Internal server error") =>
  createHttpResponse({
    statusCode: 500,
    message,
    data: { message: error.message },
  });

const noContent = () =>
  createHttpResponse({
    statusCode: 204,
    message: "No content",
  });

export {
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  noContent,
};
