"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";

interface Tab {
    id: string;
    label: string;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    tabs: Tab[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, tabs, activeTab: propActiveTab, onTabChange, style, ...props }, ref) => {
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
        const [internalActiveIndex, setInternalActiveIndex] = useState(0);
        const [hoverStyle, setHoverStyle] = useState({});
        const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
        const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

        const activeIndex = propActiveTab
            ? tabs.findIndex((t) => t.id === propActiveTab)
            : internalActiveIndex;

        useEffect(() => {
            if (hoveredIndex !== null) {
                const hoveredElement = tabRefs.current[hoveredIndex];
                if (hoveredElement) {
                    const { offsetLeft, offsetWidth } = hoveredElement;
                    setHoverStyle({
                        left: `${offsetLeft}px`,
                        width: `${offsetWidth}px`,
                    });
                }
            }
        }, [hoveredIndex]);

        useEffect(() => {
            const activeElement = tabRefs.current[activeIndex];
            if (activeElement) {
                const { offsetLeft, offsetWidth } = activeElement;
                setActiveStyle({
                    left: `${offsetLeft}px`,
                    width: `${offsetWidth}px`,
                });
            }
        }, [activeIndex]);

        useEffect(() => {
            requestAnimationFrame(() => {
                const currentElement = tabRefs.current[activeIndex];
                if (currentElement) {
                    const { offsetLeft, offsetWidth } = currentElement;
                    setActiveStyle({
                        left: `${offsetLeft}px`,
                        width: `${offsetWidth}px`,
                    });
                }
            });
        }, [activeIndex]); // Added dependency to update on hydration/change

        return (
            <div
                ref={ref}
                className={className}
                style={{ position: 'relative', ...style }}
                {...props}
            >
                <div style={{ position: 'relative' }}>
                    {/* Hover Highlight */}
                    <div
                        style={{
                            position: 'absolute',
                            height: '34px',
                            transition: 'all 300ms ease-out',
                            backgroundColor: 'rgba(14, 15, 17, 0.08)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            ...hoverStyle,
                            opacity: hoveredIndex !== null ? 1 : 0,
                            pointerEvents: 'none', // Ensure it doesn't block clicks
                        }}
                    />

                    {/* Active Indicator */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-1px',
                            height: '2px',
                            backgroundColor: '#0e0f11',
                            transition: 'all 300ms ease-out',
                            zIndex: 1,
                            ...activeStyle,
                        }}
                    />

                    {/* Tabs */}
                    <div style={{ position: 'relative', display: 'flex', gap: '6px', alignItems: 'center', paddingBottom: '4px' }}>
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                ref={(el) => { tabRefs.current[index] = el; }}
                                style={{
                                    padding: '7px 12px',
                                    cursor: 'pointer',
                                    transition: 'color 300ms',
                                    height: '34px',
                                    color: index === activeIndex ? '#0e0e10' : 'rgba(14, 15, 17, 0.6)',
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    setInternalActiveIndex(index);
                                    onTabChange?.(tab.id);
                                }}
                            >
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    lineHeight: '20px',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    fontFamily: 'var(--font-geist-sans), sans-serif'
                                }}>
                                    {tab.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
);
Tabs.displayName = "Tabs";

export { Tabs };
