import { useEffect, useRef } from 'react';
import { animate, stagger } from 'motion';

/**
 * A hook to apply a consistent "springy" hover effect to an element.
 * @param {object} options - Configuration for the hover effect.
 * @param {number} [options.scale=1.2] - The scale to animate to on hover.
 * @returns {{onMouseEnter: Function, onMouseLeave: Function}} Handlers to spread onto a component.
 */
export const useSpringyHover = ({ scale = 1.2 } = {}) => {
    const handleMouseEnter = (event) => {
        animate(event.currentTarget, { scale }, { type: "spring", stiffness: 400, damping: 15 });
    };

    const handleMouseLeave = (event) => {
        animate(event.currentTarget, { scale: 1 }, { type: "spring", stiffness: 400, damping: 15 });
    };

    return { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave };
};

/**
 * A hook to apply an entrance animation to the main containers of a page.
 * @param {React.RefObject[]} refs - An array of refs attached to the containers to animate.
 * @param {boolean} loading - The loading state of the page. Animation runs when this becomes false.
 */
export const usePageEntranceAnimation = (refs, loading) => {
    useEffect(() => {
        if (!loading && refs.length > 0) {
            const validElements = refs.map(ref => ref.current).filter(Boolean);
            if (validElements.length > 0) {
                animate(
                    validElements,
                    { opacity: [0, 1], y: [20, 0] },
                    { delay: stagger(0.1), duration: 0.5, easing: "ease-out" }
                );
            }
        }
    }, [loading, refs]);
};

/**
 * A hook to apply a staggered entrance animation to list items (e.g., table rows).
 * It returns a ref that should be attached to the list's parent container (e.g., <tbody>).
 * @param {boolean} loading - The loading state of the page.
 * @param {any[]} data - The data array. Animation runs when this populates.
 * @param {string} [selector='tr'] - The CSS selector for the items to animate within the parent.
 * @returns {React.RefObject} A ref to attach to the parent container of the list items.
 */
export const useStaggeredListAnimation = (loading, data, selector = 'tr') => {
    const parentRef = useRef(null);

    useEffect(() => {
        if (!loading && data.length > 0 && parentRef.current) {
            const items = parentRef.current.querySelectorAll(selector);
            if (items.length > 0) {
                // Set initial state before animating
                animate(items, { opacity: 0, scale: 0.95 }, { duration: 0 });
                // Animate to final state
                animate(
                    items,
                    { opacity: [0, 1], scale: [0.95, 1] },
                    { delay: stagger(0.05), duration: 0.4, easing: "ease-out" }
                );
            }
        }
    }, [loading, data, selector]);

    return parentRef;
};