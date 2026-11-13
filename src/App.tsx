import {BottomBar} from './components/BottomBar.tsx'
import Map from './components/Map'
import {useState} from 'react';

export function App() {
    const [activeTab, setActiveTab] = useState<"map" | "voice" | "camera">("map");
    return (
        <>
            <title>HelpMe - Emergency Medical Assistant</title>
            <BottomBar activeTab={activeTab} onSelectTab={setActiveTab}/>
            {activeTab === "map" && <Map></Map>}
            {activeTab === "voice" && <p className="align-middle text-red-500">Voice</p>}
            {activeTab === "camera" && <p className="align-middle text-red-500">Camera</p>}
        </>
    );
}