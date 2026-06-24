# Smart JSON Generator

> Turn field names into production-ready mock data — JSON, TypeScript interfaces, and Prisma models from a simple field list.

---

## Quick Start (30 seconds)

```bash
# 1. Download or clone this project
# 2. Open a terminal in the project folder
# 3. Install dependencies
npm install -g pnpm   # only if you don't have pnpm yet
pnpm install

# 4. Start the dev server
pnpm dev
```

Open **http://localhost:3000** in your browser. You're ready to go.

---

## Step-by-Step Setup (for beginners)

This guide assumes you are new to programming or new to Next.js. Each step explains what you are doing and why.

### Step 1: Install Node.js

This project needs **Node.js 18 or newer** to run.

1. Go to https://nodejs.org/
2. Download the **LTS** version (the big green button)
3. Run the installer — just click "Next" through everything
4. **Verify it worked**: Open a terminal (Command Prompt on Windows, Terminal on Mac/Linux) and type:

```bash
node --version
```

You should see something like `v18.x.x` or `v20.x.x`. If you see a version number, you're good.

> **What is Node.js?** It's a program that lets you run JavaScript on your computer (not just in a browser). Next.js needs it to build and serve the website.

### Step 2: Install pnpm

pnpm is a package manager — it downloads and manages the code libraries this project depends on.

Open a terminal and run:

```bash
npm install -g pnpm
```

This uses `npm` (which came with Node.js) to install `pnpm` globally on your machine.

**Verify it worked:**

```bash
pnpm --version
```

You should see a version number like `9.x.x` or `10.x.x`.

> **Why pnpm instead of npm?** pnpm is faster and saves disk space. The project already has a `pnpm-lock.yaml` file, so pnpm is the expected package manager.

### Step 3: Get the project code

You have two options:

**Option A — Download ZIP (easier for beginners):**
1. Go to the GitHub page of this project
2. Click the green **Code** button
3. Click **Download ZIP**
4. Unzip the file to a folder on your computer

**Option B — Clone with Git (if you have Git installed):**

```bash
git clone <repository-url>
cd json-generator
```

### Step 4: Open a terminal in the project folder

**Mac/Linux:** Right-click inside the project folder and select "Open Terminal here" (or use `cd` to navigate to it).

**Windows:** Type `cmd` in the folder address bar and press Enter.

Make sure you are inside the `json-generator` folder (you should see files like `package.json` and `README.md` when you type `ls` or `dir`).

### Step 5: Install dependencies

In the terminal, run:

```bash
pnpm install
```

This will download all the libraries the project needs. You'll see a `node_modules` folder appear — that's where the downloaded code lives.

> **What are dependencies?** This project relies on several libraries like React, Faker.js (for fake data), and Tailwind CSS (for styling). The `pnpm install` command downloads all of them automatically.

### Step 6: Start the development server

```bash
pnpm dev
```

After a few seconds, you'll see something like:

```
▲ Next.js 16.2.9
- Local: http://localhost:3000
```

**Do not close this terminal** — leave it running. The development server will automatically update the page when you make changes to the code.

### Step 7: Open the app

Open your web browser and go to **http://localhost:3000**.

You should see the **Smart JSON Generator** page — a dark-themed page with a textarea on the left, an example fields panel, and three output cards (JSON, TypeScript, Prisma).

> **Trouble?** If you see an error page, check the terminal for error messages. See the [Troubleshooting](#troubleshooting) section below.

---

## How to Use the App

### 1. Enter field names

In the textarea on the left, type one field name per line:

```
name
email
age
isActive
createdAt
address.city
users[].email
```

**Rules:**
- One field name per line
- Use dots (`.`) for nested data: `address.city` becomes `{"address": {"city": "..."}}`
- Use `[]` for arrays: `users[].email` becomes `{"users": [{"email": "..."}, ...]}`
- Field names are case-insensitive for type detection but keep their original case in output

### 2. Set the record count

Enter how many JSON records you want to generate (1–100). Try `3` to start.

### 3. Click "Generate mock data"

The JSON output card will fill with realistic data like this:

```json
[
  {
    "name": "Randal Jacobs",
    "email": "Dillon.Kautzer@yahoo.com",
    "age": 41,
    "isActive": false,
    "createdAt": "2025-10-28T22:08:12.445Z",
    "address": {
      "city": "East Carmelina"
    },
    "users": [
      { "email": "Angeline_Sauer94@gmail.com" },
      { "email": "Laverne.Hoeger@hotmail.com" },
      { "email": "Genevieve47@gmail.com" }
    ]
  }
]
```

### 4. Copy output

Click the **Copy** button on any output card to copy its contents to your clipboard.

> **Tip:** The TypeScript and Prisma outputs update automatically as you type — no "Generate" click needed! Only JSON requires the button because it does more work behind the scenes.

### 5. Try the example

Click the **"Use example"** button to quickly fill the textarea with sample fields and see what the app can do.

---

## Troubleshooting

| Problem | Likely cause | Solution |
|---|---|---|
| `node: command not found` | Node.js is not installed | Install Node.js from https://nodejs.org/ (LTS version) |
| `pnpm: command not found` | pnpm is not installed | Run `npm install -g pnpm` |
| `Error: Port 3000 is already in use` | Another program is using port 3000 | Close the other program, or run `pnpm dev --port 3001` |
| `Module not found: Can't resolve '...'` | Dependencies not installed | Run `pnpm install` |
| The page shows errors instead of the app | Something went wrong during startup | Check the terminal for error messages. Try stopping the server (Ctrl+C) and running `pnpm dev` again |
| Text looks weird or unstyled | Tailwind CSS didn't load | Make sure `pnpm install` completed without errors. Try `pnpm dev` again |

---

## Build for Production

When you're ready to deploy the app, build it for production:

```bash
pnpm build
```

This creates an optimized version of the app in the `.next` folder. To run it:

```bash
pnpm start
```

### Run validation checks

```bash
pnpm lint                # Check code style and catch common mistakes
pnpm exec tsc --noEmit   # Check TypeScript types (no bugs from wrong types)
pnpm build               # Make sure the app builds successfully
```

---

## Project Structure

Once you're comfortable using the app, here is how the code is organized:

```
json-generator/
├── app/
│   ├── page.tsx              # Main page — the UI you see in the browser
│   ├── layout.tsx            # Page wrapper — fonts, title, basic HTML setup
│   ├── globals.css           # Styling — dark theme + Tailwind CSS setup
│   ├── lib/
│   │   ├── detectType.ts     # Reads field names, decides if it's text/number/boolean/date
│   │   ├── generateJson.ts   # Core engine — creates fake JSON data using Faker.js
│   │   ├── generateTs.ts     # Creates TypeScript interfaces from field names
│   │   └── generatePrisma.ts # Creates Prisma database models from field names
│   └── ui/
│       └── copy-button.tsx   # The "Copy" button with checkmark feedback
├── public/                   # Icons and images (favicon, SVG files)
├── package.json              # Project info and list of dependencies
├── tsconfig.json             # TypeScript settings
├── next.config.ts            # Next.js settings
├── eslint.config.mjs         # Code quality rules
└── postcss.config.mjs        # CSS processing setup (Tailwind plugin)
```

### Key files explained simply

| File | What it does |
|---|---|
| `app/page.tsx` | The whole UI — textarea, input box, buttons, and three output cards. This is the main file to edit if you want to change the app's look or behavior. |
| `app/lib/detectType.ts` | Looks at a word like "age" or "isActive" and decides if it should generate a number, boolean, date, or text. |
| `app/lib/generateJson.ts` | The brain of the app. It takes field names and a count, then uses Faker.js to create realistic fake data with the right structure (nested objects, arrays, etc.). |
| `app/lib/generateTs.ts` | Converts field names into a TypeScript interface definition. |
| `app/lib/generatePrisma.ts` | Converts field names into a Prisma database model definition. |
| `app/ui/copy-button.tsx` | A small button that copies text to your clipboard and shows a checkmark for 2 seconds. |

---

## Architecture & How It Works

```
You type fields → TypeScript + Prisma previews update automatically
         ↓
You click "Generate"
         ↓
Your field text gets split into separate lines
         ↓
Each line becomes a field name (trimmed, empty lines removed)
         ↓
generateJson() creates the requested number of records
         ↓
  For each record:
    → For each field name:
      → detectType() decides the data type
      → Faker.js generates a realistic value
      → Dots create nested objects (address.city)
      → [] creates arrays (users[].email)
         ↓
The JSON appears in the output card
```

### Why are TypeScript and Prisma instant but JSON needs a click?

- **TypeScript and Prisma** — These just convert text to different formats. They run instantly every time you type, so they update live.
- **JSON** — This calls Faker.js to generate realistic data for every field, every record. With 100 records and 20 fields, that's 2000 values. It only runs when you click "Generate" to keep the page responsive.

---

## Tech Stack

| Technology | Version | What it does |
|---|---|---|
| **Next.js** | 16 | The framework that powers the whole app — handles routing, building, and serving |
| **React** | 19 | The UI library — lets us build interactive components with JavaScript |
| **TypeScript** | 5 | JavaScript with extra rules to catch mistakes before they cause bugs |
| **Tailwind CSS** | 4 | A styling system — instead of writing custom CSS, you add small class names to HTML elements (note: v4 uses CSS-based config, not the old `tailwind.config.js`) |
| **Faker.js** | 10 | Generates realistic fake data — names, emails, addresses, phone numbers |
| **Lucide React** | 1 | Icon library (used for the Copy/Check icons) |
| **pnpm** | — | Fast package manager that downloads and manages dependencies |

---

## Features

- **Smart type detection** — Type `age` → it knows to generate a number. Type `isActive` → it generates true/false. Type `createdAt` → it generates a date.
- **Nested objects** — `address.city` becomes `{"address": {"city": "..."}}`
- **Arrays** — `users[].email` creates an array of objects with emails
- **Live TypeScript + Prisma** — Interfaces and models update as you type
- **Deterministic output** — Same field names + same count = same results every time
- **One-click copy** — Copy any output with one button click
- **Dark theme** — Easy on the eyes, premium look

---

