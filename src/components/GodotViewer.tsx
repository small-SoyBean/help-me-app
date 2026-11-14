import { useEffect, useRef } from 'react';

interface GodotMessage {
    type: string;
    payload?: unknown;
}

export function GodotViewer() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Receive messages FROM Godot
    useEffect(() => {
        const handleMessage = (event: MessageEvent<GodotMessage>) => {
            if (event.origin !== window.location.origin) return;
            const { type, payload } = event.data || {};

            if (type === 'GODOT_READY') {
                console.log('Godot is ready!');
            } else if (type === 'BODY_PART_SELECTED') {
                console.log('User clicked in Godot:', payload);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Send messages TO Godot
    const sendToGodot = (data: GodotMessage) => {
        const iframeWindow = iframeRef.current?.contentWindow as
            | (Window & { receiveFromReact?: (json: string) => void })
            | null;

        if (iframeWindow?.receiveFromReact) {
            iframeWindow.receiveFromReact(JSON.stringify(data));
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <iframe
                ref={iframeRef}
                src="/godot/help_me.html"
                title="Godot Interactive View"
                className="w-full h-[500px] border-0 rounded-lg"
            />
            <button
                onClick={() => sendToGodot({ type: 'TEST_MSG', payload: { part: 'heart' } })}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Test message 1
            </button>
            <button
                onClick={() => sendToGodot({ type: 'JACK_POOP_MSG', payload: { part: 'poop' } })}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Test message 2
            </button>
        </div>
    );
}