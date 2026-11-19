import { useAuth } from "@/auth/auth-context";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Cpu,
  Download,
  FileText,
  Info,
  Layers,
  Paperclip,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  ACCEPTED_ATTACHMENT_EXTENSIONS,
  budgetRangeOptions,
  buildSpecificationExport,
  categoryOptions,
  classificationOptions,
  clearCustomProjectDraft,
  customProjectWorkflowStages,
  deliverableOptions,
  eligibleDeliverablesFor,
  emptyCustomProjectForm,
  formatFileSize,
  loadCustomProjectDraft,
  MAX_ATTACHMENTS,
  parseCustomProjectUrlPrefill,
  saveCustomProjectDraft,
  todayIsoDate,
  validateAttachmentCandidate,
  validateCustomProjectForm,
  type AttachmentMetadata,
  type CustomProjectFieldErrors,
  type CustomProjectFormState,
  type ProjectClassification,
} from "@/custom-project/custom-project-state";
import { cn } from "@/lib/cn";
import { to } from "@/lib/routes";

type RequisitionPhase = "edit" | "review" | "submitted";

const classificationIconMap: Record<ProjectClassification, typeof Code2> = {
  software: Code2,
  hardware: Cpu,
  hybrid: Layers,
};

function getInitialFormState(): {
  form: CustomProjectFormState;
  draftRestored: boolean;
  savedAt: string;
} {
  const prefill = parseCustomProjectUrlPrefill(window.location.search);
  const hasPrefill = Object.keys(prefill).length > 0;
  const saved = loadCustomProjectDraft(window.localStorage);

  if (hasPrefill && !saved) {
    return {
      form: { ...emptyCustomProjectForm, ...prefill },
      draftRestored: false,
      savedAt: "",
    };
  }

  if (saved) {
    return {
      form: saved.state,
      draftRestored: true,
      savedAt: saved.savedAt,
    };
  }

  return {
    form: { ...emptyCustomProjectForm },
    draftRestored: false,
    savedAt: "",
  };
}

export function CustomProjectPage() {
  const { state: customer } = useAuth();
  const [sending, setSending] = useState(false),
    [sendError, setSendError] = useState("");
  const requestKey = useRef<string | null>(null);
  const submitting = useRef(false);
  async function submitToWorkspace() {
    if (customer.status !== "signed-in" || submitting.current) return;
    if (form.title.trim().length > 160) {
      setSendError("Shorten the project title to 160 characters before submitting.");
      return;
    }
    submitting.current = true;
    setSending(true);
    setSendError("");
    try {
      requestKey.current ??= crypto.randomUUID();
      const { submitBrief } = await import("@/workspace/repository");
      await submitBrief(form, requestKey.current);
      clearCustomProjectDraft(window.localStorage);
      window.location.assign(to("/dashboard/custom-requests"));
    } catch {
      setSendError("We couldn’t confirm submission. Your specification is still here. Try again.");
      submitting.current = false;
      setSending(false);
    }
  }
  const initial = useMemo(() => getInitialFormState(), []);
  const [form, setForm] = useState<CustomProjectFormState>(initial.form);
  const [attachments, setAttachments] = useState<AttachmentMetadata[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [errors, setErrors] = useState<CustomProjectFieldErrors>({});
  const [phase, setPhase] = useState<RequisitionPhase>("edit");
  const [draftSavedAt, setDraftSavedAt] = useState(initial.savedAt);
  const [draftRestored, setDraftRestored] = useState(initial.draftRestored);

  const errorBannerRef = useRef<HTMLDivElement>(null);
  const pageTopRef = useRef<HTMLDivElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const submittedHeadingRef = useRef<HTMLHeadingElement>(null);
  const editHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = "Custom Engineering Project Request — LevUp Projects";
    if (description) {
      description.content =
        "Submit technical specifications, deliverables, budget range and target timeline for a custom software, hardware or hybrid engineering project.";
    }
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, []);

  // Persist draft locally whenever form changes during editing
  useEffect(() => {
    if (phase === "submitted") return;
    const hasContent =
      form.title.trim() !== "" ||
      form.requirements.trim() !== "" ||
      form.expectedFunctionality.trim() !== "" ||
      form.contactName.trim() !== "" ||
      form.contactEmail.trim() !== "" ||
      form.category !== "";
    if (!hasContent) return;
    const timer = window.setTimeout(() => {
      const saved = saveCustomProjectDraft(window.localStorage, form);
      if (saved) setDraftSavedAt(saved);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [form, phase]);

  const eligibleDeliverables = useMemo(
    () => eligibleDeliverablesFor(form.classification),
    [form.classification],
  );
  const coreDeliverables = eligibleDeliverables.filter((d) => d.group === "core");
  const optionalDeliverables = eligibleDeliverables.filter((d) => d.group === "optional");

  const activeSelectedDeliverables = useMemo(() => {
    const eligibleIds = new Set(eligibleDeliverables.map((d) => d.id));
    return form.deliverables.filter((id) => eligibleIds.has(id));
  }, [eligibleDeliverables, form.deliverables]);

  const updateField = <K extends keyof CustomProjectFormState>(
    key: K,
    value: CustomProjectFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleClassificationChange = (nextClass: ProjectClassification) => {
    const nextEligibleIds = new Set(eligibleDeliverablesFor(nextClass).map((d) => d.id));
    setForm((current) => ({
      ...current,
      classification: nextClass,
      deliverables: current.deliverables.filter((id) => nextEligibleIds.has(id)),
    }));
    setErrors((current) => {
      if (!current.deliverables) return current;
      const next = { ...current };
      delete next.deliverables;
      return next;
    });
  };

  const toggleDeliverable = (id: string) => {
    setForm((current) => {
      const exists = current.deliverables.includes(id);
      return {
        ...current,
        deliverables: exists
          ? current.deliverables.filter((item) => item !== id)
          : [...current.deliverables, id],
      };
    });
    setErrors((current) => {
      if (!current.deliverables) return current;
      const next = { ...current };
      delete next.deliverables;
      return next;
    });
  };

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setAttachmentError("");
    const nextItems: AttachmentMetadata[] = [];
    let runningCount = attachments.length;

    for (const file of Array.from(fileList)) {
      const validationMsg = validateAttachmentCandidate(file, runningCount);
      if (validationMsg) {
        setAttachmentError(validationMsg);
        break;
      }
      nextItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${runningCount}`,
        name: file.name,
        sizeBytes: file.size,
        type: file.type || "application/octet-stream",
      });
      runningCount += 1;
    }

    if (nextItems.length > 0) {
      setAttachments((current) => [...current, ...nextItems]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => current.filter((item) => item.id !== id));
    setAttachmentError("");
  };

  const handleReviewSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateCustomProjectForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.setTimeout(() => errorBannerRef.current?.focus(), 0);
      return;
    }
    setErrors({});
    setPhase("review");
    pageTopRef.current?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
    window.setTimeout(() => reviewHeadingRef.current?.focus(), 50);
  };

  const handleConfirmPrototype = () => {
    if (submitting.current) return;
    clearCustomProjectDraft(window.localStorage);
    setDraftSavedAt("");
    setDraftRestored(false);
    setPhase("submitted");
    pageTopRef.current?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
    window.setTimeout(() => submittedHeadingRef.current?.focus(), 50);
  };

  const handleBackToEdit = () => {
    if (submitting.current) return;
    requestKey.current = null;
    setSendError("");
    setPhase("edit");
    pageTopRef.current?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
    window.setTimeout(() => editHeadingRef.current?.focus(), 50);
  };

  const handleClearDraft = () => {
    clearCustomProjectDraft(window.localStorage);
    setForm({ ...emptyCustomProjectForm });
    setAttachments([]);
    setAttachmentError("");
    setErrors({});
    setDraftSavedAt("");
    setDraftRestored(false);
    setPhase("edit");
  };

  const handleDownloadJson = () => {
    const payload = buildSpecificationExport(form, attachments);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `levup-custom-requisition-${todayIsoDate()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const categoryLabel =
    categoryOptions.find((c) => c.slug === form.category)?.label || "Not selected";
  const budgetLabel =
    budgetRangeOptions.find((b) => b.value === form.budgetRange)?.label || "Not selected";
  const classificationLabel =
    classificationOptions.find((c) => c.value === form.classification)?.label ||
    form.classification;

  const errorCount = Object.keys(errors).length;

  return (
    <div ref={pageTopRef} className="scroll-mt-24 bg-mineral pb-16">
      {/* Header & Assembly Spine */}
      <section className="border-b border-line bg-mineral">
        <Container className="py-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Engineering Requisition</Eyebrow>
              <h1
                ref={editHeadingRef}
                tabIndex={-1}
                className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-alloy outline-none sm:text-4xl"
              >
                Request a Custom Project
              </h1>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted sm:text-base">
                Submit technical requirements for custom software, embedded, IoT, electronics or
                hybrid engineering builds. Feasibility, timeline and pricing are confirmed by formal
                quotation before work begins.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-volt-action/30 bg-volt-tint px-3 py-2 font-mono text-xs font-medium text-volt-text">
                <Info aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {customer.status === "signed-in"
                  ? "Submit your reviewed brief to your workspace"
                  : "Local specification preview · Sign in to submit a brief"}
              </span>
            </div>
          </div>

          {/* The LevUp Assembly Spine — 6-Stage Custom Development Workflow */}
          <div className="mt-8 rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
              <h2 className="font-display text-sm font-semibold text-alloy">
                Custom Development Workflow
              </h2>
              <span className="font-mono text-xs text-muted tabular-nums">
                {phase === "edit"
                  ? "Current stage: 01 Drafting requirements"
                  : phase === "review"
                    ? "Current stage: 01 Reviewing requisition"
                    : "Local specification ready for export"}
              </span>
            </div>

            <ol className="relative mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 right-6 left-6 hidden h-px bg-line lg:block"
              />
              {customProjectWorkflowStages.map((stage, index) => {
                const isActive = index === 0;
                const isPrepared = index === 0 && phase === "submitted";
                return (
                  <li key={stage.code} className="relative flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "relative z-10 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-medium tabular-nums",
                          isPrepared
                            ? "border-success bg-success text-white"
                            : isActive
                              ? "border-volt-action bg-volt-action text-white"
                              : "border-line bg-mineral text-muted",
                        )}
                      >
                        {isPrepared ? (
                          <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                        ) : (
                          stage.code
                        )}
                      </span>
                      <span className="relative z-10 bg-white pr-2 font-display text-xs font-semibold text-alloy">
                        {stage.label}
                      </span>
                    </div>
                    <p className="mt-2 font-sans text-xs leading-snug text-muted">{stage.detail}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="mt-8">
        {form.referenceProjectSlug && phase === "edit" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4 shadow-xs">
            <div className="flex items-center gap-3">
              <FileText
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-volt-text"
                strokeWidth={1.75}
              />
              <p className="font-sans text-xs text-alloy sm:text-sm">
                Prefilled from catalog project{" "}
                <span className="font-mono font-medium text-volt-text">
                  {form.referenceProjectSlug}
                </span>
                {form.requestKind === "change-quote" ? " (modification quotation)" : ""}.
              </p>
            </div>
            <a
              href={to(`/projects/${form.referenceProjectSlug}`)}
              className="font-sans text-xs font-medium text-volt-text hover:underline"
            >
              View source listing
            </a>
          </div>
        )}

        {draftRestored && phase === "edit" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-3.5 text-xs text-muted shadow-xs">
            <span>
              Restored your saved local draft from this browser. Reference file attachments must be
              re-selected if needed.
            </span>
            <button
              type="button"
              onClick={handleClearDraft}
              className="inline-flex items-center gap-1.5 font-medium text-volt-text hover:underline"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
              Start fresh
            </button>
          </div>
        )}

        {phase === "edit" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left 8 columns: Requisition Form */}
            <form
              onSubmit={handleReviewSubmit}
              noValidate
              className="space-y-6 lg:col-span-8"
              aria-label="Custom engineering project requisition form"
            >
              {errorCount > 0 && (
                <div
                  ref={errorBannerRef}
                  tabIndex={-1}
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900 focus:outline-2 focus:outline-red-600"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                      strokeWidth={1.75}
                    />
                    <div>
                      <p className="font-display text-sm font-semibold text-red-900">
                        {errorCount} {errorCount === 1 ? "field requires" : "fields require"}{" "}
                        attention before review
                      </p>
                      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-red-800">
                        {Object.values(errors).map((message) => (
                          <li key={message}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 01: Scope & Classification */}
              <SectionCard
                code="01"
                title="Scope & Project Classification"
                description="Identify the project title, engineering domain and whether it involves software, hardware or both."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="cp-title" required>
                      Project Title
                    </FieldLabel>
                    <input
                      id="cp-title"
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      aria-invalid={Boolean(errors.title)}
                      aria-describedby={errors.title ? "cp-title-error" : undefined}
                      placeholder="e.g. LoRaWAN Agricultural Soil Telemetry Node & Dashboard"
                      className={inputClass(Boolean(errors.title))}
                    />
                    {errors.title && <FieldError id="cp-title-error">{errors.title}</FieldError>}
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="cp-category" required>
                      Engineering Category
                    </FieldLabel>
                    <select
                      id="cp-category"
                      required
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      aria-invalid={Boolean(errors.category)}
                      aria-describedby={errors.category ? "cp-category-error" : undefined}
                      className={inputClass(Boolean(errors.category))}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <FieldError id="cp-category-error">{errors.category}</FieldError>
                    )}
                  </div>

                  <fieldset className="sm:col-span-2">
                    <legend className="block text-xs font-medium text-alloy">
                      Project Classification <span className="text-volt-text">*</span>
                    </legend>
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {classificationOptions.map((option) => {
                        const Icon = classificationIconMap[option.value];
                        const selected = form.classification === option.value;
                        return (
                          <label
                            key={option.value}
                            className={cn(
                              "flex cursor-pointer flex-col rounded-lg border p-3.5 transition-colors duration-150",
                              selected
                                ? "border-volt-action bg-volt-tint/50"
                                : "border-line bg-mineral/20 hover:border-alloy/30 hover:bg-white",
                            )}
                          >
                            <input
                              type="radio"
                              name="classification"
                              value={option.value}
                              checked={selected}
                              onChange={() => handleClassificationChange(option.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center justify-between gap-2">
                              <Icon
                                aria-hidden="true"
                                className={cn(
                                  "h-4 w-4",
                                  selected ? "text-volt-text" : "text-muted",
                                )}
                                strokeWidth={1.75}
                              />
                              <span
                                className={cn(
                                  "h-4 w-4 rounded-full border",
                                  selected
                                    ? "border-4 border-volt-action bg-white"
                                    : "border-alloy/30 bg-white",
                                )}
                                aria-hidden="true"
                              />
                            </div>
                            <span className="mt-2.5 font-display text-sm font-semibold text-alloy">
                              {option.label}
                            </span>
                            <span className="mt-1 font-sans text-xs leading-snug text-muted">
                              {option.description}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              </SectionCard>

              {/* Section 02: Requirements & Technical Specification */}
              <SectionCard
                code="02"
                title="Requirements & Technical Specification"
                description="Detail what the system must accomplish, key functional behaviors and any required stack or hardware constraints."
              >
                <div className="space-y-5">
                  <div>
                    <FieldLabel htmlFor="cp-requirements" required>
                      Detailed Requirements &amp; Problem Statement
                    </FieldLabel>
                    <textarea
                      id="cp-requirements"
                      rows={4}
                      required
                      value={form.requirements}
                      onChange={(e) => updateField("requirements", e.target.value)}
                      aria-invalid={Boolean(errors.requirements)}
                      aria-describedby={
                        errors.requirements ? "cp-requirements-error" : "cp-requirements-help"
                      }
                      placeholder="Describe the engineering problem, operating environment, inputs, outputs and constraints..."
                      className={textareaClass(Boolean(errors.requirements))}
                    />
                    <div className="mt-1 flex items-center justify-between gap-2">
                      {errors.requirements ? (
                        <FieldError id="cp-requirements-error">{errors.requirements}</FieldError>
                      ) : (
                        <p id="cp-requirements-help" className="text-[0.6875rem] text-muted">
                          Minimum 30 characters so engineers can evaluate technical feasibility.
                        </p>
                      )}
                      <span className="shrink-0 whitespace-nowrap font-mono text-[0.6875rem] text-muted tabular-nums">
                        {form.requirements.trim().length} chars
                      </span>
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="cp-functionality" required>
                      Expected Functionality &amp; Verification Criteria
                    </FieldLabel>
                    <textarea
                      id="cp-functionality"
                      rows={3}
                      required
                      value={form.expectedFunctionality}
                      onChange={(e) => updateField("expectedFunctionality", e.target.value)}
                      aria-invalid={Boolean(errors.expectedFunctionality)}
                      aria-describedby={
                        errors.expectedFunctionality ? "cp-functionality-error" : undefined
                      }
                      placeholder="List key features, user roles, accuracy targets, interfaces or demo scenarios required..."
                      className={textareaClass(Boolean(errors.expectedFunctionality))}
                    />
                    {errors.expectedFunctionality && (
                      <FieldError id="cp-functionality-error">
                        {errors.expectedFunctionality}
                      </FieldError>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="cp-stack">
                        Preferred Technologies / Languages (Optional)
                      </FieldLabel>
                      <input
                        id="cp-stack"
                        type="text"
                        value={form.techStack}
                        onChange={(e) => updateField("techStack", e.target.value)}
                        placeholder="e.g. Python, React, PostgreSQL, TensorFlow, ESP-IDF"
                        className={inputClass(false)}
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor="cp-context">
                        Academic / Research Context (Optional)
                      </FieldLabel>
                      <input
                        id="cp-context"
                        type="text"
                        value={form.academicContext}
                        onChange={(e) => updateField("academicContext", e.target.value)}
                        placeholder="e.g. Final year capstone, IEEE paper, robotics competition"
                        className={inputClass(false)}
                      />
                    </div>
                  </div>

                  {form.classification !== "software" && (
                    <div className="rounded-lg border border-line bg-mineral/40 p-4">
                      <FieldLabel htmlFor="cp-hardware-specs">
                        Hardware Specifications, Components &amp; Constraints (Optional)
                      </FieldLabel>
                      <textarea
                        id="cp-hardware-specs"
                        rows={3}
                        value={form.hardwareSpecs}
                        onChange={(e) => updateField("hardwareSpecs", e.target.value)}
                        placeholder="Microcontroller preferences (ESP32, STM32, Arduino, Raspberry Pi), sensors, power supply, enclosure or PCB dimensions..."
                        className={textareaClass(false)}
                      />
                      <p className="mt-1.5 text-[0.6875rem] text-muted">
                        Leave blank if you want LevUp engineers to recommend components and prepare
                        a BOM during feasibility review.
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Section 03: Deliverables, Budget & Target Date */}
              <SectionCard
                code="03"
                title="Deliverables, Budget Range & Target Date"
                description="Choose required deliverables for your classification and indicate your target schedule."
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="cp-budget" required>
                        Estimated Budget Range
                      </FieldLabel>
                      <select
                        id="cp-budget"
                        required
                        value={form.budgetRange}
                        onChange={(e) => updateField("budgetRange", e.target.value)}
                        aria-invalid={Boolean(errors.budgetRange)}
                        aria-describedby={errors.budgetRange ? "cp-budget-error" : undefined}
                        className={inputClass(Boolean(errors.budgetRange))}
                      >
                        <option value="">Select budget range</option>
                        {budgetRangeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.budgetRange && (
                        <FieldError id="cp-budget-error">{errors.budgetRange}</FieldError>
                      )}
                    </div>

                    <div>
                      <FieldLabel htmlFor="cp-date" required>
                        Target Delivery Date
                      </FieldLabel>
                      <input
                        id="cp-date"
                        type="date"
                        required
                        min={todayIsoDate()}
                        value={form.targetDeliveryDate}
                        onChange={(e) => updateField("targetDeliveryDate", e.target.value)}
                        aria-invalid={Boolean(errors.targetDeliveryDate)}
                        aria-describedby={errors.targetDeliveryDate ? "cp-date-error" : undefined}
                        className={inputClass(Boolean(errors.targetDeliveryDate))}
                      />
                      {errors.targetDeliveryDate && (
                        <FieldError id="cp-date-error">{errors.targetDeliveryDate}</FieldError>
                      )}
                    </div>
                  </div>

                  <fieldset>
                    <legend className="block text-xs font-medium text-alloy">
                      Core &amp; Optional Deliverables <span className="text-volt-text">*</span>
                    </legend>
                    <p className="mt-1 text-[0.6875rem] text-muted">
                      Available options adjust to your {classificationLabel.toLowerCase()}{" "}
                      classification. Hardware items like BOM and schematics are never required for
                      software-only builds.
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-[0.6875rem] font-medium text-muted">
                          Core engineering deliverables
                        </p>
                        <div className="mt-2 space-y-2">
                          {coreDeliverables.map((item) => (
                            <DeliverableCheckbox
                              key={item.id}
                              label={item.label}
                              checked={activeSelectedDeliverables.includes(item.id)}
                              onChange={() => toggleDeliverable(item.id)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-mono text-[0.6875rem] font-medium text-muted">
                          Optional documentation &amp; add-ons
                        </p>
                        <div className="mt-2 space-y-2">
                          {optionalDeliverables.map((item) => (
                            <DeliverableCheckbox
                              key={item.id}
                              label={item.label}
                              checked={activeSelectedDeliverables.includes(item.id)}
                              onChange={() => toggleDeliverable(item.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {errors.deliverables && (
                      <FieldError id="cp-deliverables-error">{errors.deliverables}</FieldError>
                    )}
                  </fieldset>
                </div>
              </SectionCard>

              {/* Section 04: Reference Files & Contact Information */}
              <SectionCard
                code="04"
                title="Reference Files & Contact Information"
                description="Attach optional diagrams, syllabus briefs or datasheets, and provide contact details for your quotation."
              >
                <div className="space-y-6">
                  {/* Attachments */}
                  <div>
                    <FieldLabel htmlFor="cp-attachments">
                      Reference Files &amp; Attachments (Optional · up to {MAX_ATTACHMENTS} files,
                      10 MB each)
                    </FieldLabel>
                    <div className="mt-1.5 rounded-lg border border-dashed border-alloy/30 bg-mineral/30 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2.5 text-xs text-muted">
                          <Paperclip
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-muted"
                            strokeWidth={1.75}
                          />
                          <span>
                            Supported: {ACCEPTED_ATTACHMENT_EXTENSIONS.join(", ")} (staged locally
                            in prototype mode)
                          </span>
                        </div>
                        <label className="inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-alloy/25 bg-white px-3.5 py-2 font-display text-xs font-semibold text-alloy shadow-xs transition-colors duration-150 hover:bg-mineral">
                          Select Files
                          <input
                            id="cp-attachments"
                            type="file"
                            multiple
                            accept={ACCEPTED_ATTACHMENT_EXTENSIONS.join(",")}
                            onChange={(e) => {
                              handleFilesAdded(e.target.files);
                              e.target.value = "";
                            }}
                            className="sr-only"
                          />
                        </label>
                      </div>

                      {attachmentError && (
                        <FieldError id="cp-attachments-error">{attachmentError}</FieldError>
                      )}

                      {attachments.length > 0 && (
                        <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-white">
                          {attachments.map((file) => (
                            <li
                              key={file.id}
                              className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium text-alloy">{file.name}</p>
                                <p className="font-mono text-[0.6875rem] text-muted tabular-nums">
                                  {formatFileSize(file.sizeBytes)}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(file.id)}
                                aria-label={`Remove ${file.name}`}
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 gap-5 border-t border-line pt-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="cp-name" required>
                        Full Name
                      </FieldLabel>
                      <input
                        id="cp-name"
                        type="text"
                        required
                        value={form.contactName}
                        onChange={(e) => updateField("contactName", e.target.value)}
                        aria-invalid={Boolean(errors.contactName)}
                        aria-describedby={errors.contactName ? "cp-name-error" : undefined}
                        placeholder="Your full name"
                        className={inputClass(Boolean(errors.contactName))}
                      />
                      {errors.contactName && (
                        <FieldError id="cp-name-error">{errors.contactName}</FieldError>
                      )}
                    </div>

                    <div>
                      <FieldLabel htmlFor="cp-email" required>
                        Email Address
                      </FieldLabel>
                      <input
                        id="cp-email"
                        type="email"
                        required
                        value={form.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        aria-invalid={Boolean(errors.contactEmail)}
                        aria-describedby={errors.contactEmail ? "cp-email-error" : undefined}
                        placeholder="you@institution.edu"
                        className={inputClass(Boolean(errors.contactEmail))}
                      />
                      {errors.contactEmail && (
                        <FieldError id="cp-email-error">{errors.contactEmail}</FieldError>
                      )}
                    </div>

                    <div>
                      <FieldLabel htmlFor="cp-phone" required>
                        Phone / WhatsApp Number
                      </FieldLabel>
                      <input
                        id="cp-phone"
                        type="tel"
                        required
                        value={form.contactPhone}
                        onChange={(e) => updateField("contactPhone", e.target.value)}
                        aria-invalid={Boolean(errors.contactPhone)}
                        aria-describedby={errors.contactPhone ? "cp-phone-error" : undefined}
                        placeholder="10-digit mobile number"
                        className={inputClass(Boolean(errors.contactPhone))}
                      />
                      {errors.contactPhone && (
                        <FieldError id="cp-phone-error">{errors.contactPhone}</FieldError>
                      )}
                    </div>

                    <div>
                      <FieldLabel htmlFor="cp-institution">
                        College / Organization (Optional)
                      </FieldLabel>
                      <input
                        id="cp-institution"
                        type="text"
                        value={form.institution}
                        onChange={(e) => updateField("institution", e.target.value)}
                        placeholder="Institution or company name"
                        className={inputClass(false)}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="cp-account-ref">
                        Existing LevUp Account Email or Previous Order Reference (Optional)
                      </FieldLabel>
                      <input
                        id="cp-account-ref"
                        type="text"
                        value={form.accountReference}
                        onChange={(e) => updateField("accountReference", e.target.value)}
                        placeholder="Optional account reference once customer accounts are active"
                        className={inputClass(false)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Form Footer Actions */}
              <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                  {draftSavedAt ? (
                    <span className="font-mono text-[0.6875rem] text-muted">
                      Draft saved locally in this browser
                    </span>
                  ) : (
                    <span>Drafts save automatically on this device while editing.</span>
                  )}
                  {draftSavedAt && (
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      className="font-medium text-volt-text hover:underline"
                    >
                      Clear draft
                    </button>
                  )}
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                  Review Requisition
                  <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </div>
            </form>

            {/* Right 4 columns: Live Requisition Summary & Honest Scope Guardrails */}
            <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
              <div className="rounded-xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-base font-semibold text-alloy">
                  Requisition Summary
                </h2>
                <dl className="mt-4 space-y-3 border-t border-line pt-4 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Classification</dt>
                    <dd className="text-right font-medium text-alloy">{classificationLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Category</dt>
                    <dd className="text-right font-medium text-alloy">{categoryLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Budget Range</dt>
                    <dd className="text-right font-medium text-alloy">{budgetLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Target Date</dt>
                    <dd className="font-mono text-right font-medium text-alloy tabular-nums">
                      {form.targetDeliveryDate || "Not set"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Deliverables Selected</dt>
                    <dd className="font-mono text-right font-medium text-alloy tabular-nums">
                      {activeSelectedDeliverables.length}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Staged Reference Files</dt>
                    <dd className="font-mono text-right font-medium text-alloy tabular-nums">
                      {attachments.length} / {MAX_ATTACHMENTS}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 rounded-lg border border-line bg-mineral/50 p-3.5 text-xs leading-relaxed text-muted">
                  <p className="font-display text-xs font-semibold text-alloy">
                    Quotation &amp; Payment Policy
                  </p>
                  <p className="mt-1">
                    No payment is collected on this page. Custom builds are reviewed for engineering
                    feasibility first and scoped via a formal quotation before acceptance.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-alloy p-6 text-white shadow-card">
                <p className="font-mono text-xs text-volt">Need a ready-made baseline?</p>
                <h3 className="mt-1.5 font-display text-base font-semibold">
                  Explore Existing Projects
                </h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-muted-on-alloy">
                  If a published catalog project already matches most of your requirements, open its
                  specification page to request a targeted modification quote.
                </p>
                <div className="mt-4">
                  <ButtonLink href={to("/projects")} variant="primary" size="md" className="w-full">
                    Browse Project Catalog
                    <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  </ButtonLink>
                </div>
              </div>
            </aside>
          </div>
        )}

        {phase === "review" && (
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
                <div>
                  <span className="font-mono text-xs font-medium text-volt-text">
                    Pre-submission review
                  </span>
                  <h2
                    ref={reviewHeadingRef}
                    tabIndex={-1}
                    className="mt-1 font-display text-2xl font-semibold text-alloy outline-none"
                  >
                    Review Your Engineering Requisition
                  </h2>
                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Verify all specifications, deliverables and contact information before
                    confirming.
                  </p>
                </div>
                <Button type="button" variant="outline" size="md" onClick={handleBackToEdit}>
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  Edit Specification
                </Button>
              </div>

              <div className="mt-6 space-y-6 text-sm">
                <dl className="grid grid-cols-1 gap-4 rounded-lg border border-line bg-mineral/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryItem label="Classification" value={classificationLabel} />
                  <SummaryItem label="Category" value={categoryLabel} />
                  <SummaryItem label="Budget Range" value={budgetLabel} />
                  <SummaryItem label="Target Delivery Date" value={form.targetDeliveryDate} mono />
                </dl>

                <div>
                  <h3 className="font-display text-sm font-semibold text-alloy">Project Title</h3>
                  <p className="mt-1 text-sm text-alloy">{form.title}</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-alloy">
                      Detailed Requirements
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted sm:text-sm">
                      {form.requirements}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-alloy">
                      Expected Functionality
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted sm:text-sm">
                      {form.expectedFunctionality}
                    </p>
                  </div>
                </div>

                {(form.techStack.trim() ||
                  form.academicContext.trim() ||
                  (form.classification !== "software" && form.hardwareSpecs.trim())) && (
                  <div className="grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-2">
                    {form.techStack.trim() && (
                      <SummaryItem label="Preferred Technologies" value={form.techStack} />
                    )}
                    {form.academicContext.trim() && (
                      <SummaryItem
                        label="Academic / Research Context"
                        value={form.academicContext}
                      />
                    )}
                    {form.classification !== "software" && form.hardwareSpecs.trim() && (
                      <div className="sm:col-span-2">
                        <SummaryItem label="Hardware Specifications" value={form.hardwareSpecs} />
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-line pt-5">
                  <h3 className="font-display text-sm font-semibold text-alloy">
                    Requested Deliverables ({activeSelectedDeliverables.length})
                  </h3>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {deliverableOptions
                      .filter((d) => activeSelectedDeliverables.includes(d.id))
                      .map((d) => (
                        <li
                          key={d.id}
                          className="rounded-md border border-line bg-mineral px-3 py-1 text-xs font-medium text-alloy"
                        >
                          {d.label}
                        </li>
                      ))}
                  </ul>
                </div>

                {attachments.length > 0 && (
                  <div className="border-t border-line pt-5">
                    <h3 className="font-display text-sm font-semibold text-alloy">
                      Staged Reference Files ({attachments.length})
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted">
                      {attachments.map((file) => (
                        <li key={file.id} className="font-mono">
                          {file.name} ({formatFileSize(file.sizeBytes)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-line pt-5">
                  <h3 className="font-display text-sm font-semibold text-alloy">
                    Contact &amp; Account Details
                  </h3>
                  <dl className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <SummaryItem label="Name" value={form.contactName} />
                    <SummaryItem label="Email" value={form.contactEmail} />
                    <SummaryItem label="Phone" value={form.contactPhone} mono />
                    {form.institution.trim() && (
                      <SummaryItem label="Institution" value={form.institution} />
                    )}
                    {form.accountReference.trim() && (
                      <SummaryItem label="Account Reference" value={form.accountReference} />
                    )}
                  </dl>
                </div>

                {customer.status === "signed-in" && (
                  <section className="rounded-md border border-line bg-white p-5">
                    <h3 className="font-display text-lg font-semibold">Submit to your workspace</h3>
                    <p className="mt-2 max-w-prose text-sm text-muted">
                      Send the project requirements, budget, delivery date and selected deliverables
                      for review. Contact form details and reference files stay in this browser.
                    </p>
                    <Button
                      variant="ink"
                      disabled={sending}
                      className="mt-3"
                      onClick={() => void submitToWorkspace()}
                    >
                      {sending ? "Submitting…" : "Submit engineering brief"}
                    </Button>
                    {sendError && (
                      <p role="alert" className="form-error">
                        {sendError}
                      </p>
                    )}
                  </section>
                )}
                <div className="rounded-lg border border-volt-action/30 bg-volt-tint/60 p-4 text-xs leading-relaxed text-alloy">
                  <p className="font-display font-semibold text-volt-text">
                    Local specification export
                  </p>
                  <p className="mt-1">
                    Confirming below completes this interactive frontend requisition preview and
                    prepares an exportable specification file. This local export includes your
                    contact details. It does not submit the brief or upload files.
                  </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" size="lg" onClick={handleBackToEdit}>
                    Back to Edit
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleConfirmPrototype}
                  >
                    Prepare local export
                    <Check aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "submitted" && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-volt-tint text-volt-text">
                <FileText aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              </div>

              <span className="mt-4 block font-mono text-xs font-medium text-volt-text">
                Frontend prototype confirmation · Not sent to server
              </span>
              <h2
                ref={submittedHeadingRef}
                tabIndex={-1}
                className="mt-1.5 font-display text-2xl font-semibold text-alloy outline-none"
              >
                Requisition Specification Prepared
              </h2>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                Your custom engineering specification for{" "}
                <strong className="font-medium text-alloy">{form.title}</strong> passed all
                validation. You can download the specification and contact details as a file. This
                export stays on your device.
              </p>

              <dl className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-line bg-mineral/40 p-4 text-xs sm:grid-cols-2">
                <SummaryItem label="Classification" value={classificationLabel} />
                <SummaryItem label="Category" value={categoryLabel} />
                <SummaryItem label="Budget Range" value={budgetLabel} />
                <SummaryItem label="Target Delivery Date" value={form.targetDeliveryDate} mono />
                <SummaryItem label="Contact Email" value={form.contactEmail} />
                <SummaryItem
                  label="Deliverables"
                  value={`${activeSelectedDeliverables.length} selected`}
                  mono
                />
              </dl>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="primary" size="lg" onClick={handleDownloadJson}>
                  <Download aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  Download Specification (.json)
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={handleClearDraft}>
                  Prepare Another Request
                </Button>
              </div>

              <div className="mt-6 border-t border-line pt-5 text-xs text-muted">
                <a href={to("/projects")} className="font-medium text-volt-text hover:underline">
                  Return to Project Catalog
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function SectionCard({
  code,
  title,
  description,
  children,
}: {
  code: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-sm bg-mineral px-1.5 font-mono text-xs font-medium text-muted tabular-nums">
            {code}
          </span>
          <h2 className="font-display text-base font-semibold text-alloy sm:text-lg">{title}</h2>
        </div>
        <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-alloy">
      {children}
      {required && <span className="ml-0.5 text-volt-text">*</span>}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-red-700">
      {children}
    </p>
  );
}

function DeliverableCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-colors duration-150",
        checked
          ? "border-volt-action/50 bg-volt-tint/40 text-alloy"
          : "border-line bg-white text-alloy hover:bg-mineral/40",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded-xs accent-volt-action"
      />
      <span className="font-medium leading-snug">{label}</span>
    </label>
  );
}

function SummaryItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[0.6875rem] text-muted">{label}</dt>
      <dd className={cn("mt-0.5 text-xs font-medium text-alloy", mono && "font-mono tabular-nums")}>
        {value}
      </dd>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "mt-1.5 h-11 w-full rounded-lg border bg-mineral/20 px-3.5 font-sans text-sm text-alloy placeholder:text-muted/80 transition-colors duration-150 focus:bg-white focus:outline-none",
    hasError
      ? "border-red-400 focus:border-red-600"
      : "border-line hover:border-alloy/30 focus:border-volt-action",
  );
}

function textareaClass(hasError: boolean) {
  return cn(
    "mt-1.5 w-full rounded-lg border bg-mineral/20 px-3.5 py-2.5 font-sans text-sm text-alloy placeholder:text-muted/80 transition-colors duration-150 focus:bg-white focus:outline-none",
    hasError
      ? "border-red-400 focus:border-red-600"
      : "border-line hover:border-alloy/30 focus:border-volt-action",
  );
}
