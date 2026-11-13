import type {JSX} from 'react'

interface BottomBarProps {
    activeTab: "map" | "voice" | "camera";
    onSelectTab: (tab: "map" | "voice" | "camera") => void;
}

export function BottomBar({activeTab, onSelectTab}: BottomBarProps): JSX.Element {
    return (
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-slate-900 p-3 text-white rounded-t-2xl">
            <button
                onClick={() => onSelectTab("map")}
                className={`rounded-lg px-4 py-2 font-semibold ${
                    activeTab === "map" ? "bg-red-600" : "bg-slate-800"
                }`}
            >
                Body Map
            </button>

            <button
                onClick={() => onSelectTab("voice")}
                className={`rounded-lg px-4 py-2 font-semibold ${
                    activeTab === "voice" ? "bg-red-600" : "bg-slate-800"
                }`}
            >
                Voice Triage
            </button>

            <button
                onClick={() => onSelectTab("camera")}
                className={`rounded-lg px-4 py-2 font-semibold ${
                    activeTab === "camera" ? "bg-red-600" : "bg-slate-800"
                }`}
            >
                Camera
            </button>
        </nav>
    );
}