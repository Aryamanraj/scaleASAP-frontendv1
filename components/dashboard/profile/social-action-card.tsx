"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

interface SocialActionCardProps {
    icon: React.ReactNode;
    label: string;
    actionType: "copy" | "link";
    value: string;
    iconColor?: string;
    className?: string;
}

export const SocialActionCard = ({
    icon,
    label,
    actionType,
    value,
    iconColor = "#434343"
}: SocialActionCardProps) => {
    const [hasCopied, setHasCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        if (actionType === "copy") {
            navigator.clipboard.writeText(value);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        } else {
            window.open(value, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div
            onClick={handleClick}
            style={{
                height: '64px',
                backgroundColor: isHovered ? '#fafafa' : '#ffffff',
                borderColor: isHovered ? '#d4d4d4' : '#eeeeee',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: '4px',
                color: '#434343',
                transition: 'all 0.2s ease',
                userSelect: 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setHasCopied(false);
            }}
        >
            {hasCopied ? (
                <Check size={20} color="#10B981" />
            ) : isHovered ? (
                actionType === "copy" ? (
                    <Copy size={20} color={iconColor} />
                ) : (
                    <ExternalLink size={20} color={iconColor} />
                )
            ) : (
                icon
            )}
            <span style={{
                fontSize: '11px',
                fontWeight: 500,
                color: hasCopied ? "#10B981" : "#434343"
            }}>
                {hasCopied ? "Copied" : label}
            </span>
        </div>
    );
};
