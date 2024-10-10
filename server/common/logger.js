import pino from "pino";

const level = process.env.LOG_LEVEL || "info";

const logger = pino({
  level,
  prettyPrint: process.env.NODE_ENV !== "production",
});

export default logger;
