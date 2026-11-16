import {BottomBar} from './components/BottomBar.tsx'
import Body from './components/Body'
import Voice from './components/Voice'
import {useState} from 'react';
import {TopBar} from "./components/TopBar.tsx";
import {UserInfo} from "./components/UserInfo.tsx";

export type Tabs = "body" | "voice" | "camera" | "user";

export function App() {
    const [activeTab, setActiveTab] = useState<Tabs>("body");
    const [hasLoadedGodot, setHasLoadedGodot] = useState(activeTab === "body");
    const [hasLoadedTextAI, setHasLoadedTextAI] = useState(activeTab === "voice");

    const handleSelectTab = (tab: Tabs) => {
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
            <TopBar activeTab={activeTab} onSelectTab={handleSelectTab} />
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
                <div className={activeTab === "user" ? "h-full block" : "hidden"}>
                    <UserInfo />
                </div>
            </main>
            <BottomBar activeTab={activeTab} onSelectTab={handleSelectTab}/>
        </div>
    );
}