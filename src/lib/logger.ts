/**
 * LevUp Projects — Structured Application Logger & Storage Adapter
 * Conforms strictly to docs/08-operations/LOGGING_STANDARD.md
 *
 * Implements:
 * - UTC timestamping and zero-padded hourly partition hierarchies:
 *   environment/category/YYYY/MM/DD/HH/events.jsonl
 * - Safe environment detection (Node.js file adapter vs browser console safe)
 * - Deep sensitive key redaction
 * - Resilient failure handling (never crash host application on logging error)
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type LogCategory =
  | "application"
  | "errors"
  | "security"
  | "payments"
  | "audit-exports"
  | "integrations"
  | "background-jobs";

export interface StructuredLogEvent {
  timestamp: string;
  level: LogLevel;
  environment: string;
  service: string;
  category: LogCategory;
  event_name: string;
  message: string;
  request_id?: string;
  correlation_id?: string;
  trace_id?: string;
  actor_id?: string;
  resource_type?: string;
  resource_id?: string;
  duration_ms?: number;
  error_code?: string;
  application_version: string;
  deployment_id?: string;
  metadata?: Record<string, unknown>;
}

export interface LogTransport {
  name: string;
  write(event: StructuredLogEvent): Promise<boolean> | boolean;
}

const REDACTED_KEYS = new Set([
  "password",
  "passwd",
  "secret",
  "client_secret",
  "api_key",
  "apikey",
  "token",
  "access_token",
  "refresh_token",
  "jwt",
  "otp",
  "card",
  "card_number",
  "cvv",
  "pan",
  "webhook_secret",
  "authorization",
  "cookie",
  "set-cookie",
]);

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Generates partition path relative to base logs directory using UTC time
 * Format: {environment}/{category}/{YYYY}/{MM}/{DD}/{HH}/events.jsonl
 */
export function getPartitionPath(
  environment: string,
  category: LogCategory,
  date: Date = new Date(),
): string {
  const yyyy = date.getUTCFullYear();
  const mm = pad2(date.getUTCMonth() + 1);
  const dd = pad2(date.getUTCDate());
  const hh = pad2(date.getUTCHours());

  return `${environment}/${category}/${yyyy}/${mm}/${dd}/${hh}/events.jsonl`;
}

/**
 * Deep redaction of sensitive key-value pairs with cycle protection
 */
export function redactSensitiveData(data: unknown, seen = new WeakSet()): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;

  if (seen.has(data as object)) {
    return "[CIRCULAR]";
  }
  seen.add(data as object);

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item, seen));
  }

  const record = data as Record<string, unknown>;
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    const isSensitive =
      REDACTED_KEYS.has(key.toLowerCase()) ||
      Array.from(REDACTED_KEYS).some((k) => key.toLowerCase().includes(k));
    if (isSensitive) {
      clean[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      clean[key] = redactSensitiveData(value, seen);
    } else {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Console Transport (Browser & Server fallback)
 */
export class ConsoleTransport implements LogTransport {
  name = "console";

  write(event: StructuredLogEvent): boolean {
    try {
      const line = JSON.stringify(event);
      switch (event.level) {
        case "error":
        case "fatal":
          console.error(line);
          break;
        case "warn":
          console.warn(line);
          break;
        case "debug":
          console.debug(line);
          break;
        default:
          console.log(line);
      }
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Node Local File Adapter
 * Writes to logs/{environment}/{category}/{YYYY}/{MM}/{DD}/{HH}/events.jsonl
 * Safely no-ops in true browser environments where node:fs is not present
 */
export class NodeLocalFileTransport implements LogTransport {
  name = "node-local-file";
  private baseDir: string;

  constructor(baseDir = "logs") {
    this.baseDir = baseDir;
  }

  async write(event: StructuredLogEvent): Promise<boolean> {
    // Check if we are running in an environment with Node.js process & fs support
    const hasNode = typeof process !== "undefined" && Boolean(process.versions?.node);

    if (!hasNode) {
      return true; // Browser client safe no-op
    }

    try {
      const fs = await import("node:fs");
      const path = await import("node:path");

      const date = new Date(event.timestamp);
      const relativePartition = getPartitionPath(event.environment, event.category, date);
      const fullPath = path.resolve(process.cwd(), this.baseDir, relativePartition);
      const dirPath = path.dirname(fullPath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const line = JSON.stringify(event) + "\n";
      fs.appendFileSync(fullPath, line, "utf8");
      return true;
    } catch (err) {
      // Never crash the host application if filesystem writes fail
      console.error("[LOGGER_FAILURE] Failed to write event to filesystem:", err);
      return false;
    }
  }
}

/**
 * Production Object Storage Archive Transport Interface
 */
export class ProductionStorageArchiveTransport implements LogTransport {
  name = "production-storage-archive";
  private isOperational = false;

  constructor(operational = false) {
    this.isOperational = operational;
  }

  getOperationalStatus(): boolean {
    return this.isOperational;
  }

  write(_event: StructuredLogEvent): boolean {
    if (!this.isOperational) {
      return true;
    }
    return true;
  }
}

/**
 * Logger Class
 */
export class Logger {
  private service: string;
  private environment: string;
  private version: string;
  private transports: LogTransport[];

  constructor(
    service = "levup-web",
    environment = (typeof process !== "undefined" && process.env?.NODE_ENV) || "development",
    version = "0.0.1",
    transports?: LogTransport[],
  ) {
    this.service = service;
    this.environment = environment;
    this.version = version;
    this.transports = transports || [new ConsoleTransport(), new NodeLocalFileTransport("logs")];
  }

  public createEvent(
    level: LogLevel,
    category: LogCategory,
    eventName: string,
    message: string,
    options: Partial<
      Omit<
        StructuredLogEvent,
        | "timestamp"
        | "level"
        | "category"
        | "event_name"
        | "message"
        | "environment"
        | "service"
        | "application_version"
      >
    > = {},
  ): StructuredLogEvent {
    const safeEventName = eventName ? String(eventName) : "unknown.event";
    const safeMessage = message !== undefined && message !== null ? String(message) : "";

    return {
      timestamp: new Date().toISOString(),
      level,
      environment: this.environment,
      service: this.service,
      category,
      event_name: safeEventName,
      message: safeMessage,
      request_id: options.request_id,
      correlation_id: options.correlation_id,
      trace_id: options.trace_id,
      actor_id: options.actor_id,
      resource_type: options.resource_type,
      resource_id: options.resource_id,
      duration_ms: options.duration_ms,
      error_code: options.error_code,
      application_version: this.version,
      deployment_id: options.deployment_id,
      metadata: options.metadata
        ? (redactSensitiveData(options.metadata) as Record<string, unknown>)
        : undefined,
    };
  }

  public async log(event: StructuredLogEvent): Promise<void> {
    for (const transport of this.transports) {
      try {
        await transport.write(event);
      } catch (err) {
        console.error(`[LOGGER_TRANSPORT_ERROR] Transport ${transport.name} threw error:`, err);
      }
    }
  }

  public async info(
    category: LogCategory,
    eventName: string,
    message: string,
    options = {},
  ): Promise<StructuredLogEvent> {
    const event = this.createEvent("info", category, eventName, message, options);
    await this.log(event);
    return event;
  }

  public async warn(
    category: LogCategory,
    eventName: string,
    message: string,
    options = {},
  ): Promise<StructuredLogEvent> {
    const event = this.createEvent("warn", category, eventName, message, options);
    await this.log(event);
    return event;
  }

  public async error(
    category: LogCategory,
    eventName: string,
    message: string,
    options = {},
  ): Promise<StructuredLogEvent> {
    const event = this.createEvent("error", category, eventName, message, options);
    await this.log(event);
    return event;
  }

  public async debug(
    category: LogCategory,
    eventName: string,
    message: string,
    options = {},
  ): Promise<StructuredLogEvent> {
    const event = this.createEvent("debug", category, eventName, message, options);
    await this.log(event);
    return event;
  }
}

export const logger = new Logger();
