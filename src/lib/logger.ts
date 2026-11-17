/**
 * LevUp Projects — Structured Application Logger
 * Follows docs/08-operations/LOGGING_STANDARD.md
 *
 * Implements UTC timestamping, field standardization, sensitive data redaction,
 * and environment-aware transport.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogCategory =
  | 'application'
  | 'errors'
  | 'security'
  | 'payments'
  | 'audit-exports'
  | 'integrations'
  | 'background-jobs';

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

const REDACTED_KEYS = new Set([
  'password',
  'passwd',
  'secret',
  'client_secret',
  'api_key',
  'apikey',
  'token',
  'access_token',
  'refresh_token',
  'jwt',
  'otp',
  'card',
  'cvv',
  'pan',
  'webhook_secret',
  'authorization',
  'cookie',
]);

/**
 * Deep redaction of sensitive key-value pairs
 */
export function redactSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item));
  }

  const record = data as Record<string, unknown>;
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    if (REDACTED_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = redactSensitiveData(value);
    } else {
      clean[key] = value;
    }
  }

  return clean;
}

export class Logger {
  private service: string;
  private environment: string;
  private version: string;

  constructor(
    service = 'levup-web',
    environment = import.meta.env?.MODE || process.env?.NODE_ENV || 'development',
    version = '0.0.1'
  ) {
    this.service = service;
    this.environment = environment;
    this.version = version;
  }

  public createEvent(
    level: LogLevel,
    category: LogCategory,
    eventName: string,
    message: string,
    options: Partial<Omit<StructuredLogEvent, 'timestamp' | 'level' | 'category' | 'event_name' | 'message' | 'environment' | 'service' | 'application_version'>> = {}
  ): StructuredLogEvent {
    return {
      timestamp: new Date().toISOString(),
      level,
      environment: this.environment,
      service: this.service,
      category,
      event_name: eventName,
      message,
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
      metadata: options.metadata ? (redactSensitiveData(options.metadata) as Record<string, unknown>) : undefined,
    };
  }

  public log(event: StructuredLogEvent): void {
    const serialized = JSON.stringify(event);

    switch (event.level) {
      case 'error':
      case 'fatal':
        console.error(serialized);
        break;
      case 'warn':
        console.warn(serialized);
        break;
      case 'debug':
        console.debug(serialized);
        break;
      default:
        console.log(serialized);
    }
  }

  public info(category: LogCategory, eventName: string, message: string, options = {}): StructuredLogEvent {
    const event = this.createEvent('info', category, eventName, message, options);
    this.log(event);
    return event;
  }

  public warn(category: LogCategory, eventName: string, message: string, options = {}): StructuredLogEvent {
    const event = this.createEvent('warn', category, eventName, message, options);
    this.log(event);
    return event;
  }

  public error(category: LogCategory, eventName: string, message: string, options = {}): StructuredLogEvent {
    const event = this.createEvent('error', category, eventName, message, options);
    this.log(event);
    return event;
  }

  public debug(category: LogCategory, eventName: string, message: string, options = {}): StructuredLogEvent {
    const event = this.createEvent('debug', category, eventName, message, options);
    this.log(event);
    return event;
  }
}

export const logger = new Logger();
