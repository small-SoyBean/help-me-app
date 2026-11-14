import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Properly type the debug token on globalThis so TypeScript/ESLint never complain
declare global {
    interface Window {
        FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
    }
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Safeguard: Warn immediately if .env.local hasn't loaded
if (!firebaseConfig.apiKey) {
    console.error(
        "Missing VITE_FIREBASE_API_KEY! Make sure .env.local is in the project root folder (next to package.json) and restart 'npm run dev'."
    );
}

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Configure App Check Debug Token before initializeAppCheck
if (import.meta.env.DEV) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
});

// 3. Initialize Firestore with modern multi-tab offline caching
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});

// 4. Initialize Firebase AI Logic Backend
export const ai = getAI(app, { backend: new GoogleAIBackend() });

// Call this inside your click/triage handler (required by Chrome's on-device Prompt API)
export function getHybridModel() {
    return getGenerativeModel(ai, {
        mode: InferenceMode.PREFER_ON_DEVICE,
    });
}

//Function to generate a text response
export async function generateAIResponse(prompt: string) {
    try {
        const model = getHybridModel();

        await model.initializeDeviceModel((val) =>
            console.log(`Download progress: ${Math.round(val*10000) / 100}%`)
        );

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
}