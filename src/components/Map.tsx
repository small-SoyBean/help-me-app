import {useState} from "react";

export default function Map() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div className="min-h-screen justify-around bg-slate-600 fill">
                <button onClick={() => setCount(count + 1)}
                        className="rounded-sm text-white bg-red-500 border-2 border-gray-900 px-4 py-1 font-bold shadow-2xs shadow-green-400">
                    Map
                </button>
                <p>{count}</p>
            </div>
        </>
    );
}