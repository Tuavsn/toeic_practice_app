// Logger.ts
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
  }
  
  export interface LogEntry {
    timestamp: Date;
    level: string;
    message: string;
    data?: any;
  }
  
  export interface ApiRequestLog {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
  }
  
  export interface ApiResponseLog {
    url: string;
    status: number;
    data: any;
    duration: number;
  }
  
  class Logger {
    private static instance: Logger;
    private logLevel: LogLevel = LogLevel.DEBUG;
    private enableConsoleOutput: boolean = true;
    private logHistory: LogEntry[] = [];
    private maxLogHistory: number = 100;
  
    constructor() {
      if (Logger.instance) {
        return Logger.instance;
      }
      Logger.instance = this;
    }
  
    public setLogLevel(level: LogLevel): void {
      if (Object.values(LogLevel).includes(level)) {
        this.logLevel = level;
      } else {
        this.warn('Invalid log level specified');
      }
    }
  
    public enableConsole(enable: boolean = true): void {
      this.enableConsoleOutput = enable;
    }
  
    public setMaxLogHistory(max: number): void {
      this.maxLogHistory = max;
    }
  
    public getLogHistory(): LogEntry[] {
      return [...this.logHistory];
    }
  
    public clearLogHistory(): void {
      this.logHistory = [];
    }
  
    private _addToHistory(level: string, message: string, data?: any): LogEntry {
      const logEntry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        data
      };
  
      this.logHistory.unshift(logEntry);
      
      // Trim history if needed
      if (this.logHistory.length > this.maxLogHistory) {
        this.logHistory = this.logHistory.slice(0, this.maxLogHistory);
      }
      
      return logEntry;
    }
  
    public debug(message: string, ...data: any[]): LogEntry | void {
      if (this.logLevel <= LogLevel.DEBUG) {
        const logEntry = this._addToHistory('DEBUG', message, data);
        if (this.enableConsoleOutput) {
          console.log(`[DEBUG] ${message}`, ...data);
        }
        return logEntry;
      }
    }
  
    public info(message: string, ...data: any[]): LogEntry | void {
      if (this.logLevel <= LogLevel.INFO) {
        const logEntry = this._addToHistory('INFO', message, data);
        if (this.enableConsoleOutput) {
          console.info(`[INFO] ${message}`, ...data);
        }
        return logEntry;
      }
    }
  
    public warn(message: string, ...data: any[]): LogEntry | void {
      if (this.logLevel <= LogLevel.WARN) {
        const logEntry = this._addToHistory('WARN', message, data);
        if (this.enableConsoleOutput) {
          console.warn(`[WARN] ${message}`, ...data);
        }
        return logEntry;
      }
    }
  
    public error(message: string, ...data: any[]): LogEntry | void {
      if (this.logLevel <= LogLevel.ERROR) {
        const logEntry = this._addToHistory('ERROR', message, data);
        if (this.enableConsoleOutput) {
          console.error(`[ERROR] ${message}`, ...data);
        }
        return logEntry;
      }
    }
  
    // Specialized logging for API requests
    public logRequest(url: string, method: string, headers?: Record<string, string>, body?: any): void {
      this.debug(`API Request: ${method} ${url}`, { headers, body });
    }
  
    public logResponse(url: string, status: number, data: any, duration: number): void {
      if (status >= 200 && status < 300) {
        this.info(`API Response: ${status} ${url} (${duration}ms)`, data);
      } else {
        this.error(`API Error: ${status} ${url} (${duration}ms)`, data);
      }
    }
  }
  
  // Export singleton instance
  export default new Logger();