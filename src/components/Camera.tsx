import { useState } from 'react';
import { generateAIResponseFromImage } from '../lib/firebase';

export default function Camera() {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return; // User canceled the camera

        setLoading(true);
        setResponse("");

        try {
            await generateAIResponseFromImage(file, (currentText) => {
                setResponse(currentText);
            });
        } catch (error) {
            console.error("Error analyzing image:", error);
            setResponse("Error generating response. Check the console.");
        } finally {
            setLoading(false);
            // Reset the input so the user can take another picture easily
            event.target.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-4 p-6 m-4 bg-white rounded-lg shadow-md justify-center">

            {/* The label acts as our visual button, the actual input is hidden */}
            <label className={`cursor-pointer rounded-sm text-center text-slate-900 bg-blue-500 border-2 border-gray-900 px-4 py-2 font-bold shadow-2xs shadow-blue-400 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
                {loading ? "Analyzing..." : "Take a Photo"}

                <input
                    type="file"
                    accept="image/*"
                    capture="environment" /* This tells mobile devices to open the rear camera */
                    onChange={handleImageCapture}
                    disabled={loading}
                    className="hidden"
                />
            </label>

            {/* AI Response Display */}
            {response && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md whitespace-pre-wrap">
                    {response}
                </div>
            )}
        </div>
    );
}