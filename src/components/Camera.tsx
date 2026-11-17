import { useState, useEffect, useRef } from 'react';
import { generateAIResponseFromImage } from '../lib/firebase';

//Camera controller, streams video feed from device camera and checks network connectivity
export default function Camera() {
    const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

    // Refs for the live camera feed and invisible capture canvas
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Track network status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Starts/stops the camera based on network status
    useEffect(() => {
        let cancelled = false;

        const stopCamera = () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            if (videoRef.current) videoRef.current.srcObject = null;
        };

        // Retry a few times on NotReadableError, since the camera
        // is sometimes still being released by the previous stream
        const openStream = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
            const maxAttempts = 3;
            for (let attempt = 1; ; attempt++) {
                try {
                    return await navigator.mediaDevices.getUserMedia(constraints);
                } catch (err) {
                    const name = err instanceof DOMException ? err.name : '';
                    if (name === 'NotReadableError' && attempt < maxAttempts && !cancelled) {
                        await new Promise(resolve => setTimeout(resolve, 300 * attempt));
                        if (cancelled) throw err;
                        continue;
                    }
                    throw err;
                }
            }
        };

        const startCamera = async () => {
            try {
                const constraints: MediaStreamConstraints = activeDeviceId
                    ? { video: { deviceId: { exact: activeDeviceId } } }
                    : { video: { facingMode: 'environment' } };

                const stream = await openStream(constraints);

                // Effect was cleaned up while waiting: release and bail
                if (cancelled) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play().catch(() => {}); // ignore AbortError
                }

                setResponse("");
                setIsPaused(false);

                const devices = await navigator.mediaDevices.enumerateDevices();
                if (!cancelled) {
                    setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
                }
            } catch (error) {
                if (cancelled) return;
                const err = error as { name?: string; message?: string };
                const name = err?.name ?? 'Unknown';
                console.error("Error accessing camera:", name, err?.message, error);

                if (name === 'NotReadableError') {
                    setResponse("The camera is in use by another app or tab. Close anything else using it and try again.");
                } else if (name === 'NotAllowedError') {
                    setResponse("Camera permission was denied. Please allow access in your browser settings.");
                } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
                    setResponse("No matching camera was found.");
                } else {
                    setResponse(`Error accessing the camera (${name}: ${err?.message ?? 'no details'}).`);
                }
            }
        };

            startCamera();

        return () => {
            cancelled = true;
            stopCamera();
        };
    }, [isOnline, activeDeviceId]);

    const handleTakeAndSendPhoto = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause();
        setIsPaused(true);

        // Convert the canvas drawing into a JPEG Blob
        canvas.toBlob(async (blob) => {
            if (!blob) {
                setResponse("Failed to capture image.");
                return;
            }

            setLoading(true);
            setResponse("");

            try {
                await generateAIResponseFromImage(blob, (currentText) => {
                    setResponse(currentText);
                });
            } catch (error) {
                console.error("Error analyzing image:", error);
                setResponse("Error generating response. Check the console.");
            } finally {
                setLoading(false);
            }
        }, 'image/jpeg', 0.8);


    }
    const handleSwapCamera = () => {
        if (videoDevices.length < 2) return;

        // Fallback to the live stream's ID if activeDeviceId is currently null
        let currentId = activeDeviceId;
        if (!currentId && streamRef.current) {
            // Add "?? null" so TypeScript knows what to do if deviceId is undefined
            currentId = streamRef.current.getVideoTracks()[0]?.getSettings().deviceId ?? null;
        }

        const currentIndex = videoDevices.findIndex(d => d.deviceId === currentId);
        const nextIndex = (currentIndex + 1) % videoDevices.length;

        setActiveDeviceId(videoDevices[nextIndex].deviceId);
        setResponse("");
    };

        //helper function to resume camera feed
        const handleResumeCamera = () => {
            if (videoRef.current) {
                videoRef.current.play();
                setIsPaused(false);
                setResponse(""); // Optional: clear the old response when taking a new photo
            }
        };
    if (!isOnline) {
        return (
            <div className="flex flex-col gap-2 p-6 m-4 bg-white rounded-lg shadow-md justify-center text-center">
                <p className="text-red-500 font-bold">
                    Camera functionality is only available with a network connection.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-6 m-4 bg-white rounded-lg shadow-md justify-center">
            {/* Live Video Feed */}
            <div className="relative w-full bg-black rounded-md overflow-hidden aspect-video flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Hidden canvas used purely for converting the frame to a Blob */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex flex-col gap-2">
                {!isPaused ? (
                    <button
                        onClick={handleTakeAndSendPhoto}
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-600 text-white rounded ${loading ? "opacity-50 pointer-events-none" : ""}`}
                    >
                        {loading ? "Analyzing..." : "Take a Photo"}
                    </button>
                ) : (
                    <button
                        onClick={handleResumeCamera}
                        disabled={loading}
                        className="rounded-sm text-center text-white  bg-blue-900 border-2 "
                    >
                        Resume Camera
                    </button>
                )}

                {videoDevices.length > 1 && !isPaused && (
                    <button
                        onClick={handleSwapCamera}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Swap Camera
                    </button>
                )}
            </div>

            {/* AI Response Display */}
            {response && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md whitespace-pre-wrap">
                    {response}
                </div>
            )}
        </div>
    );
}