# HelpMe - Medical Guide

**HelpMe - Medical Guide** is a Progressive Web Application (PWA) built for the **#BuildHybridAI 2026** hackathon. It provides accessible emergency medical guidance and triage assistance through three standalone input methods—an interactive human anatomy map, voice/text input, or device camera—backed by offline-first caching and on-device/cloud hybrid AI inference.

> **Disclaimer:** This software is an experimental hackathon prototype created for educational and demonstration purposes only. It is **not** a substitute for professional medical advice, diagnosis, treatment, or emergency services. In the event of a medical emergency, contact local emergency services (e.g., 911) immediately.

---

## Project Status

This repository is under active development for the #BuildHybridAI 2026 hackathon. Currently, each of the three input tabs operates as an independent method of getting medical guidance, with combined multi-modal triage across tabs planned as a future enhancement.

### Implemented
- **Application Shell & Navigation:** React 19 + TypeScript + Tailwind CSS v4 layout with bottom-bar navigation (`Body Map`, `Talk`, `Camera`).
- **PWA Configuration:** Service worker registration (`autoUpdate`) and web manifest configured via `vite-plugin-pwa`.
- **Hybrid AI & Offline Backend Setup (`src/lib/firebase.ts`):**
  - Firebase AI Logic configured with `GoogleAIBackend` and `InferenceMode.PREFER_ON_DEVICE` (`getHybridModel()`) to prioritize Chrome on-device Gemini Nano inference with automatic cloud fallback.
  - Cloud Firestore initialized with `persistentLocalCache` and `persistentMultipleTabManager` for offline data persistence across tabs.
  - Firebase App Check initialized with `ReCaptchaEnterpriseProvider` and local development debug token support.

### In Progress
- **Interactive Human Anatomy Map (`src/components/Map.tsx`):** Replacing the current placeholder view with an interactive body map for clicking and labeling affected areas to request guidance.
- **Voice (STT) & Text Input View:** Implementing speech-to-text and text entry as a standalone method for describing symptoms.
- **Camera Capture View:** Integrating device camera access as a standalone method for visual symptom/injury assessment.
- **Hybrid AI Triage Integration:** Connecting each input method to `getHybridModel()` for independent triage responses and caching results in Firestore.
- **Future Enhancement:** Combining inputs across all three tabs into a single unified triage session.

---

## Tech Stack

- **Frontend:** React 19, TypeScript 6, Tailwind CSS v4, Lucide React
- **Build & PWA:** Vite 8, `vite-plugin-pwa`
- **AI & Backend:** Firebase v13 (`firebase/ai` Hybrid Inference, Cloud Firestore with offline persistence, Firebase App Check)

---

## Getting Started

### Prerequisites
- **Node.js** (v20+ recommended) and **npm**
- A **Firebase project** with Firebase AI Logic, Firestore, and App Check enabled
- For on-device inference: a supported desktop browser with Chrome's Built-in AI (Prompt API / Gemini Nano) enabled; otherwise, Firebase AI automatically falls back to cloud inference.

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (next to `package.json`). This file is git-ignored via `*.local` in `.gitignore` so credentials are never committed to the repository.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_enterprise_site_key
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Repository Structure

```text
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Bundled static assets
│   ├── components/
│   │   ├── BottomBar.tsx           # Bottom navigation bar
│   │   ├── BottomBarButtons.tsx    # Reusable navigation button component (in progress)
│   │   └── Map.tsx                 # Anatomy map view (placeholder, in progress)
│   ├── lib/
│   │   └── firebase.ts     # Firebase App, App Check, Firestore, and Hybrid AI initialization
│   ├── App.tsx             # Root application component and tab state
│   ├── index.css           # Tailwind CSS entry point
│   └── main.tsx            # React DOM entry point
├── index.html
├── vite.config.ts          # Vite, Tailwind CSS, and PWA configuration
└── package.json
```

---

## Team

- **[Team Member 1](https://github.com/username)** — Role / Focus
- **[Team Member 2](https://github.com/username)** — Role / Focus
- **[Team Member 3](https://github.com/username)** — Role / Focus

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
