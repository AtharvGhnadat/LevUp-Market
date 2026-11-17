import { describe, it, expect, vi } from 'vitest';
import { Logger, redactSensitiveData } from './logger';

describe('redactSensitiveData', () => {
  it('redacts sensitive keys in objects', () => {
    const input = {
      username: 'atharv',
      password: 'mypassword123',
      apiKey: 'secret_live_key',
      token: 'jwt.token.here',
      publicInfo: 'safe to log',
    };

    const redacted = redactSensitiveData(input) as Record<string, string>;
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.apiKey).toBe('[REDACTED]');
    expect(redacted.token).toBe('[REDACTED]');
    expect(redacted.username).toBe('atharv');
    expect(redacted.publicInfo).toBe('safe to log');
  });

  it('redacts nested objects and arrays recursively', () => {
    const input = {
      user: {
        id: '123',
        secret: 'sensitive',
      },
      items: [{ card: '4111222233334444' }],
    };

    const redacted = redactSensitiveData(input) as { user: { secret: string }; items: [{ card: string }] };
    expect(redacted.user.secret).toBe('[REDACTED]');
    expect(redacted.items[0].card).toBe('[REDACTED]');
  });
});

describe('Logger', () => {
  it('creates structured log event matching schema with UTC timestamp', () => {
    const logger = new Logger('test-service', 'test', '1.0.0');
    const event = logger.createEvent('info', 'payments', 'payment.success', 'Payment verified', {
      resource_id: 'ord_123',
      metadata: { password: 'hidden', amount_paise: 499900 },
    });

    expect(event.level).toBe('info');
    expect(event.category).toBe('payments');
    expect(event.event_name).toBe('payment.success');
    expect(event.message).toBe('Payment verified');
    expect(event.service).toBe('test-service');
    expect(event.application_version).toBe('1.0.0');
    expect(event.metadata?.password).toBe('[REDACTED]');
    expect(event.metadata?.amount_paise).toBe(499900);
    expect(new Date(event.timestamp).toISOString()).toBe(event.timestamp);
  });
});
