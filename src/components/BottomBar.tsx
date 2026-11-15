import { BottomBarButtons, type Tab } from "./BottomBarButtons";

interface BottomBarProps {
    activeTab: Tab;
    onSelectTab: (tab: Tab) => void;
}

export function BottomBar({ activeTab, onSelectTab }: BottomBarProps) {
    return (
        <nav className="shrink-0 flex justify-around bg-slate-300 p-3 text-white rounded-t-xl">
            <BottomBarButtons thisTab="body" activeTab={activeTab} onSelectTab={onSelectTab} />
            <BottomBarButtons thisTab="voice" activeTab={activeTab} onSelectTab={onSelectTab} />
            <BottomBarButtons thisTab="camera" activeTab={activeTab} onSelectTab={onSelectTab} />
        </nav>
    );
}