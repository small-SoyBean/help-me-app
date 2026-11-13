import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    // PASTE YOUR CONFIG FROM FIREBASE CONSOLE HERE
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
    // @ts-expect-error - Exposes debug token in browser console
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Initialize App Check (Use a dummy/placeholder site key if only using debug tokens)
initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"),
    isTokenAutoRefreshEnabled: true
});

// 3. Initialize Firestore with Offline Caching
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Firestore offline persistence issue:", err.code);
});

// 4. Initialize Firebase AI Logic (Hybrid Mode)
const ai = getAI(app, { backend: new GoogleAIBackend() });

export const hybridModel = getGenerativeModel(ai, {
    mode: InferenceMode.PREFER_ON_DEVICE, // Uses local Gemini Nano, falls back to cloud
});