import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: '/var/log/backend.log', level: 'info' }),
    new transports.File({ filename: '/var/log/backend-error.log', level: 'error' }),
    new transports.Console()
  ],
});

export default logger;
