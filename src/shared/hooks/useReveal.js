// shared/hooks/useReveal.js
import { useEffect, useRef } from "react";

export default function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        node.classList.add("opacity-0", "translate-y-4", "transition-all", "duration-700");
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("opacity-0", "translate-y-4");
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        obs.observe(node);
        return () => obs.disconnect();
    }, []);
    return ref;
}
