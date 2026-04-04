# 🧪 PersonaLab: Behavioral Simulation Pipeline

This document defines the high-fidelity operational workflow for the PersonaLab research platform. By synchronizing Playwright’s mechanical precision with Gemini 1.5 Vision’s intuitive reasoning, we have created a transparent behavioral laboratory for product audits. 🏁🌟

## 1. System Architecture ⚙️

PersonaLab operates on a **Three-Stage Neural Pipeline**:

1.  **The Mechanical Agent (Browser Agent)**: 
    - Uses **Playwright (Chromium)** to navigate to a target URL.
    - Captures a high-resolution `above-the-fold` snapshot.
    - Extracts `aria-label` and `role` data for every interactive node (buttons, inputs, links).
    - Generates a `BrowserAutomationLog` for real-time diagnostic visibility.
2.  **The Reasoning Core (AI Engine)**:
    - Feeds the snapshot + coordinate metadata into **Gemini 1.5 Vision**.
    - Simultaneously seeds three synthetic research personas (Startup Founder, PM, Developer).
    - Performs the **Friction Audit**: Identifying hesitation points (Coordinates X/Y) and Strategic Insights.
3.  **The Diagnostic Cockpit (Frontend)**:
    - Displays the **Interaction Spectrum** (The background-less Heatmap with high-fidelity nodes).
    - Features the **Neural Trace**: A sequential path showing exactly how each persona would navigate the site.
    - Provides **Strategic insights**: Prioritized recommendations for conversion optimization.

---

## 2. Infrastructure Configuration 📦

To ensure zero-gap efficiency, verify the following configuration in your laboratory:

### Environmental Setup (`.env.local`)
```bash
# 🧠 Reasoning
GEMINI_API_KEY=AI...

# 📦 Storage (Mirroring local & cloud parity)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # ⚠️ REQUIRED for snapshot storage

# 🏎️ Engine Speed
MOCK_MODE=false # Set to 'true' for offline institutional demos
BROWSER_HEADLESS=true # Set to 'false' to watch the Playwright agent work
```

### Supabase Storage (Persistent Audits)
1.  Create a **Public Bucket** named `analyses`.
2.  Run the SQL from `supabase_schema.sql` to activate **Bucket RLS Policies**.
3.  **Failsafe**: If Storage is not yet configured, the system automatically defaults to **Base64 Data-URI generation**, ensuring the "Interaction Spectrum" never remains in a "Loading" state. 🛡️🖼️

---

## 3. Operational Workflow 🏎️

### Step A: Environmental Scan
Enter a target URL on the Home Base. This initiates the **Playwright Lifecycle** in the background.

### Step B: Real-time Telemetry
Watch the **Browser Control Hub** in the Dashboard Sidebar. You will see institutional logs:
- `RESOLVING` network nodes...
- `NAVIGATING` to high-res viewport...
- `STABILIZING` layout for capture...
- `RESOLVED`: High-resolution snapshot ready.

### Step C: Behavioral Synthesis
Once the scan completes, the **Interaction Spectrum** renders. 
- **Thermal Clusters**: Green (Emerald) dots represent low friction/high engagement; Orange (Terracotta) dots indicate behavioral hesitation.
- **Vision Cluster Sidebar**: Clicking a node reveals the specific friction reasoning detected by the AI Engine.

### Step D: Neural Path Analysis
Select a **Persona Profile** (e.g., Sarah Chen Trace) from the sidebar. 
- The **Neural Trace** will animate, showing the sequential interactions of that persona.
- The **Journey Panel** updates to show their subjective conversion likelihood and frustration levels.

---

## 4. Scaling the Laboratory 🚀

- **Adding Personas**: Extend the `generateMockAnalysis` in `src/services/ai-engine/visionService.ts` to include industry-specific personas.
- **Threshold Calibration**: Adjust the `severity` logic in `analyzeController.ts` to tune the "Low" vs "High" friction alerts.
- **Performance Sizing**: The dashboard is normalized for a single-screen view. If adding panels, ensure they maintain the `rounded-[2.5rem]` "Paper" architecture for visual consistency. 🏁🌟

**The Laboratory is now globally synchronized and operational.** 🏁🌟
