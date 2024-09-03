export class Logger {
  private readonly isEnableLog: boolean = false;

  constructor() {
    this.isEnableLog = process.env.NODE_ENV !== 'production';
  }

  public error(...data: any[]) {
    this.log(LogLevel.ERROR, ...data);
  }

  public warn(...data: any[]) {
    this.log(LogLevel.WARN, ...data);
  }

  public debug(...data: any[]) {
    this.log(LogLevel.DEBUG, ...data);
  }

  public info(...data: any[]) {
    this.log(LogLevel.INFO, ...data);
  }

  public log(level: LogLevel, ...data: any[]) {
    if (!this.isEnableLog) {
      return;
    }
    switch (level) {
      case LogLevel.ERROR:
        console.error('[ERROR]', ...data);
        break;
      case LogLevel.WARN:
        console.warn('[WARN]', ...data);
        break;
      case LogLevel.DEBUG:
        console.debug('[DEBUG]', ...data);
        break;
      case LogLevel.INFO:
        console.info('[INFO]', ...data);
        break;
      default:
        break;
    }
  }
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}
