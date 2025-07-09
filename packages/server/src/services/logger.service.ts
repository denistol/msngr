export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

class LoggerService {
  private static formatMessage(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message: string) {
    console.info(LoggerService.formatMessage(LogLevel.INFO, message));
  }

  warn(message: string) {
    console.warn(LoggerService.formatMessage(LogLevel.WARN, message));
  }

  error(message: string | Error) {
    if (message instanceof Error) {
      console.error(LoggerService.formatMessage(LogLevel.ERROR, message.message));
      console.error(message.stack);
    } else {
      console.error(LoggerService.formatMessage(LogLevel.ERROR, message));
    }
  }

  debug(message: string) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(LoggerService.formatMessage(LogLevel.DEBUG, message));
    }
  }
}

export const loggerService = new LoggerService()