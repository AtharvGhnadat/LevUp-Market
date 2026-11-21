import { describe, expect, it } from "vitest";
import {
  buildSpecificationExport,
  clearCustomProjectDraft,
  eligibleDeliverablesFor,
  emptyCustomProjectForm,
  formatFileSize,
  loadCustomProjectDraft,
  MAX_ATTACHMENTS,
  parseCustomProjectUrlPrefill,
  saveCustomProjectDraft,
  validateAttachmentCandidate,
  validateCustomProjectForm,
  validateEngineeringBrief,
  type CustomProjectFormState,
} from "./custom-project-state";

function validState(): CustomProjectFormState {
  return {
    ...emptyCustomProjectForm,
    title: "ESP32 Cold-Chain Telemetry Logger",
    category: "iot-electronics",
    classification: "hybrid",
    requirements:
      "Need a battery-backed temperature and humidity monitor with offline SD buffering and MQTT sync.",
    expectedFunctionality:
      "Dashboard alerts when temperature exceeds threshold, CSV export, and firmware OTA updates.",
    techStack: "ESP32, C++, React, MQTT",
    hardwareSpecs: "SHT31 sensor, 18650 Li-ion shield, microSD module",
    budgetRange: "10000-25000",
    targetDeliveryDate: "2027-02-15",
    deliverables: ["source-code", "circuit-schematic", "bom-list"],
    contactName: "Atharv Ghanadat",
    contactEmail: "atharv@college.edu",
    contactPhone: "9876543210",
  };
}

describe("custom-project-state validation", () => {
  it("uses the verified owner for a workspace brief and keeps guest contact validation", () => {
    const draft = { ...validState(), contactName: "", contactEmail: "", contactPhone: "" };
    const day = new Date("2026-11-18");
    expect(validateEngineeringBrief(draft, day)).toEqual({});
    expect(Object.keys(validateCustomProjectForm(draft, day)).sort()).toEqual([
      "contactEmail",
      "contactName",
      "contactPhone",
    ]);
  });

  it("reports clear errors for an empty form", () => {
    const errors = validateCustomProjectForm(emptyCustomProjectForm, new Date("2026-11-18"));
    expect(errors.title).toBeDefined();
    expect(errors.category).toBeDefined();
    expect(errors.requirements).toBeDefined();
    expect(errors.expectedFunctionality).toBeDefined();
    expect(errors.budgetRange).toBeDefined();
    expect(errors.targetDeliveryDate).toBeDefined();
    expect(errors.contactName).toBeDefined();
    expect(errors.contactEmail).toBeDefined();
    expect(errors.contactPhone).toBeDefined();
  });

  it("passes validation for a complete requisition without requiring BOM on software projects", () => {
    const softwareState: CustomProjectFormState = {
      ...validState(),
      classification: "software",
      hardwareSpecs: "",
      deliverables: ["source-code", "setup-guide"],
    };
    const errors = validateCustomProjectForm(softwareState, new Date("2026-11-18"));
    expect(errors).toEqual({});
  });

  it("rejects invalid categories, invalid budgets, past dates and malformed phone numbers", () => {
    const state: CustomProjectFormState = {
      ...validState(),
      category: "unrecognized-category",
      budgetRange: "fake-budget",
      targetDeliveryDate: "2026-11-10",
      contactEmail: "invalid-email",
      contactPhone: "12345",
    };
    const errors = validateCustomProjectForm(state, new Date("2026-11-18"));
    expect(errors.category).toMatch(/valid engineering category/i);
    expect(errors.budgetRange).toMatch(/expected budget range/i);
    expect(errors.targetDeliveryDate).toMatch(/past/i);
    expect(errors.contactEmail).toMatch(/valid email/i);
    expect(errors.contactPhone).toMatch(/10-digit/i);
  });

  it("filters hardware-only deliverables out for software classification", () => {
    const softwareDeliverables = eligibleDeliverablesFor("software").map((d) => d.id);
    expect(softwareDeliverables).not.toContain("bom-list");
    expect(softwareDeliverables).not.toContain("circuit-schematic");
    expect(softwareDeliverables).toContain("source-code");
  });
});

describe("custom-project-state attachments, prefill, draft, and export", () => {
  it("validates file format, size, and count limits", () => {
    expect(validateAttachmentCandidate({ name: "spec.pdf", size: 2048 }, 0)).toBeNull();
    expect(validateAttachmentCandidate({ name: "malware.exe", size: 1024 }, 0)).toMatch(
      /unsupported/i,
    );
    expect(validateAttachmentCandidate({ name: "huge.zip", size: 15 * 1024 * 1024 }, 0)).toMatch(
      /10 MB/i,
    );
    expect(validateAttachmentCandidate({ name: "extra.pdf", size: 1024 }, MAX_ATTACHMENTS)).toMatch(
      /up to 5/i,
    );
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("prefills form fields from catalog project query params", () => {
    const prefill = parseCustomProjectUrlPrefill(
      "?project=esp32-smart-irrigation-system&type=change-quote",
    );
    expect(prefill.requestKind).toBe("change-quote");
    expect(prefill.category).toBe("iot-electronics");
    expect(prefill.title).toContain("ESP32 Smart Irrigation System");
    expect(prefill.classification).toBe("hybrid");
  });

  it("saves, loads, and clears local drafts safely", () => {
    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    };

    const state = validState();
    const savedAt = saveCustomProjectDraft(mockStorage, state, new Date("2026-11-18T12:00:00Z"));
    expect(savedAt).toBe("2026-11-18T12:00:00.000Z");

    const loaded = loadCustomProjectDraft(mockStorage);
    expect(loaded?.state.title).toBe(state.title);
    expect(loaded?.savedAt).toBe(savedAt);

    // Test TTL expiry (older than 7 days)
    const eightDaysLater = new Date("2026-11-26T13:00:00Z");
    expect(loadCustomProjectDraft(mockStorage, eightDaysLater)).toBeNull();

    clearCustomProjectDraft(mockStorage);
    expect(loadCustomProjectDraft(mockStorage)).toBeNull();
  });

  it("builds a clean JSON export marked explicitly as frontend prototype only", () => {
    const exported = buildSpecificationExport(validState(), [
      { id: "1", name: "block-diagram.pdf", sizeBytes: 4200, type: "application/pdf" },
    ]);
    expect(exported.submissionMode).toBe("frontend-prototype-only");
    expect(exported.project.hardwareSpecs).toContain("SHT31");
    expect(exported.project.stagedReferenceFiles).toHaveLength(1);
  });
});
