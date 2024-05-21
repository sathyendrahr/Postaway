import winston from "winston";
import path from "path";

const infoPath = path.join(path.resolve("logs"), "app.log");
const errPath = path.join(path.resolve("logs"), "error.log");

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "application-logging" },
  transports: [
    new winston.transports.File({ filename: infoPath, level: "info" }),
    new winston.transports.File({ filename: errPath, level: "error" }),
  ],
});

export const loggerMiddleware = (req, res, next) => {
  if (!req.url.includes("user")) {
    const logData = `Timestamp: ${new Date().toString()} Req URL: ${
      req.url
    } Req Body: ${JSON.stringify(req.body)}`;

    logger.info(logData);
  }

  next();
};
