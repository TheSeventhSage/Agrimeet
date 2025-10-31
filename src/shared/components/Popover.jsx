import React, { useState, useRef, useEffect } from 'react'; // <-- THIS IS THE FIX

/**
 * A simple, custom Popover component.
 * Uses React state and hooks, no external libraries.
 */
export const Popover = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);

    // This function closes the popover if a click happens *outside* of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        // Add event listener to the whole document
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popoverRef]);

    // We pass the open state and toggle function to the children
    return (
        <div className="relative" ref={popoverRef}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // This gives props to PopoverTrigger and PopoverContent
                    return React.cloneElement(child, {
                        isOpen,
                        setIsOpen,
                    });
                }
                return child;
            })}
        </div>
    );
};

// The button that opens the popover
export const PopoverTrigger = ({ children, isOpen, setIsOpen }) => {
    // We clone the child (our Button) and add an onClick handler
    if (React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: () => setIsOpen(!isOpen),
        });
    }
    return null;
};

// The content that shows up when the popover is open
export const PopoverContent = ({ children, isOpen, className, align = 'end' }) => {
    if (!isOpen) {
        return null;
    }

    const alignClass = align === 'end' ? 'right-0' : 'left-0';

    return (
        <div
            className={`absolute z-50 mt-2 w-auto rounded-md border bg-white p-4 shadow-lg ${alignClass} ${className || ''}`}
        >
            {children}
        </div>
    );
};