import { useEffect } from "react";

/**
 * Calls the provided callback when Escape key is pressed and enabled is true.
 * @param callback Function to call on Escape key
 * @param enabled Whether the listener is active (e.g. modal is open)
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
    useEffect(() => {
        if (!enabled) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" || e.key === "Esc") {
                callback();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [callback, enabled]);
} 