import {BottomBar} from './components/BottomBar.tsx'
import Map from './components/Map'
import TestComponent from './components/TestComponent.tsx';
import {useState} from 'react';
import {TopBar} from "./components/TopBar.tsx";

export function App() {
    const [activeTab, setActiveTab] = useState<"body" | "voice" | "camera">("body");
    const [hasLoadedGodot, setHasLoadedGodot] = useState(activeTab === "body");
    const [hasLoadedTextAI, setHasLoadedTextAI] = useState(activeTab === "voice");

    const handleSelectTab = (tab: "body" | "voice" | "camera") => {
        if (tab === "body") {
            setHasLoadedGodot(true);
        }
        else if (tab === "voice") {
            setHasLoadedTextAI(true);
        }
        setActiveTab(tab);
    };

    return (
        <>
            <title>HelpMe - Medical Guide</title>
            <TopBar activeTab={activeTab} onSelectTab={handleSelectTab} />
            <BottomBar activeTab={activeTab} onSelectTab={handleSelectTab}/>
            {hasLoadedGodot && (
                <div className={activeTab === "body" ? "block" : "hidden"}>
                    <Map />
                </div>
            )}
            {hasLoadedTextAI && (
                <div className={activeTab === "voice" ? "block" : "hidden"}>
                    <TestComponent />
                </div>
            )}
            {activeTab === "camera" && <p className="align-middle text-red-500">Camera</p>}
        </>
    );
}