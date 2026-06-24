"use client";

import { useState } from "react";
import { generateJson } from "./lib/generateJson";
import { generateTs } from "./lib/generateTs";
import { generatePrisma } from "./lib/generatePrisma";
import CopyButton from "./ui/copy-button";

export default function Home() {
  const [fields, setFields] = useState("");
  const [count, setCount] = useState("10");
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

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">Smart JSON Generator</h1>

      <textarea
        value={fields}
        onChange={(e) => setFields(e.target.value)}
        rows={10}
        className="border w-full p-4"
        placeholder={`name
email
phone
age
isVerified
createdAt`}
      />

      <div className="mt-4 flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="border p-2 w-32"
          placeholder="Count"
        />

        <button
          onClick={handleGenerate}
          disabled={!fields.trim()}
          className="bg-black disabled:opacity-50 text-white px-4 py-2 rounded"
        >
          Generate
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">JSON</h2>

            <CopyButton text={json} />
          </div>

          <pre className="bg-gray-100 p-4 overflow-auto text-black">
            {json}
          </pre>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">TypeScript</h2>

            <CopyButton text={tsOutput} />
          </div>

          <pre className="bg-gray-100 p-4 overflow-auto text-black">
            {tsOutput}
          </pre>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Prisma</h2>

            <CopyButton text={prismaOutput} />
          </div>

          <pre className="bg-gray-100 p-4 overflow-auto text-black">
            {prismaOutput}
          </pre>
        </div>
      </div>
    </main>
  );
}
