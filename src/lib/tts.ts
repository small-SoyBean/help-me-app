import {getHybridModel} from "./firebase.ts";

let audioCtx: AudioContext | null = null;

export function playPcmBase64(base64Data: string, sampleRate = 24000): Promise<void> {
    if (!audioCtx) {
        audioCtx = new AudioContext({ sampleRate });
    }

    // 1. Decode Base64 string -> raw binary bytes
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Interpret bytes as signed 16-bit integers (Int16) and normalize to Float32 (-1.0 to 1.0)
    const int16Samples = new Int16Array(bytes.buffer);
    const float32Samples = new Float32Array(int16Samples.length);
    for (let i = 0; i < int16Samples.length; i++) {
        float32Samples[i] = int16Samples[i] / 32768.0;
    }

    // 3. Put samples into a Web Audio buffer and play
    const audioBuffer = audioCtx.createBuffer(1, float32Samples.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Samples);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    return new Promise((resolve) => {
        source.onended = () => resolve();
        source.start();
    });
}

// Generate speech from text and play it
export async function speakText(textToRead: string): Promise<void> {
    const ttsModel = getHybridModel(true, true);

    const result = await ttsModel.generateContent(
        `${textToRead}`
    );

    const inlinePart = result.response.inlineDataParts()?.[0];
    if (!inlinePart?.inlineData?.data) {
        throw new Error("No audio data returned from gemini-3.8-flash-tts");
    }

    await playPcmBase64(inlinePart.inlineData.data, 24000);
}