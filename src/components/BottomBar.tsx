import { BottomBarButtons } from "./BottomBarButtons";
import {type Tabs} from "../App.tsx"

interface BottomBarProps {
    activeTab: Tabs;
    onSelectTab: (tab: Tabs) => void;
}

export function BottomBar({ activeTab, onSelectTab }: BottomBarProps) {
    return (
        <nav className="shrink-0 flex justify-around bg-slate-300 p-3 text-white">
            <BottomBarButtons thisTab="body" activeTab={activeTab} onSelectTab={onSelectTab} />
            <BottomBarButtons thisTab="voice" activeTab={activeTab} onSelectTab={onSelectTab} />
            <BottomBarButtons thisTab="camera" activeTab={activeTab} onSelectTab={onSelectTab} />
        </nav>
    );
}