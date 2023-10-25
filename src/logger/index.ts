import winston from 'winston';
import { LogManager } from './LogManager';

const logManager: LogManager = new LogManager('log', 'YYYY-MM-DD', process.env.NODE_ENV);

const logger: winston.Logger = logManager.getLogger();

export default logger;
