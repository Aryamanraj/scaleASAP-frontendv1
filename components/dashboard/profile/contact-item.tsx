"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

interface ContactItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    hoverLabel?: string;
    actionType?: "copy" | "link";
    actionValue?: string;
}

export const ContactItem = ({
    icon,
    label,
    value,
    hoverLabel,
    actionType,
    actionValue,
}: ContactItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const isInteractive = !!actionType && !!actionValue;

    const handleClick = () => {
        if (!isInteractive) return;

        if (actionType === "copy" && actionValue) {
            navigator.clipboard.writeText(actionValue);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        } else if (actionType === "link" && actionValue) {
            window.open(actionValue, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div
            onMouseEnter={() => isInteractive && setIsHovered(true)}
            onMouseLeave={() => {
                isInteractive && setIsHovered(false);
                setHasCopied(false);
            }}
            onClick={handleClick}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                color: "#434343",
                cursor: isInteractive ? "pointer" : "default",
                userSelect: "none",
                minHeight: "24px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {icon}
                <span style={{ fontWeight: 500, color: "#434343" }}>{label}</span>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: hasCopied ? "#10B981" : isHovered ? "#434343" : "#6B7280",
                    transition: "color 0.2s ease",
                }}
            >
                <span>
                    {hasCopied ? "Copied" : isHovered && hoverLabel ? hoverLabel : value}
                </span>
                {hasCopied ? (
                    <Check size={14} />
                ) : isHovered ? (
                    actionType === "copy" ? (
                        <Copy size={14} />
                    ) : (
                        <ExternalLink size={14} />
                    )
                ) : null}
            </div>
        </div>
    );
};
