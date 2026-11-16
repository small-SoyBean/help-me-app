import {GodotViewer} from "./GodotViewer.tsx";

export default function Body() {
    return (
        <div className="flex flex-row w-full h-full justify-center items-center bg-gray-200">
            <GodotViewer />
        </div>
    );
}