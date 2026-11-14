import {BottomBar} from './components/BottomBar.tsx'
import Map from './components/Map'
import TestComponent from './components/TestComponent.tsx';
import {useState} from 'react';

export function App() {
    const [activeTab, setActiveTab] = useState<"body" | "voice" | "camera">("body");
    const [hasLoadedBody, setHasLoadedBody] = useState(activeTab === "body");

    const handleSelectTab = (tab: "body" | "voice" | "camera") => {
        if (tab === "body") {
            setHasLoadedBody(true);
        }
        setActiveTab(tab);
    };

    return (
        <>
            <title>HelpMe - Medical Guide</title>
            <BottomBar activeTab={activeTab} onSelectTab={handleSelectTab}/>
            {hasLoadedBody && (
                <div className={activeTab === "body" ? "block" : "hidden"}>
                    <Map />
                </div>
            )}
            {activeTab === "voice" && <p className="align-middle text-red-500">Voice</p> && <TestComponent></TestComponent>}
            {activeTab === "camera" && <p className="align-middle text-red-500">Camera</p>}
        </>
    );
}