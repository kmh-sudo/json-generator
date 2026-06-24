"use client";

import { useState } from "react";
import { generateJson } from "./lib/generateJson";
import { generateTs } from "./lib/generateTs";
import { generatePrisma } from "./lib/generatePrisma";
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
  ["name", "realistic person name"],
  ["email", "valid email address"],
  ["createdAt", "ISO date string"],
  ["isActive", "boolean value"],
  ["address.city", "nested city field"],
  ["users[].email", "array of user emails"],
];

export default function Home() {
  const [fields, setFields] = useState("");
  const [count, setCount] = useState("3");
  const [json, setJson] = useState("");

  const fieldArray = fields
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
  const tsOutput = generateTs(fieldArray);
  const prismaOutput = generatePrisma(fieldArray);

  const handleGenerate = () => {
    setJson(generateJson(fieldArray, Number(count)));
  };

  const handleUseExample = () => {
    setFields(sampleFields);
    setJson("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32rem),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_28rem),linear-gradient(180deg,_rgba(15,23,42,0)_0%,_#020617_78%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {["FakerJS data", "TypeScript", "Prisma", "Mock APIs"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 shadow-sm backdrop-blur"
                  >
                    {badge}
                  </span>
                )
              )}
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Smart schema & mock data generator
            </p>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Turn field names into production-ready mock data.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Generate realistic JSON records, TypeScript interfaces, and Prisma
              models from a simple field list. Perfect for learning APIs,
              prototyping database models, and testing frontend screens.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              Field examples
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {fieldExamples.map(([field, description]) => (
                <div
                  key={field}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-3"
                >
                  <code className="font-mono text-sm text-cyan-200">
                    {field}
                  </code>
                  <p className="mt-1 text-xs text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-slate-950/50 backdrop-blur xl:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Workbench
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Describe your data
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Add one field per line. Use dots for nested objects and
                  brackets for arrays.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseExample}
                className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                Use example
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="fields"
                className="text-sm font-medium text-slate-200"
              >
                Fields
              </label>

              <textarea
                id="fields"
                value={fields}
                onChange={(e) => setFields(e.target.value)}
                rows={12}
                className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
                placeholder={`name\nemail\nphone\nage\nisVerified\ncreatedAt\naddress.city\nusers[].email`}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[140px_1fr] sm:items-end">
              <div>
                <label
                  htmlFor="count"
                  className="text-sm font-medium text-slate-200"
                >
                  JSON records
                </label>
                <input
                  id="count"
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
                  placeholder="3"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!fields.trim()}
                className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                Generate mock data
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-400">
              <p>
                <span className="font-semibold text-slate-200">Syntax:</span>{" "}
                one field per line, nested fields like{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">
                  address.city
                </code>{" "}
                and arrays like{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">
                  users[].email
                </code>
                .
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <OutputCard
              title="JSON"
              eyebrow="Mock response"
              description="Generated only when you click the button, so display and copy always match."
              text={json}
              empty="Your generated JSON will appear here after you add fields and click Generate."
              className="xl:col-span-2"
            />

            <OutputCard
              title="TypeScript"
              eyebrow="Frontend contract"
              description="A lightweight interface that updates from your field list."
              text={tsOutput}
              empty="Add fields to preview a TypeScript interface."
            />

            <OutputCard
              title="Prisma"
              eyebrow="Database model"
              description="A starter Prisma model for learning schema design."
              text={prismaOutput}
              empty="Add fields to preview a Prisma model."
            />
          </div>
        </section>

        <footer
          aria-label="Site footer"
          className="border-t border-white/10 py-6 text-sm text-slate-500"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Built by{" "}
              <span className="font-semibold text-slate-300">Mt Dev</span>
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
              <p>Smart JSON Generator</p>
              <p className="text-slate-400">June 24, 2026</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function OutputCard({
  title,
  eyebrow,
  description,
  text,
  empty,
  className = "",
}: {
  title: string;
  eyebrow: string;
  description: string;
  text: string;
  empty: string;
  className?: string;
}) {
  const hasOutput = text.trim().length > 0;

  return (
    <article
      className={`flex min-h-[360px] flex-col rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-950/40 backdrop-blur ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <CopyButton text={text} />
      </div>

      <div className="min-h-0 flex-1 p-4">
        {hasOutput ? (
          <pre className="h-full max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-slate-100 shadow-inner shadow-black/30">
            <code>{text}</code>
          </pre>
        ) : (
          <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-center text-sm leading-6 text-slate-500">
            {empty}
          </div>
        )}
      </div>
    </article>
  );
}
