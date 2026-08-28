import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'rootcause-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp, stack, ...meta }) => {
            let logMsg = `${timestamp} [${level}]: ${message}`;
            if (stack) {
              logMsg += `\n${stack}`;
            }
            if (Object.keys(meta).length && meta.service !== 'rootcause-backend') {
              logMsg += `\n${JSON.stringify(meta, null, 2)}`;
            }
            return logMsg;
          }
        )
      ),
    }),
  ],
});
