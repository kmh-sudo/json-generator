"use client";

import { useState } from "react";
import { generateJson } from "./lib/generateJson";
import { generateTs } from "./lib/generateTs";
import { generatePrisma } from "./lib/generatePrisma";
import CopyButton from "./ui/copy-button";

export default function Home() {
  const [fields, setFields] = useState("");

  const fieldArray = fields
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

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

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">JSON</h2>

            <CopyButton text={generateJson(fieldArray)} />
          </div>

          <pre className="bg-gray-100 p-4 overflow-auto text-black">
            {generateJson(fieldArray)}
          </pre>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">TypeScript</h2>

            <CopyButton text={generateTs(fieldArray)} />
          </div>

          <pre className="bg-gray-100 p-4 overflow-auto text-black">
            {generateTs(fieldArray)}
          </pre>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Prisma</h2>

            <CopyButton text={generatePrisma(fieldArray)} />
          </div>

          <pre className="bg-gray-100 p-4 overflow-auto text-black">
            {generatePrisma(fieldArray)}
          </pre>
        </div>
      </div>
    </main>
  );
}
