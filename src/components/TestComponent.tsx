import {useState } from 'react';
import { generateAIResponse } from '../lib/firebase';

export default function PromptTest() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTest = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResponse("");
        //Creates a non-streamed response (keep in case we don't want to stream)
        //try {
            //const aiText = await generateAIResponse(prompt);
            //setResponse(aiText);
        //} catch (error) {
            //console.error(error);
            //setResponse("Error generating response. Check the console.");
        //} finally {
            //setLoading(false);
        //}

        try {
            // Pass a callback that updates the state every time a new chunk arrives
            await generateAIResponse(prompt, (currentText) => {
                setResponse(currentText);
            });
        } catch (error) {
            console.error(error);
            setResponse("Error generating response. Check the console.");
        } finally {
            setLoading(false);
        }


    };

    return (
        <div className="flex flex-col gap-4 p-6 m-4 bg-white rounded-lg shadow-md w-full max-w-md text-black">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="TEST PROMPT"
                className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
            />
            <button
                onClick={handleTest}
                disabled={loading}
                className="rounded-sm text-slate-900 bg-red-500 border-2 border-gray-900 px-4 py-1 font-bold shadow-2xs shadow-green-400"
            >
                {loading ? "Generating..." : "Send Prompt"}
            </button>

            {response && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md whitespace-pre-wrap">
                    {response}
                </div>
            )}
        </div>
    );
}