"use client";

import {
  ArrowRight,
  Braces,
  CheckCircle2,
  Database,
  Download,
  Eraser,
  Layers3,
  LoaderCircle,
  Play,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { detectType, type FieldType } from "./lib/detectType";
import { generateJson } from "./lib/generateJson";
import { generatePrisma } from "./lib/generatePrisma";
import { generateTs } from "./lib/generateTs";
import CopyButton from "./ui/copy-button";

const sampleFields = [
  "id",
  "name",
  "email",
  "age",
  "isActive",
  "createdAt",
  "address.city",
  "users[].email",
].join("\n");

const badges = ["Generate JSON", "TypeScript", "Prisma", "Mongoose", "Mock Data"];

const fieldExamples = [
  ["name", "realistic person name"],
  ["email", "valid email address"],
  ["createdAt", "ISO date string"],
  ["isActive", "boolean value"],
  ["address.city", "nested city field"],
  ["users[].email", "array of user emails"],
];

const features = [
  {
    icon: Braces,
    title: "Structured JSON",
    description: "Generate deterministic, realistic records with nested objects and arrays.",
  },
  {
    icon: Layers3,
    title: "Live code previews",
    description: "TypeScript, Prisma, and Mongoose snippets update as fields change.",
  },
  {
    icon: Database,
    title: "Schema-friendly",
    description: "Start API mocks, database models, and frontend contracts in seconds.",
  },
];

type OutputTabId = "json" | "typescript" | "prisma" | "mongoose" | "mock";

type OutputTab = {
  id: OutputTabId;
  label: string;
  eyebrow: string;
  description: string;
  language: string;
  text: string;
  empty: string;
};

export default function Home() {
  const [fields, setFields] = useState("");
  const [count, setCount] = useState("3");
  const [json, setJson] = useState("");
  const [activeTab, setActiveTab] = useState<OutputTabId>("json");
  const [isGenerating, setIsGenerating] = useState(false);

  const fieldArray = useMemo(
    () =>
      fields
        .split("\n")
        .map((field) => field.trim())
        .filter(Boolean),
    [fields]
  );

  const normalizedCount = normalizeRecordCount(count);
  const tsOutput = useMemo(() => generateTs(fieldArray), [fieldArray]);
  const prismaOutput = useMemo(() => generatePrisma(fieldArray), [fieldArray]);
  const mongooseOutput = useMemo(() => generateMongoose(fieldArray), [fieldArray]);

  const outputs: OutputTab[] = [
    {
      id: "json",
      label: "JSON",
      eyebrow: "Mock response",
      description: "A formatted API-ready JSON payload generated from your fields.",
      language: "json",
      text: json,
      empty: "Add fields and click Generate to preview formatted JSON.",
    },
    {
      id: "typescript",
      label: "TypeScript",
      eyebrow: "Frontend contract",
      description: "A lightweight interface that updates as your field list changes.",
      language: "ts",
      text: fieldArray.length > 0 ? tsOutput : "",
      empty: "Add fields to preview a TypeScript interface.",
    },
    {
      id: "prisma",
      label: "Prisma",
      eyebrow: "Database model",
      description: "A starter Prisma model for learning schema design.",
      language: "prisma",
      text: fieldArray.length > 0 ? prismaOutput : "",
      empty: "Add fields to preview a Prisma model.",
    },
    {
      id: "mongoose",
      label: "Mongoose",
      eyebrow: "MongoDB schema",
      description: "A practical Mongoose schema derived from the same field list.",
      language: "ts",
      text: fieldArray.length > 0 ? mongooseOutput : "",
      empty: "Add fields to preview a Mongoose schema.",
    },
    {
      id: "mock",
      label: "Mock Data",
      eyebrow: "Faker dataset",
      description: "The generated Faker-backed dataset, ready to paste into tests or demos.",
      language: "json",
      text: json,
      empty: "Generate JSON first to view mock data.",
    },
  ];

  const activeOutput = outputs.find((output) => output.id === activeTab) ?? outputs[0];
  const hasFields = fieldArray.length > 0;

  const handleGenerate = async () => {
    if (!hasFields || isGenerating) return;

    setIsGenerating(true);

    await Promise.resolve();

    setJson(generateJson(fieldArray, normalizedCount));
    setActiveTab("json");
    setIsGenerating(false);
  };

  const handleUseExample = () => {
    setFields(sampleFields);
    setJson("");
    setActiveTab("typescript");
  };

  const handleClear = () => {
    setFields("");
    setJson("");
    setCount("3");
    setActiveTab("json");
  };

  const handleDownload = () => {
    if (!activeOutput.text.trim()) return;

    const blob = new Blob([activeOutput.text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `smart-json-generator-${activeOutput.id}.${getFileExtension(activeOutput)}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090B] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.28),transparent_30rem),radial-gradient(circle_at_80%_15%,rgba(14,165,233,0.18),transparent_26rem),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.14),transparent_32rem)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl border border-indigo-300/20 bg-indigo-400/10 text-indigo-200 shadow-lg shadow-indigo-950/40">
              <Braces size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Smart JSON Generator</p>
              <p className="text-xs text-slate-500">Schema & mock data studio</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseExample}
            className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-indigo-300/50 hover:bg-indigo-400/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:inline-flex"
          >
            Try example
          </button>
        </nav>

        <section className="grid gap-8 py-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:py-10">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 shadow-sm backdrop-blur"
                >
                  {badge}
                </span>
              ))}
            </div>

            <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-indigo-200">
              <Sparkles size={16} className="text-cyan-300" />
              AI-ready developer data
            </p>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Generate JSON, schemas, and mock data{" "}
              <span className="bg-gradient-to-r from-cyan-200 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                within seconds.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Turn a simple field list into realistic JSON records, TypeScript
              interfaces, Prisma models, and Mongoose schemas. Built for fast API
              prototypes, frontend demos, and learning-friendly data modeling.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!hasFields || isGenerating}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-indigo-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:shadow-indigo-900/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                {isGenerating ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                {isGenerating ? "Generating..." : "Generate mock data"}
              </button>

              <button
                type="button"
                onClick={handleUseExample}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-semibold text-white transition hover:border-indigo-300/50 hover:bg-indigo-400/10 focus:outline-none focus:ring-4 focus:ring-indigo-300/20"
              >
                Load example
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111827]/80 p-5 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                  Field examples
                </h2>
                <p className="mt-2 text-sm text-slate-500">Use natural names. The app detects likely data types.</p>
              </div>
              <CheckCircle2 size={20} className="text-emerald-300" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {fieldExamples.map(([field, description]) => (
                <button
                  type="button"
                  key={field}
                  onClick={() => setFields((current) => appendField(current, field))}
                  className="group rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-left transition hover:-translate-y-0.5 hover:border-indigo-300/40 hover:bg-indigo-400/10 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <code className="font-mono text-sm text-cyan-200 group-hover:text-cyan-100">
                    {field}
                  </code>
                  <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">
                    {description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr] xl:grid-cols-[450px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-[#111827]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl xl:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Input panel
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Describe your data</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Add one field per line. Use dots for nested objects and brackets for arrays.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="fields" className="text-sm font-medium text-slate-200">
                  Fields
                </label>
                <span className="text-xs text-slate-500">{fieldArray.length} fields</span>
              </div>

              <textarea
                id="fields"
                value={fields}
                onChange={(event) => {
                  setFields(event.target.value);
                  setJson("");
                }}
                rows={13}
                className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
                placeholder={`name\nemail\nphone\nage\nisVerified\ncreatedAt\naddress.city\nusers[].email`}
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Tip: click an example above to append it, or use the full example to start fast.
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[145px_1fr] sm:items-end">
              <div>
                <label htmlFor="count" className="text-sm font-medium text-slate-200">
                  JSON records
                </label>
                <input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(event) => setCount(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
                  placeholder="3"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!hasFields || isGenerating}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                {isGenerating ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={16} />}
                {isGenerating ? "Generating" : "Generate"}
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleUseExample}
                className="rounded-2xl border border-indigo-300/25 bg-indigo-400/10 px-4 py-3 text-sm font-semibold text-indigo-100 transition hover:border-indigo-200/60 hover:bg-indigo-400/20 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Example
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={!fields && count === "3" && !json}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Eraser size={15} />
                Clear
              </button>
              <CopyButton text={fields} label="Copy input" copiedLabel="Copied" />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-400">
              <p>
                <span className="font-semibold text-slate-200">Syntax:</span> one field per line,
                nested fields like{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">address.city</code>{" "}
                and arrays like{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">users[].email</code>.
              </p>
            </div>
          </aside>

          <section className="min-w-0 rounded-3xl border border-white/10 bg-[#111827]/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="border-b border-white/10 p-4 sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    Output panel
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{activeOutput.label}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {activeOutput.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <CopyButton text={activeOutput.text} label={`Copy ${activeOutput.label}`} copiedLabel="Copied" />
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!activeOutput.text.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 p-1" role="tablist" aria-label="Generated output formats">
                <div className="flex min-w-max gap-1">
                  {outputs.map((output) => {
                    const isActive = output.id === activeTab;

                    return (
                      <button
                        key={output.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTab(output.id)}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                          isActive
                            ? "bg-white text-slate-950 shadow-lg shadow-black/20"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {output.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="min-h-0 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono uppercase tracking-[0.2em]">
                  {activeOutput.language}
                </span>
                <span>
                  {hasFields ? `${fieldArray.length} fields · ${normalizedCount} records` : "Waiting for input"}
                </span>
              </div>

              {activeOutput.text.trim() ? (
                <pre className="h-[620px] max-h-[65vh] overflow-auto rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-slate-100 shadow-inner shadow-black/40 sm:p-5">
                  <code>{activeOutput.text}</code>
                </pre>
              ) : (
                <div className="flex h-[620px] max-h-[65vh] min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
                      <Braces size={22} />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-300">{activeOutput.empty}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Your output will render here with copy and download actions when available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/[0.07]"
              >
                <div className="grid size-11 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </article>
            );
          })}
        </section>

        <footer aria-label="Site footer" className="border-t border-white/10 py-6 text-sm text-slate-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Built by <span className="font-semibold text-slate-300">Mt Dev</span>
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
              <p>Smart JSON Generator</p>
              <p className="text-slate-400">Premium developer tool UI</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function appendField(current: string, field: string) {
  const fields = current
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  if (fields.includes(field)) {
    return current;
  }

  return [...fields, field].join("\n");
}

function normalizeRecordCount(value: string) {
  const count = Number(value);

  if (!Number.isFinite(count)) {
    return 1;
  }

  return Math.min(100, Math.max(1, Math.floor(count)));
}

function getFileExtension(output: OutputTab) {
  if (output.language === "json") return "json";
  if (output.id === "prisma") return "prisma";

  return "ts";
}

function generateMongoose(fields: string[]) {
  const schema = fields.map((field) => `  ${toSchemaLine(field)}`).join(",\n");

  return `import { Schema, model, models } from "mongoose";\n\nconst dataSchema = new Schema({\n${schema}\n}, {\n  timestamps: true,\n});\n\nexport const Data = models.Data || model("Data", dataSchema);`;
}

function toSchemaLine(field: string): string {
  const parts = field.split(".").map((part) => part.trim()).filter(Boolean);
  const [firstPart, ...restParts] = parts;

  if (!firstPart) {
    return "unknown: Schema.Types.Mixed";
  }

  const fieldName = firstPart.replace(/\[\]$/g, "");
  const isArray = firstPart.endsWith("[]");

  if (restParts.length === 0) {
    const type = toMongooseType(detectType(fieldName));

    return `${fieldName}: ${isArray ? `[${type}]` : type}`;
  }

  const nestedField: string = toSchemaLine(restParts.join("."));
  const nestedValue: string = `{\n    ${nestedField}\n  }`;

  return `${fieldName}: ${isArray ? `[${nestedValue}]` : nestedValue}`;
}

function toMongooseType(type: FieldType) {
  switch (type) {
    case "number":
      return "Number";
    case "boolean":
      return "Boolean";
    case "date":
      return "Date";
    default:
      return "String";
  }
}
