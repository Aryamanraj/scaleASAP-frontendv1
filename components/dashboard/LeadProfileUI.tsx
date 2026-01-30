"use client";

import { FlickeringGrid } from "@/components/dashboard/profile/flickering-grid";
import { ArrowLeft, HelpCircle, Flame, Mail, Phone, MapPin, Activity, Copy, ExternalLink, Globe, CheckCheck, Briefcase, GraduationCap, CheckCircle, MessageSquare, Sparkles } from "lucide-react";
import { LinkedInIcon, XIcon, GmailIcon } from "@/components/dashboard/profile/social-icons";
import { ContactItem } from "@/components/dashboard/profile/contact-item";
import { SocialActionCard } from "@/components/dashboard/profile/social-action-card";
import { Tabs } from "@/components/dashboard/profile/tabs";
import { useState, useEffect, useMemo } from "react";
import { Lead } from "@/app/actions/leads";
import { Campaign } from "@/app/actions/campaigns";
import { LEAD_STATUS_CONFIG, getStatusSequence, LeadStatus } from "@/lib/utils/lead-status";

interface LeadProfileUIProps {
    lead: Lead;
    onBack: () => void;
    campaign?: Campaign | null;
}

const Skeleton = ({ width, height, borderRadius = "4px", style = {} }: { width: string | number, height: string | number, borderRadius?: string, style?: any }) => (
    <div
        className="shimmer"
        style={{
            width,
            height,
            borderRadius,
            ...style
        }}
    />
);

export function LeadProfileUI({ lead, onBack, campaign }: LeadProfileUIProps) {
    const [statusIndex, setStatusIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");
    const [hasCompletedAnimation, setHasCompletedAnimation] = useState(false);

    // Derived statuses based on lead's actual status
    const statuses = useMemo(() => {
        const sequence = getStatusSequence(lead.status);
        const derived = sequence.map(s => ({
            label: LEAD_STATUS_CONFIG[s].label,
            color: LEAD_STATUS_CONFIG[s].color
        }));

        // Always end with the match score if it's enriched or beyond
        if (lead.status !== 'found') {
            derived.push({
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={12} color="#10B981" fill="#10B981" />
                        <span>85% MATCH</span>
                    </div>
                ) as any,
                color: "#10B981"
            });
        }
        return derived;
    }, [lead.status]);

    const isLoaded = hasCompletedAnimation || statusIndex === statuses.length - 1;

    useEffect(() => {
        // Reset animation state when lead changes
        const sessionKey = `lead_anim_${lead.id}`;
        if (sessionStorage.getItem(sessionKey)) {
            setHasCompletedAnimation(true);
            setStatusIndex(statuses.length - 1);
        } else {
            setHasCompletedAnimation(false);
            setStatusIndex(0);
        }
    }, [lead.id, statuses.length]);

    useEffect(() => {
        if (!hasCompletedAnimation && statusIndex < statuses.length - 1) {
            const timeout = setTimeout(() => {
                const nextIndex = statusIndex + 1;
                setStatusIndex(nextIndex);
                if (nextIndex === statuses.length - 1) {
                    setHasCompletedAnimation(true);
                    sessionStorage.setItem(`lead_anim_${lead.id}`, 'true');
                }
            }, 1500); // 1.5s per step
            return () => clearTimeout(timeout);
        }
    }, [statusIndex, statuses.length, hasCompletedAnimation, lead.id]);

    const currentStatus = statuses[statusIndex];

    // Helper to convert hex to rgba with opacity
    const getDataUrlColor = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const enrichment = lead.enrichment_data;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--container-bg, #ffffff)',
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div
                className="no-scrollbar"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingBottom: '24px'
                }}
            >
                <div
                    style={{
                        margin: '4px 4px 0 4px',
                        border: '1px solid #fafafa',
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '160px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <FlickeringGrid
                            squareSize={4}
                            gridGap={6}
                            color={currentStatus.color}
                            maxOpacity={0.5}
                            flickerChance={0.1}
                            height={160}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to bottom, transparent 0%, var(--container-bg, #ffffff) 100%)',
                                pointerEvents: 'none'
                            }}
                        />
                        <button
                            onClick={onBack}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                width: '28px',
                                height: '28px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #eeeeee',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <ArrowLeft size={16} color="#4a4a4a" />
                        </button>
                        <button
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                width: '28px',
                                height: '28px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #eeeeee',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <HelpCircle size={16} color="#4a4a4a" />
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: '114px',
                        left: '24px',
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #fafafa',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 20,
                        overflow: 'hidden',
                        padding: '4px'
                    }}
                >
                    {lead.avatar_url ? (
                        <img
                            src={lead.avatar_url}
                            alt={lead.full_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f3f4f6',
                            color: '#43B97B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            fontWeight: 'black',
                            borderRadius: '12px'
                        }}>
                            {lead.full_name.charAt(0)}
                        </div>
                    )}
                </div>
                <div
                    style={{
                        marginTop: '62px',
                        textAlign: 'left',
                        marginLeft: '24px',
                        marginRight: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        fontFamily: 'var(--font-geist-sans), sans-serif'
                    }}
                >
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        lineHeight: '32px',
                        color: '#434343'
                    }}>
                        {lead.full_name}
                    </div>
                    <div style={{
                        backgroundColor: isLoaded ? getDataUrlColor(currentStatus.color, 0.1) : '#ffffff',
                        border: isLoaded ? 'none' : '1px solid #eeeeee',
                        padding: isLoaded ? '4px 8px' : '3px 7px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        color: isLoaded ? currentStatus.color : '#434343',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '22px',
                        transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
                    }}>
                        {currentStatus.label}
                    </div>
                </div>
                <div
                    style={{
                        marginTop: '2px',
                        textAlign: 'left',
                        marginLeft: '24px',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#434343',
                        fontFamily: 'var(--font-geist-sans), sans-serif'
                    }}
                >
                    {lead.job_title} @ <span style={{ fontWeight: 'bold', color: '#10B981' }}>{lead.company}</span>
                </div>
                <div
                    style={{
                        marginTop: '16px',
                        marginLeft: '24px',
                        marginRight: '24px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
                        gap: '8px'
                    }}
                >
                    <SocialActionCard
                        icon={<GmailIcon size={20} />}
                        label="Email"
                        actionType="copy"
                        value={lead.email || "N/A"}
                    />

                    <SocialActionCard
                        icon={<Phone size={20} fill="#10B981" stroke="none" />}
                        label="Phone"
                        actionType="copy"
                        value={enrichment?.phone || "N/A"}
                    />

                    <SocialActionCard
                        icon={<div style={{ color: '#0A66C2', display: 'flex' }}><LinkedInIcon size={20} /></div>}
                        label="LinkedIn"
                        actionType="link"
                        value={lead.linkedin_url || "#"}
                    />

                    <SocialActionCard
                        icon={<XIcon size={18} className="text-black" />}
                        label="Twitter / X"
                        actionType="link"
                        value={"#"}
                    />
                </div>

                <div style={{ marginTop: '16px', borderBottom: '1px solid #eeeeee' }}>
                    <div style={{ padding: '0 24px' }}>
                        <Tabs
                            tabs={[
                                { id: "overview", label: "Overview" },
                                { id: "activity", label: "Key Signals" },
                                { id: "warmup", label: "Warmup" },
                            ]}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>
                </div>

                <div
                    className="no-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: 'auto'
                    }}
                >
                    {activeTab === 'overview' && (
                        <>
                            {!isLoaded ? (
                                <>
                                    {/* Skeleton Lead Intel */}
                                    <div style={{
                                        marginTop: '24px',
                                        marginLeft: '24px',
                                        marginRight: '24px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #eeeeee',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Skeleton width="18px" height="18px" borderRadius="4px" />
                                            <Skeleton width="80px" height="14px" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <Skeleton width="100%" height="12px" />
                                            <Skeleton width="90%" height="12px" />
                                        </div>
                                    </div>

                                    {/* Skeleton Experience */}
                                    <div style={{
                                        marginTop: '12px',
                                        marginLeft: '24px',
                                        marginRight: '24px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #eeeeee',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Skeleton width="18px" height="18px" borderRadius="4px" />
                                                <Skeleton width="100px" height="14px" />
                                            </div>
                                            <Skeleton width="80px" height="16px" borderRadius="4px" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                                    <Skeleton width="40px" height="40px" borderRadius="8px" />
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        <Skeleton width="120px" height="14px" />
                                                        <Skeleton width="180px" height="12px" />
                                                        <Skeleton width="140px" height="10px" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Lead Intel Content */}
                                    <div
                                        style={{
                                            marginTop: '24px',
                                            marginLeft: '24px',
                                            marginRight: '24px',
                                            backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                            border: '1px solid rgba(16, 185, 129, 0.1)',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981' }}>
                                            <CheckCheck size={18} />
                                            <span style={{ fontSize: '14px', fontWeight: 600 }}>Lead Intel</span>
                                        </div>
                                        <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#434343', margin: 0 }}>
                                            {enrichment?.summary || (lead.full_name + " is a high-intent lead with a strong background in " + lead.job_title + ".")}
                                        </p>
                                    </div>

                                    {/* Experience Section */}
                                    {enrichment?.experience && enrichment.experience.length > 0 && (
                                        <div
                                            style={{
                                                marginTop: '12px',
                                                marginLeft: '24px',
                                                marginRight: '24px',
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #eeeeee',
                                                borderRadius: '16px',
                                                padding: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#434343' }}>
                                                    <Briefcase size={18} />
                                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Experience</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
                                                {enrichment.experience.map((exp, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '12px', position: 'relative', paddingBottom: idx < enrichment.experience!.length - 1 ? '20px' : '0' }}>
                                                        {idx < enrichment.experience!.length - 1 && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                left: '19px',
                                                                top: '40px',
                                                                bottom: '0',
                                                                width: '2px',
                                                                backgroundColor: '#e5e7eb',
                                                                zIndex: 0
                                                            }} />
                                                        )}

                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#ffffff',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                            zIndex: 1,
                                                            overflow: 'hidden',
                                                            border: '1px solid #f3f4f6'
                                                        }}>
                                                            {exp.company_logo_url ? (
                                                                <img src={exp.company_logo_url} alt={exp.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                                                            ) : (
                                                                <div style={{ fontWeight: 'bold', color: '#9ca3af' }}>{exp.company_name.charAt(0)}</div>
                                                            )}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#434343' }}>{exp.company_name}</div>
                                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginTop: '2px' }}>{exp.title}</div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                                {exp.time_from} - {exp.time_to}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education Section */}
                                    {enrichment?.education && enrichment.education.length > 0 && (
                                        <div
                                            style={{
                                                marginTop: '12px',
                                                marginLeft: '24px',
                                                marginRight: '24px',
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #eeeeee',
                                                borderRadius: '16px',
                                                padding: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#434343' }}>
                                                <GraduationCap size={18} />
                                                <span style={{ fontSize: '14px', fontWeight: 600 }}>Education</span>
                                            </div>

                                            {enrichment.education.map((edu, idx) => (
                                                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        border: '1px solid #f3f4f6',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {edu.logo_url ? (
                                                            <img src={edu.logo_url} alt={edu.school_name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                                        ) : (
                                                            <div style={{ fontWeight: 'bold', color: '#9ca3af' }}>{edu.school_name.charAt(0)}</div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#434343' }}>{edu.school_name}</div>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                                                            {edu.degree} {edu.field && `· ${edu.field}`}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                            {edu.time_from} - {edu.time_to}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Contact Details */}
                                    <div
                                        style={{
                                            marginTop: '12px',
                                            marginLeft: '24px',
                                            marginRight: '24px',
                                            marginBottom: '24px',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #eeeeee',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}
                                    >
                                        <ContactItem
                                            icon={<Mail size={16} />}
                                            label="Email"
                                            value={lead.email || "N/A"}
                                            actionType="copy"
                                            actionValue={lead.email}
                                            hoverLabel="Copy email"
                                        />

                                        <div style={{
                                            height: '2px',
                                            width: '100%',
                                            backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
                                            backgroundSize: '8px 2px',
                                            backgroundPosition: 'left center',
                                            backgroundRepeat: 'repeat-x'
                                        }} />

                                        <ContactItem
                                            icon={<Phone size={16} />}
                                            label="Phone"
                                            value={enrichment?.phone || "N/A"}
                                            actionType="copy"
                                            actionValue={enrichment?.phone}
                                            hoverLabel="Copy phone"
                                        />

                                        <div style={{
                                            height: '2px',
                                            width: '100%',
                                            backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
                                            backgroundSize: '8px 2px',
                                            backgroundPosition: 'left center',
                                            backgroundRepeat: 'repeat-x'
                                        }} />

                                        <ContactItem
                                            icon={<Globe size={16} />}
                                            label="Website"
                                            value={lead.company ? (lead.company.toLowerCase().replace(/\s+/g, '') + ".com") : "N/A"}
                                            actionType="link"
                                            actionValue={"https://" + (lead.company?.toLowerCase().replace(/\s+/g, '') || "google") + ".com"}
                                            hoverLabel="Visit website"
                                        />

                                        <div style={{
                                            height: '2px',
                                            width: '100%',
                                            backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
                                            backgroundSize: '8px 2px',
                                            backgroundPosition: 'left center',
                                            backgroundRepeat: 'repeat-x'
                                        }} />

                                        <ContactItem
                                            icon={<MapPin size={16} />}
                                            label="Location"
                                            value={enrichment?.location || "N/A"}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'activity' && (
                        <div style={{ padding: '24px' }}>
                            {enrichment?.signals?.map((signal, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        marginBottom: '12px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #eeeeee',
                                        borderLeft: '4px solid #10B981',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Signal Detected</span>
                                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', lineHeight: '1.4' }}>
                                            {signal.headline}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#6b7280', margin: 0 }}>
                                        {signal.description}
                                    </p>
                                    {signal.citations?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {signal.citations.map((cite, cidx) => (
                                                <a key={cidx} href={cite.source_url} target="_blank" style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <ExternalLink size={12} /> {cite.source_name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'warmup' && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            padding: '24px',
                            marginTop: '0'
                        }}>
                            {/* Outbound Message Card */}
                            <div style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #eeeeee',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>Next Outreach Message</span>
                                    <button style={{
                                        padding: '4px 8px',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        color: '#10B981',
                                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>
                                        Regenerate
                                    </button>
                                </div>

                                <div style={{
                                    backgroundColor: '#fafafa',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#111827',
                                    fontStyle: 'italic'
                                }}>
                                    &quot;{lead.outbound_message || (lead.full_name.split(' ')[0] + ", I saw you're focusing on " + (enrichment?.skills?.[0] || "scaling operations") + " at " + lead.company + ". Would love to connect and share some thoughts.")}&quot;
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        flex: 1,
                                        padding: '10px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#6b7280',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}>
                                        <Copy size={16} />
                                        Copy
                                    </button>
                                    <button style={{
                                        flex: 1,
                                        padding: '10px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#ffffff',
                                        backgroundColor: '#10B981',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}>
                                        <Mail size={16} />
                                        Send Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
