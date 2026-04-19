type LogLevel = "info" | "error" | "warn" | "debug";

export interface LogContext {
  module: string;
  [key: string]: unknown;
}

export class Logger {
  constructor(private readonly module: string) {}

  static for(module: string): Logger {
    return new Logger(module);
  }

  info(message: string, meta: Record<string, unknown> = {}): void {
    this.log("info", message, meta);
  }

  error(message: string, meta: Record<string, unknown> = {}): void {
    this.log("error", message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}): void {
    this.log("warn", message, meta);
  }

  debug(message: string, meta: Record<string, unknown> = {}): void {
    this.log("debug", message, meta);
  }

  private log(level: LogLevel, message: string, meta: Record<string, unknown>): void {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      module: this.module,
      message,
      ...meta,
    };

    const serialized = JSON.stringify(payload);

    if (level === "error") {
      console.error(serialized);
    } else if (level === "warn") {
      console.warn(serialized);
    } else if (level === "debug") {
      console.debug(serialized);
    } else {
      console.log(serialized);
    }
  }
}

