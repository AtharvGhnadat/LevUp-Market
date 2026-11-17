import { describe, it, expect, vi, afterEach } from "vitest";
import {
  Logger,
  getPartitionPath,
  redactSensitiveData,
  NodeLocalFileTransport,
  ConsoleTransport,
} from "./logger";
import fs from "node:fs";
import path from "node:path";

describe("Hourly Partition Paths and UTC Boundaries", () => {
  it("generates zero-padded UTC hourly partition paths", () => {
    // 2026-03-05 07:09:00 UTC
    const date = new Date(Date.UTC(2026, 2, 5, 7, 9, 0));
    const partition = getPartitionPath("development", "application", date);
    expect(partition).toBe("development/application/2026/03/05/07/events.jsonl");
  });

  it("correctly handles UTC midnight boundary and month rollover", () => {
    // New Year rollover: 2026-12-31 23:59:59 UTC
    const dateDec = new Date(Date.UTC(2026, 11, 31, 23, 59, 59));
    expect(getPartitionPath("production", "security", dateDec)).toBe(
      "production/security/2026/12/31/23/events.jsonl",
    );

    // One second later: 2027-01-01 00:00:00 UTC
    const dateJan = new Date(Date.UTC(2027, 0, 1, 0, 0, 0));
    expect(getPartitionPath("production", "security", dateJan)).toBe(
      "production/security/2027/01/01/00/events.jsonl",
    );
  });

  it("handles leap day (Feb 29) UTC boundary correctly", () => {
    // 2028 is a leap year: 2028-02-29 13:00:00 UTC
    const leapDate = new Date(Date.UTC(2028, 1, 29, 13, 0, 0));
    expect(getPartitionPath("staging", "payments", leapDate)).toBe(
      "staging/payments/2028/02/29/13/events.jsonl",
    );
  });
});

describe("Sensitive Data Redaction", () => {
  it("redacts passwords, secrets, tokens, OTPs, and card data regardless of casing", () => {
    const input = {
      username: "student_atharv",
      PASSWORD: "PlainTextPassword123!",
      Client_Secret: "cf_sec_99999",
      bearer_Token: "eyJhbGciOi...",
      user_OTP: "849201",
      credit_Card: "4111111111111111",
      nested: {
        raw_webhook_secret: "whsec_xyz",
        safeProperty: "KeepMe",
      },
      arrayItems: [{ apiKey: "secret_key" }, { publicItem: "displayed" }],
    };

    const cleaned = redactSensitiveData(input) as Record<string, unknown>;
    expect(cleaned.PASSWORD).toBe("[REDACTED]");
    expect(cleaned.Client_Secret).toBe("[REDACTED]");
    expect(cleaned.bearer_Token).toBe("[REDACTED]");
    expect(cleaned.user_OTP).toBe("[REDACTED]");
    expect(cleaned.credit_Card).toBe("[REDACTED]");
    expect((cleaned.nested as Record<string, unknown>).raw_webhook_secret).toBe("[REDACTED]");
    expect((cleaned.nested as Record<string, unknown>).safeProperty).toBe("KeepMe");
    expect((cleaned.arrayItems as Array<Record<string, unknown>>)[0].apiKey).toBe("[REDACTED]");
    expect((cleaned.arrayItems as Array<Record<string, unknown>>)[1].publicItem).toBe("displayed");
    expect(cleaned.username).toBe("student_atharv");
  });

  it("handles circular references safely without throwing", () => {
    const circular: Record<string, unknown> = { name: "circular_test" };
    circular.self = circular;

    expect(() => redactSensitiveData(circular)).not.toThrow();
    const result = redactSensitiveData(circular) as Record<string, unknown>;
    expect(result.self).toBe("[CIRCULAR]");
  });

  it("handles null, undefined and primitive values", () => {
    expect(redactSensitiveData(null)).toBeNull();
    expect(redactSensitiveData(undefined)).toBeUndefined();
    expect(redactSensitiveData("simple string")).toBe("simple string");
    expect(redactSensitiveData(12345)).toBe(12345);
  });
});

describe("Invalid Event Handling", () => {
  it("sanitizes missing or invalid event names and messages without crashing", () => {
    const logger = new Logger("test-service", "test", "0.0.1", [new ConsoleTransport()]);

    const event = logger.createEvent(
      "info",
      "application",
      null as unknown as string,
      undefined as unknown as string,
    );

    expect(event.event_name).toBe("unknown.event");
    expect(event.message).toBe("");
    expect(event.level).toBe("info");
    expect(event.service).toBe("test-service");
  });
});

describe("Logger Failure Behavior & Local File Transport", () => {
  const testLogsDir = path.resolve(process.cwd(), "test-logs-tmp");

  afterEach(() => {
    if (fs.existsSync(testLogsDir)) {
      fs.rmSync(testLogsDir, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
  });

  it("writes structured JSONL events to partitioned local filesystem in Node", async () => {
    const fileTransport = new NodeLocalFileTransport("test-logs-tmp");
    const logger = new Logger("test-service", "test", "0.0.1", [fileTransport]);

    const event = await logger.info(
      "payments",
      "payment.processed",
      "Payment verified successfully",
      {
        resource_id: "ord_123",
        metadata: { password: "secret_password", amount_paise: 499900 },
      },
    );

    const date = new Date(event.timestamp);
    const expectedFile = path.resolve(testLogsDir, getPartitionPath("test", "payments", date));

    expect(fs.existsSync(expectedFile)).toBe(true);

    const content = fs.readFileSync(expectedFile, "utf8");
    const parsed = JSON.parse(content.trim());

    expect(parsed.event_name).toBe("payment.processed");
    expect(parsed.metadata.password).toBe("[REDACTED]");
    expect(parsed.metadata.amount_paise).toBe(499900);
  });

  it("does not throw when transport encounters an error and logs warning", async () => {
    const brokenTransport = {
      name: "broken-transport",
      write: vi.fn().mockImplementation(() => {
        throw new Error("Disk quota exceeded");
      }),
    };

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const logger = new Logger("test-service", "test", "0.0.1", [brokenTransport]);

    // Should complete cleanly without throwing
    await expect(
      logger.error("errors", "system.crash", "Critical error simulation"),
    ).resolves.toBeDefined();

    expect(brokenTransport.write).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[LOGGER_TRANSPORT_ERROR] Transport broken-transport threw error:"),
      expect.any(Error),
    );
  });
});
