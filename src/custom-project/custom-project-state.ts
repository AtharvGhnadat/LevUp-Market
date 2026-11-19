import { catalogProjects } from "@/data/catalog-projects";
import { categories } from "@/data/categories";

export type ProjectClassification = "software" | "hardware" | "hybrid";

export type CustomProjectWorkflowStage = {
  code: string;
  label: string;
  detail: string;
};

export const customProjectWorkflowStages: CustomProjectWorkflowStage[] = [
  {
    code: "01",
    label: "Submit Requirements",
    detail: "Define scope, specs, deliverables and target date",
  },
  {
    code: "02",
    label: "Feasibility Review",
    detail: "Engineers verify technical scope and constraints",
  },
  {
    code: "03",
    label: "Quotation",
    detail: "Receive versioned plan, timeline and itemized quote",
  },
  {
    code: "04",
    label: "Acceptance",
    detail: "Approve formal quotation and milestone schedule",
  },
  {
    code: "05",
    label: "Development",
    detail: "Build, test and verify against accepted milestones",
  },
  {
    code: "06",
    label: "Delivery",
    detail: "Handover of files, hardware and package support",
  },
];

export const classificationOptions: Array<{
  value: ProjectClassification;
  label: string;
  description: string;
}> = [
  {
    value: "software",
    label: "Software",
    description: "Web, mobile, desktop, AI/ML models, APIs or simulation software",
  },
  {
    value: "hardware",
    label: "Hardware",
    description: "Circuits, PCB assemblies, embedded controllers or mechanical builds",
  },
  {
    value: "hybrid",
    label: "Hybrid (Hardware + Software)",
    description: "IoT systems, robotics or embedded devices with companion software",
  },
];

export const categoryOptions = [
  ...categories.map((c) => ({ slug: c.slug, label: c.name })),
  { slug: "other-cross-disciplinary", label: "Other / Cross-disciplinary" },
];

export const budgetRangeOptions = [
  { value: "under-5000", label: "Under ₹5,000" },
  { value: "5000-10000", label: "₹5,000 – ₹10,000" },
  { value: "10000-25000", label: "₹10,000 – ₹25,000" },
  { value: "25000-50000", label: "₹25,000 – ₹50,000" },
  { value: "above-50000", label: "Above ₹50,000" },
  { value: "estimate-requested", label: "Need engineering estimate" },
];

export type DeliverableOption = {
  id: string;
  label: string;
  group: "core" | "optional";
  classifications: ProjectClassification[];
};

export const deliverableOptions: DeliverableOption[] = [
  {
    id: "source-code",
    label: "Complete Source Code / Firmware",
    group: "core",
    classifications: ["software", "hardware", "hybrid"],
  },
  {
    id: "system-architecture",
    label: "System Architecture & Block Diagram",
    group: "core",
    classifications: ["software", "hardware", "hybrid"],
  },
  {
    id: "setup-guide",
    label: "Setup, Build & Execution Guide",
    group: "core",
    classifications: ["software", "hardware", "hybrid"],
  },
  {
    id: "circuit-schematic",
    label: "Circuit Schematic & Pinout Mapping",
    group: "core",
    classifications: ["hardware", "hybrid"],
  },
  {
    id: "bom-list",
    label: "Bill of Materials (BOM)",
    group: "core",
    classifications: ["hardware", "hybrid"],
  },
  {
    id: "assembled-hardware",
    label: "Assembled & Tested Hardware Prototype",
    group: "optional",
    classifications: ["hardware", "hybrid"],
  },
  {
    id: "technical-report",
    label: "Technical Project Report (PDF / DOCX)",
    group: "optional",
    classifications: ["software", "hardware", "hybrid"],
  },
  {
    id: "presentation-deck",
    label: "Review / Viva Presentation Deck (PPT)",
    group: "optional",
    classifications: ["software", "hardware", "hybrid"],
  },
  {
    id: "simulation-files",
    label: "Simulation Models (Proteus / MATLAB / CAD)",
    group: "optional",
    classifications: ["software", "hardware", "hybrid"],
  },
  {
    id: "walkthrough-session",
    label: "Live Technical Walkthrough & Setup Support",
    group: "optional",
    classifications: ["software", "hardware", "hybrid"],
  },
];

export type AttachmentMetadata = {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
};

export type CustomProjectFormState = {
  referenceProjectSlug: string;
  requestKind: "new-custom" | "change-quote";
  title: string;
  category: string;
  classification: ProjectClassification;
  requirements: string;
  expectedFunctionality: string;
  techStack: string;
  hardwareSpecs: string;
  academicContext: string;
  budgetRange: string;
  targetDeliveryDate: string;
  deliverables: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  institution: string;
  accountReference: string;
};

export type CustomProjectFieldErrors = Partial<
  Record<keyof CustomProjectFormState | "attachments", string>
>;

export const DRAFT_STORAGE_KEY = "levup_custom_project_draft_v1";
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_ATTACHMENT_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".zip",
  ".docx",
  ".doc",
  ".txt",
  ".csv",
  ".sch",
  ".step",
  ".stl",
];

export const emptyCustomProjectForm: CustomProjectFormState = {
  referenceProjectSlug: "",
  requestKind: "new-custom",
  title: "",
  category: "",
  classification: "software",
  requirements: "",
  expectedFunctionality: "",
  techStack: "",
  hardwareSpecs: "",
  academicContext: "",
  budgetRange: "",
  targetDeliveryDate: "",
  deliverables: ["source-code", "setup-guide"],
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  institution: "",
  accountReference: "",
};

export function eligibleDeliverablesFor(
  classification: ProjectClassification,
): DeliverableOption[] {
  return deliverableOptions.filter((option) => option.classifications.includes(classification));
}

export function parseCustomProjectUrlPrefill(search: string): Partial<CustomProjectFormState> {
  const params = new URLSearchParams(search);
  const projectSlug = params.get("project")?.trim() || "";
  const requestType = params.get("type")?.trim() || "";
  const categoryParam = params.get("category")?.trim() || "";

  const patch: Partial<CustomProjectFormState> = {};

  if (projectSlug) {
    const found = catalogProjects.find((p) => p.slug === projectSlug);
    patch.referenceProjectSlug = projectSlug;
    patch.requestKind = requestType === "change-quote" ? "change-quote" : "new-custom";
    if (found) {
      patch.title =
        requestType === "change-quote"
          ? `Modification request: ${found.title}`
          : `Custom build based on ${found.title}`;
      patch.category = found.category;
      patch.classification =
        found.deliveryType === "digital"
          ? "software"
          : found.deliveryType === "physical"
            ? "hardware"
            : "hybrid";
      patch.techStack = found.technologies.join(", ");
    }
  } else if (categoryParam && categoryOptions.some((c) => c.slug === categoryParam)) {
    patch.category = categoryParam;
  }

  return patch;
}

export function validateAttachmentCandidate(
  file: { name: string; size: number },
  existingCount: number,
): string | null {
  if (existingCount >= MAX_ATTACHMENTS) {
    return `You can stage up to ${MAX_ATTACHMENTS} reference files per requisition.`;
  }
  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return `"${file.name}" exceeds the 10 MB per-file limit.`;
  }
  const lower = file.name.toLowerCase();
  const hasAllowedExt = ACCEPTED_ATTACHMENT_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!hasAllowedExt) {
    return `"${file.name}" uses an unsupported file format.`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function todayIsoDate(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function validateEngineeringBrief(
  state: CustomProjectFormState,
  now = new Date(),
): CustomProjectFieldErrors {
  const errors: CustomProjectFieldErrors = {};

  if (state.title.trim().length < 5) {
    errors.title = "Enter a clear project title (at least 5 characters).";
  }

  const validCategories = new Set(categoryOptions.map((c) => c.slug));
  if (!state.category || !validCategories.has(state.category)) {
    errors.category = "Select a valid engineering category.";
  }

  if (!["software", "hardware", "hybrid"].includes(state.classification)) {
    errors.classification = "Select a valid project classification.";
  }

  if (state.requirements.trim().length < 30) {
    errors.requirements =
      "Describe the project scope and problem statement in at least 30 characters.";
  }

  if (state.expectedFunctionality.trim().length < 15) {
    errors.expectedFunctionality =
      "List the core expected functionality or user/system outcomes (at least 15 characters).";
  }

  const validBudgets = new Set(budgetRangeOptions.map((b) => b.value));
  if (!state.budgetRange || !validBudgets.has(state.budgetRange)) {
    errors.budgetRange = "Select an expected budget range or choose 'Need engineering estimate'.";
  }

  if (!state.targetDeliveryDate) {
    errors.targetDeliveryDate = "Choose a target delivery date.";
  } else if (
    !/^\d{4}-\d{2}-\d{2}$/.test(state.targetDeliveryDate) ||
    isNaN(Date.parse(state.targetDeliveryDate))
  ) {
    errors.targetDeliveryDate = "Enter a valid calendar date (YYYY-MM-DD).";
  } else if (state.targetDeliveryDate < todayIsoDate(now)) {
    errors.targetDeliveryDate = "Target delivery date cannot be in the past.";
  }

  const eligibleIds = new Set(eligibleDeliverablesFor(state.classification).map((d) => d.id));
  const validSelectedDeliverables = state.deliverables.filter((id) => eligibleIds.has(id));
  if (validSelectedDeliverables.length === 0) {
    errors.deliverables = "Select at least one required deliverable.";
  }

  return errors;
}

export function validateCustomProjectForm(
  state: CustomProjectFormState,
  now = new Date(),
): CustomProjectFieldErrors {
  const errors = validateEngineeringBrief(state, now);
  if (state.contactName.trim().length < 2) {
    errors.contactName = "Enter your full name.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(state.contactEmail.trim())) {
    errors.contactEmail = "Enter a valid email address for feasibility review and quotation.";
  }

  const digits = state.contactPhone.replace(/\D/g, "");
  if (digits.length !== 10) {
    errors.contactPhone = "Enter a valid 10-digit mobile number.";
  }

  return errors;
}

export function loadCustomProjectDraft(
  storage: Pick<Storage, "getItem" | "removeItem"> | null,
  now = new Date(),
): {
  state: CustomProjectFormState;
  savedAt: string;
} | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      version?: number;
      state?: Partial<CustomProjectFormState>;
      savedAt?: string;
    };
    if (!parsed || typeof parsed !== "object" || !parsed.state) return null;

    // Validate version and TTL expiry (Codex A2)
    if (parsed.savedAt) {
      const savedTime = Date.parse(parsed.savedAt);
      if (isNaN(savedTime) || now.getTime() - savedTime > DRAFT_MAX_AGE_MS) {
        storage.removeItem(DRAFT_STORAGE_KEY);
        return null;
      }
    }

    return {
      state: { ...emptyCustomProjectForm, ...parsed.state },
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
    };
  } catch {
    return null;
  }
}

export function saveCustomProjectDraft(
  storage: Pick<Storage, "setItem"> | null,
  state: CustomProjectFormState,
  now = new Date(),
): string | null {
  if (!storage) return null;
  try {
    const savedAt = now.toISOString();
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ version: 1, state, savedAt }));
    return savedAt;
  } catch {
    return null;
  }
}

export function clearCustomProjectDraft(storage: Pick<Storage, "removeItem"> | null): void {
  if (!storage) return;
  try {
    storage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function buildSpecificationExport(
  state: CustomProjectFormState,
  attachments: AttachmentMetadata[],
) {
  const categoryLabel =
    categoryOptions.find((c) => c.slug === state.category)?.label ?? state.category;
  const budgetLabel =
    budgetRangeOptions.find((b) => b.value === state.budgetRange)?.label ?? state.budgetRange;
  const deliverableLabels = deliverableOptions
    .filter((d) => state.deliverables.includes(d.id))
    .map((d) => d.label);

  return {
    schema: "levup.custom-project-requisition.prototype.v1",
    submissionMode: "frontend-prototype-only",
    note: "Generated locally by the LevUp Projects frontend requisition prototype. Not yet submitted to a live backend.",
    exportedAt: new Date().toISOString(),
    project: {
      title: state.title.trim(),
      category: categoryLabel,
      classification: state.classification,
      referenceProjectSlug: state.referenceProjectSlug || null,
      requestKind: state.requestKind,
      requirements: state.requirements.trim(),
      expectedFunctionality: state.expectedFunctionality.trim(),
      techStack: state.techStack.trim() || null,
      hardwareSpecs:
        state.classification === "software" ? null : state.hardwareSpecs.trim() || null,
      academicContext: state.academicContext.trim() || null,
      budgetRange: budgetLabel,
      targetDeliveryDate: state.targetDeliveryDate,
      deliverables: deliverableLabels,
      stagedReferenceFiles: attachments.map((a) => ({
        name: a.name,
        sizeBytes: a.sizeBytes,
        type: a.type,
      })),
    },
    contact: {
      name: state.contactName.trim(),
      email: state.contactEmail.trim(),
      phone: state.contactPhone.trim(),
      institution: state.institution.trim() || null,
      accountReference: state.accountReference.trim() || null,
    },
  };
}
