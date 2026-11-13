import {useState} from "react";

export default function Map() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div className="min-h-screen justify-around bg-slate-50 fill">
                <button onClick={() => setCount(count + 1)}
                        className="rounded-sm text-slate-900 bg-red-500 border-2 border-gray-900 px-4 py-1 font-bold shadow-2xs shadow-green-400">
                    Map
                </button>
                <p>{count}</p>
            </div>
        </>
    );
}