const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'logfile.log'),
      level: 'info',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
