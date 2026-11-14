import { AudioLines, Camera, PersonStanding } from "lucide-react";

export type Tab = "body" | "voice" | "camera";

const TABS = {
    body: { label: "Body", Icon: PersonStanding },
    voice: { label: "Talk", Icon: AudioLines },
    camera: { label: "Camera", Icon: Camera },
} as const;

interface Props {
    activeTab: Tab;
    onSelectTab: (tab: Tab) => void;
    thisTab: Tab;
}

export function TopBarButtons({ activeTab, onSelectTab, thisTab }: Props) {
    const { label, Icon } = TABS[thisTab];
    const isActive = activeTab === thisTab;

    return (

        <button
            onClick={() => onSelectTab(thisTab)}
            className={`rounded-lg px-4 py-2 flex items-center gap-2 border-2 text-lg ${
                isActive
                    ? "bg-blue-700 active:bg-blue-300 text-white border-blue-950 font-bold"
                    : "bg-white active:bg-blue-300 text-slate-900 border-slate-400 font-normal"
            }`}
        >
            <span className="w-[30%] flex items-center justify-center">
                <Icon/>
            </span>
            <span className="w-[70%] flex text-center justify-center">
                {label}
            </span>
        </button>
    );
}