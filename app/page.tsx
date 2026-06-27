"use client";

import {
  Braces,
  ChevronDown,
  Circle,
  Download,
  Eraser,
  LoaderCircle,
  Maximize2,
  Play,
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

const fieldExamples = [
  ["name", "Person name"],
  ["email", "Email address"],
  ["createdAt", "ISO timestamp"],
  ["isActive", "Boolean flag"],
  ["address.city", "Nested object"],
  ["users[].email", "Array field"],
];

const metrics = [
  ["10k+", "workflows analyzed"],
  ["99.9%", "platform uptime"],
  ["4.8x", "faster resolution"],
  ["24/7", "monitoring loop"],
];

const pipelineSteps = ["Parse", "Infer", "Generate", "Export"];

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
      description: "Formatted API-ready JSON payload generated from your field list.",
      language: "json",
      text: json,
      empty: "Add fields and run Generate to preview formatted JSON.",
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
      description: "A starter Prisma model mapped from the same detected schema.",
      language: "prisma",
      text: fieldArray.length > 0 ? prismaOutput : "",
      empty: "Add fields to preview a Prisma model.",
    },
    {
      id: "mongoose",
      label: "Mongoose",
      eyebrow: "MongoDB schema",
      description: "A practical Mongoose schema derived from the field list.",
      language: "ts",
      text: fieldArray.length > 0 ? mongooseOutput : "",
      empty: "Add fields to preview a Mongoose schema.",
    },
    {
      id: "mock",
      label: "Mock Data",
      eyebrow: "Faker dataset",
      description: "The generated Faker-backed dataset, ready for tests or demos.",
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
    <main className="min-h-screen overflow-x-hidden bg-white text-[#09090b]">
      <header className="sticky top-0 z-40 border-b border-[#e4e4e7] bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Global navigation">
          <a href="#top" className="flex items-center gap-3" aria-label="SchemaForge home">
            <span className="grid size-9 place-items-center rounded-xl bg-black text-white">
              <Braces size={18} />
            </span>
            <span className="text-sm font-semibold tracking-tight">Json Generator</span>
          </a>
         

          <div className="flex items-center gap-3">
           
            <button type="button" onClick={handleUseExample} className="button-primary rounded-full px-4 py-2 text-sm font-medium">
              Request Demo
            </button>
          </div>
        </nav>
      </header>

     



      <section id="demo" className="border-y border-[#e4e4e7] bg-[#fafafa]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="terminal-text text-xs font-medium uppercase tracking-[0.18em] text-[#71717a]">Live product workspace</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-light tracking-[-0.055em] text-[#09090b] sm:text-5xl">
                Debug any problem before it reaches your API contract.
              </h2>
            </div>
           
          </div>

          <div className="grid gap-6 lg:grid-cols-[420px_1fr] xl:grid-cols-[450px_1fr]">
            <aside className="rounded-[28px] border border-[#e4e4e7] bg-white p-5 shadow-sm xl:p-6">
              <div>
                <p className="terminal-text text-xs font-medium uppercase tracking-[0.18em] text-[#71717a]">Input schema</p>
                <h3 className="mt-2 text-2xl font-light tracking-[-0.04em] text-[#09090b]">Describe your data</h3>
                <p className="mt-2 text-sm leading-6 text-[#71717a]">
                  Add one field per line. Use dots for nested objects and brackets for arrays.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {fieldExamples.map(([field, description]) => (
                  <button
                    type="button"
                    key={field}
                    onClick={() => setFields((current) => appendField(current, field))}
                    className="rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-3 text-left transition hover:border-[#a1a1aa] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#18181b]"
                  >
                    <code className="terminal-text text-sm text-[#09090b]">{field}</code>
                    <p className="mt-1 text-xs text-[#71717a]">{description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="fields" className="text-sm font-medium text-[#09090b]">Fields</label>
                  <span className="text-xs text-[#71717a]">{fieldArray.length} fields</span>
                </div>

                <textarea
                  id="fields"
                  value={fields}
                  onChange={(event) => {
                    setFields(event.target.value);
                    setJson("");
                  }}
                  rows={12}
                  className="terminal-text mt-2 w-full resize-y rounded-3xl border border-[#e4e4e7] bg-[#fafafa] p-4 text-sm leading-6 text-[#09090b] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:bg-white focus:ring-2 focus:ring-[#18181b]/10"
                  placeholder={`name\nemail\nphone\nage\nisVerified\ncreatedAt\naddress.city\nusers[].email`}
                />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[145px_1fr] sm:items-end">
                <div>
                  <label htmlFor="count" className="text-sm font-medium text-[#09090b]">Records</label>
                  <input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(event) => setCount(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#e4e4e7] bg-[#fafafa] px-4 py-3 text-sm text-[#09090b] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:bg-white focus:ring-2 focus:ring-[#18181b]/10"
                    placeholder="3"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!hasFields || isGenerating}
                  className="button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:bg-[#d4d4d8] bg-black text-white"
                >
                  {isGenerating ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={16} />}
                  {isGenerating ? "Generating" : "Generate"}
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button type="button" onClick={handleUseExample} className="button-secondary rounded-full px-4 py-3 text-sm font-medium">
                  Example
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!fields && count === "3" && !json}
                  className="button-secondary inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Eraser size={15} />
                  Clear
                </button>
                <CopyButton text={fields} label="input" copiedLabel="Copied" />
              </div>
            </aside>

            <section className="min-w-0 overflow-hidden rounded-[28px] border border-[#e4e4e7] bg-white shadow-sm">
              <div className="border-b border-[#e4e4e7] p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <p className="terminal-text text-xs font-medium uppercase tracking-[0.18em] text-[#71717a]">
                      Generated output · {activeOutput.eyebrow}
                    </p>
                    <h3 className="mt-2 text-2xl font-light tracking-[-0.04em] text-[#09090b]">{activeOutput.label}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71717a]">{activeOutput.description}</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <CopyButton text={activeOutput.text} label={` ${activeOutput.label}`} copiedLabel="Copied" />
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={!activeOutput.text.trim()}
                      className="button-secondary inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-full border border-[#e4e4e7] bg-[#fafafa] p-1" role="tablist" aria-label="Generated output formats">
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
                          className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#18181b] ${
                            isActive
                              ? "bg-black text-white"
                              : "text-[#71717a] hover:bg-white hover:text-[#09090b]"
                          }`}
                        >
                          {output.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#71717a]">
                  <span className="terminal-text rounded-full border border-[#e4e4e7] bg-[#fafafa] px-3 py-1 uppercase tracking-[0.16em]">
                    {activeOutput.language}
                  </span>
                  <span>{hasFields ? `${fieldArray.length} fields · ${normalizedCount} records` : "Waiting for input"}</span>
                </div>

                {activeOutput.text.trim() ? (
                  <pre className="terminal-text h-[540px] max-h-[65vh] overflow-auto rounded-3xl border border-[#e4e4e7] bg-[#fafafa] p-4 text-sm leading-6 text-[#18181b] sm:p-5">
                    <code>{activeOutput.text}</code>
                  </pre>
                ) : (
                  <div className="flex h-[540px] max-h-[65vh] min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-[#d4d4d8] bg-[#fafafa] p-6 text-center">
                    <div className="max-w-sm">
                      <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-[#e4e4e7] bg-white text-[#71717a]">
                        <Braces size={22} />
                      </div>
                      <p className="mt-4 text-sm font-medium text-[#09090b]">{activeOutput.empty}</p>
                      <p className="mt-2 text-xs leading-5 text-[#71717a]">
                        Output renders here with copy and download actions when available.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="terminal-text text-xs font-medium uppercase tracking-[0.18em] text-[#8b0000]">Interactive tools</p>
          <h2 className="mt-5 max-w-xl text-4xl font-light tracking-[-0.055em] text-[#09090b] sm:text-5xl lg:text-6xl">
            Debug any problem with a clearer operational surface.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#71717a]">
            Inspect generated payload shape, preview typed contracts, and scan schema assumptions without leaving the product workspace.
          </p>
         
        </div>

        <div className="relative min-h-[420px] rounded-[28px] border border-[#e4e4e7] bg-[#fafafa] p-5 shadow-sm">
          <div className="h-full rounded-[24px] border border-[#e4e4e7] bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {pipelineSteps.map((step, index) => (
                <article key={step} className="rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-4">
                  <p className="terminal-text text-xs text-[#71717a]">0{index + 1}</p>
                  <p className="mt-8 text-sm font-medium text-[#09090b]">{step}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 rounded-[22px] border border-[#e4e4e7] bg-[#fafafa] p-4">
              <div className="flex items-center justify-between text-xs text-[#71717a]">
                <span>Schema timeline</span>
                <span>{hasFields ? "Active" : "Idle"}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e4e4e7]">
                {hasFields ? <div className="processing-bar h-full rounded-full bg-[#008b00]" /> : <div className="processing-bar h-full rounded-full bg-[#8b0000]" />}
               
              </div>
            </div>
          </div>

        
        </div>
      </section>

      <footer className="border-t border-[#e4e4e7] bg-white" aria-label="Site footer">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#71717a] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Built by <span className="font-medium text-[#09090b]">Mt Dev</span></p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#platform" className="hover:text-[#09090b]">Platform</a>
            <a href="#demo" className="hover:text-[#09090b]">Product demo</a>
            <a href="#tools" className="hover:text-[#09090b]">Tools</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function LogoCell({ name }: { name: string }) {
  return (
    <article className="flex min-h-28 items-center justify-center border-b border-[#e4e4e7] p-6 md:border-b-0 md:border-r">
      <svg width="120" height="32" viewBox="0 0 120 32" fill="none" role="img" aria-label={`${name} logo`}>
        <rect x="1" y="7" width="18" height="18" rx="5" fill="#09090B" />
        <path d="M7 16H13M10 13V19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <text x="28" y="21" fill="#18181B" fontFamily="Inter, Geist, Arial, sans-serif" fontSize="16" fontWeight="500">
          {name}
        </text>
      </svg>
    </article>
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
