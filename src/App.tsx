import {BottomBar} from './components/BottomBar.tsx'
import Body from './components/Body'
import Voice from './components/Voice'
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
        <div className={"flex flex-col h-dvh overflow-hidden"}>
            <title>HelpMe - Medical Guide</title>
            <TopBar />
            <main className="flex-1 overflow-hidden">
                {hasLoadedGodot && (
                    <div className={activeTab === "body" ? "h-full block" : "hidden"}>
                        <Body />
                    </div>
                )}
                {hasLoadedTextAI && (
                    <div className={activeTab === "voice" ? "h-full block" : "hidden"}>
                        <Voice />
                    </div>
                )}
            </main>
            <BottomBar activeTab={activeTab} onSelectTab={handleSelectTab}/>
        </div>
    );
}