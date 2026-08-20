# OBEYBOTS — AI Skills Interviewer & Talent Intelligence Engine

> **Talent intelligence, powered by structured interviews for the MattyJacks ecosystem.**

**OBEYBOTS** is a clean, static, local-first web application designed to interview candidates, discover their skillsets, analyze their answers, match them with relevant client roles and services, and deterministically generate production-ready Shopify Liquid storefront section code.

Built exclusively with standard **HTML5**, modern **CSS3**, and modular **Vanilla JavaScript**. Zero backend, zero external databases, and zero API keys required.

---

## 🌟 Key Features

1. **Adaptive Question Engine**:
   - Dynamically adapts the interview flow based on candidate-selected domain focus areas (Web Development, Shopify, AI, Research, Marketing, Creative, Operations).
   - Deep-dives into specific tools while skipping irrelevant domain questions.

2. **Weighted Skill Scoring**:
   - Evaluates technical capabilities on a 1 to 5 scale (Beginner to Expert).
   - Combines self-confidence, years of professional experience, and daily tool depth to calculate weighted 0–100% skill scores.

3. **Deterministic Role Matching Matrix (15 Roles)**:
   - Matches candidate profiles against 15 specialized MattyJacks workforce roles:
     - Frontend Developer, Website Developer, Shopify Developer
     - AI Workflow Specialist, AI Prompt Specialist
     - Research Specialist, Lead Generation Specialist
     - Social Media Specialist, Graphic Designer, Content Creator
     - Virtual Assistant, Customer Support Specialist, Data Entry Specialist, Digital Marketing Specialist, Administrative Assistant
   - Provides exact Match Percentage, Tier classification (*Excellent Match*, *Strong Match*, *Good Match*), and logical justification.

4. **Actionable Client Service Generator**:
   - Translates verified skills into concrete service offerings (e.g. *Landing Page Development*, *Shopify Liquid Customization*, *AI Workflow Setup*, *B2B Lead Research*).

5. **Shopify Liquid Code Generator**:
   - Compiles candidate profile data into valid Shopify `.liquid` theme section code.
   - Includes scoped CSS styling, dynamic liquid tags, and a complete customizable Theme Editor `{% schema %}` JSON block.

6. **100% Local & Private Persistence**:
   - Auto-saves interview state in `localStorage` for seamless recovery upon refresh.
   - Full data portability with human-readable **TXT Export**, local **TXT Import**, raw **JSON Export**, and clean **Print Profile** resume formatting.

---

## 📁 Project Structure

```
obeybots/
├── index.html          # Semantic HTML5 layout & section containers
├── style.css           # Modern Dark SaaS / AI design system & print styles
├── script.js           # Core logic, interview engine, scoring, liquid forge & I/O
└── README.md           # Application documentation & deployment guide
```

---

## 🚀 How to Run Locally

Because ObeyBots is built with pure web standards, no build step, compiler, or Node.js server is required:

1. Clone or download this repository.
2. Open `index.html` directly in any web browser (Chrome, Firefox, Safari, Edge).
3. Alternatively, launch with a local static server:
   ```bash
   npx serve obeybots
   # or
   python -m http.server 8000
   ```

---

## ⚙️ How It Works

### 1. Adaptive Interview Engine
- **Basic Information**: Collects candidate identity, timezone, location, and portfolio links.
- **Focus Selection**: Selects primary domains.
- **Dynamic Branching**: `getActiveQuestions()` evaluates selected focus areas and dynamically injects skill evaluation cards.
- **Experience Track Record**: Captures past projects, client achievements, and daily software tools.

### 2. Skill Scoring Engine
- Skills are rated from 1 (*Beginner*) to 5 (*Expert*).
- Applied experience modifier adjusts the calculated percentage:
  - 1–2 years: $1.05\times$
  - 3–5 years: $1.15\times$
  - 5–8 years: $1.25\times$
  - 8+ years: $1.35\times$
- Skills scoring $\ge 65\%$ are classified as **Primary Skills**, while remaining skills are listed under **Secondary & Complementary Skills**.

### 3. Role Matching Engine
- Evaluates candidate skill vectors against required skill criteria for each of the 15 MattyJacks roles.
- Calculates deterministic match percentage and assigns tier badges based strictly on provided answers without inventing qualifications.

### 4. Local Data & Privacy
- Zero backend server calls.
- **Save Progress**: Auto-saves every keystroke and selection to browser `localStorage`.
- **TXT Export**: Generates structured `.txt` document containing candidate profile, scores, role matches, and liquid code.
- **TXT Import**: Safely parses exported `.txt` files locally in the browser to restore interview state.
- **JSON Export**: Downloads raw JSON state for system integration.

---

## 🛍️ Shopify Liquid Code Generator

The Shopify Liquid Generator produces section files ready for theme deployment:
- **Filename**: `obeybots-worker-profile.liquid`
- Includes custom Theme Editor schema fields: `candidate_name`, `candidate_headline`, `candidate_location`, `candidate_bio`, `candidate_skills`, and `cta_link`.
- Includes "Copy Liquid Code" and "Download .liquid File" buttons.

---

## 📦 GitHub Upload Instructions

To upload this project to your GitHub repository:

```bash
# Initialize git repository inside the obeybots folder
git init

# Add all 4 source files
git add index.html style.css script.js README.md

# Commit changes
git commit -m "Initial commit: ObeyBots AI Skills Interviewer static web app"

# Link to your GitHub remote repository
git remote add origin https://github.com/YOUR_USERNAME/obeybots.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🌐 Vercel Deployment Guide

Deploying ObeyBots to Vercel takes less than 60 seconds:

### Method A: Via Vercel Web Dashboard
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your `obeybots` GitHub repository.
3. Keep Framework Preset as **Other / Static HTML**.
4. Click **Deploy**.

### Method B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy directly from the project directory
vercel
```

---

## 🔗 Ecosystem Link

- **MattyJacks Upwork Profile**: [https://mattyjacks.com/upwork](https://mattyjacks.com/upwork)
- **Concept & Product**: ObeyBots AI Workforce Operating System
