const { createLogger, format, transports, addColors } = require("winston");

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "bold red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

addColors(customLevelOptions.colors);

const devLogger = createLogger({
  levels: customLevelOptions.levels,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`
    )
  ),
  transports: [new transports.Console({ level: "debug" })],
});

const prodLogger = createLogger({
  levels: customLevelOptions.levels,
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`
    )
  ),
  transports: [
    new transports.File({ filename: "./errors.log", level: "info" }),
  ],
});

module.exports = { devLogger, prodLogger };
