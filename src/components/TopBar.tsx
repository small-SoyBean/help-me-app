//import { TopBarButtons, type Tab } from "./TopBarButtons";

/*
interface TopBarProps {
    activeTab: Tab;
    onSelectTab: (tab: Tab) => void;
}
 */

export function TopBar(/*{activeTab, onSelectTab}: TopBarProps*/) {
    return (
        <div className="absolute items-center justify-center top-0 left-0 right-0 bg-slate-300 rounded-b-xl">
            <nav className="flex gap-10 justify-start p-3 text-white rounded-b-2xl">
                <div>
                    <p className="flex font-bold text-red-500 justify-center text-center items-center text-4xl">HelpMe</p>
                    <p className="text-red-600 flex font-light items-end text-left">Medical Guide</p>
                </div>
            </nav>
        </div>
    );
}