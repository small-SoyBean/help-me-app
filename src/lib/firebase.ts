import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAI, getGenerativeModel, getLiveGenerativeModel, type AudioConversationController, startAudioConversation, GoogleAIBackend, InferenceMode, ResponseModality } from "firebase/ai";
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
export function getHybridModel(online: boolean, tts: boolean) {
    if (online) {
        if (tts) {
            return getGenerativeModel(ai, {
                model: "gemini-3.8-flash-tts",
                generationConfig: {
                    responseModalities: [ResponseModality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: "Kore" },
                        },
                    },
                },
            });
        }
        return getGenerativeModel(ai, {model: "gemini-4-hydrogen"});
    }
    return getGenerativeModel(ai, {model: InferenceMode.PREFER_ON_DEVICE});
}

//Function to generate a text response
export async function generateAIResponse(prompt: string, onUpdate: (text: string) => void) {
    try {
        const model = getHybridModel(true, false);

        await model.initializeDeviceModel((val) =>
            console.log(`Download progress: ${Math.round(val*10000) / 100}%`)
        );
//Old non-streamed output
        //const result = await model.generateContent(prompt);
        //return result.response.text();

        const result = await model.generateContentStream(prompt);

        let fullText = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            onUpdate(fullText)
        }
        return fullText;
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
}


// Live ai stuff

let conversationController: AudioConversationController;

export async function talkToMe(){
    const liveModel = getLiveGenerativeModel(ai, {
        model: "gemini-3.1-flash-live-preview",
        generationConfig: {
            responseModalities: [ResponseModality.AUDIO]
        },
    });
    const session = await liveModel.connect();
    conversationController = await startAudioConversation(session);
}

export async function stopTalkToMe(){
    await conversationController.stop()
}