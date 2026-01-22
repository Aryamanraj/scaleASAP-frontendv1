"use client"

import React, { useState } from 'react'
import { Linkedin, Twitter, Youtube, Send, Hash } from "lucide-react"

interface SocialIconProps {
    brand: 'linkedin' | 'twitter' | 'youtube' | 'telegram' | 'slack'
    className?: string
}

const BRAND_LOGOS = {
    linkedin: 'https://svgl.app/library/linkedin.svg',
    twitter: 'https://svgl.app/library/x.svg',
    youtube: 'https://svgl.app/library/youtube.svg',
    telegram: 'https://svgl.app/library/telegram.svg',
    slack: 'https://svgl.app/library/slack-icon.svg'
}

const FALLBACK_ICONS = {
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    telegram: Send,
    slack: Hash
}

export function SocialIcon({ brand, className }: SocialIconProps) {
    const [hasError, setHasError] = useState(false)
    const FallbackIcon = FALLBACK_ICONS[brand]

    if (hasError) {
        return <FallbackIcon className={className} />
    }

    return (
        <img
            src={BRAND_LOGOS[brand]}
            alt={`${brand} logo`}
            className={className}
            onError={() => setHasError(true)}
            style={{ pointerEvents: 'none', objectFit: 'contain' }}
        />
    )
}
