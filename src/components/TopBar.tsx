import {TopBarButtons} from "./TopBarButtons.tsx";
import {type Tabs} from "../App.tsx"

interface TopBarProps {
    activeTab: Tabs;
    onSelectTab: (tab: Tabs) => void;
}

export function TopBar({activeTab, onSelectTab}: TopBarProps) {
    return (
        <nav className="shrink-0 bg-slate-300 flex gap-10 justify-between p-3 text-white">
            <div>
                <p className="flex font-bold text-red-500 justify-center text-center items-center text-4xl">HelpMe</p>
                <p className="text-red-600 flex font-light items-end text-left">Medical Guide</p>
            </div>
            <TopBarButtons activeTab={activeTab} onSelectTab={onSelectTab} thisTab="user"/>
        </nav>
    );
}