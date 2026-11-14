import {GodotViewer} from "./GodotViewer.tsx";

export default function Map() {
    return (
        <>
            <div className="min-h-screen justify-around bg-slate-50 fill">
                <div className="w-full h-[calc(100dvh-64px)]">
                    <GodotViewer/>
                </div>
            </div>
        </>
    );
}