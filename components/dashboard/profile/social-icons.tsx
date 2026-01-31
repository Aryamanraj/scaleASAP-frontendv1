import React from "react";

export const LinkedInIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor" // Default to current color, user can override class
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'block' }} // Prevent inline spacing issues
    >
        <path d="M21 21H17V14.25C17 13.19 15.81 12.31 14.75 12.31C13.68 12.31 13 13.19 13 14.25V21H9V9H13V10.66C13.68 9.75 14.75 9 16 9C18.25 9 21 10.75 21 13.25V21ZM7 21H3V9H7V21ZM5 3.5C6.38 3.5 7.5 4.62 7.5 6C7.5 7.38 6.38 8.5 5 8.5C3.62 8.5 2.5 7.38 2.5 6C2.5 4.62 3.62 3.5 5 3.5Z" />
    </svg>
);

export const XIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size} // Maintain aspect ratio if possible, but user asked for 24x24
        viewBox="0 0 1200 1227"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'block' }}
    >
        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
    </svg>
);

export const GmailIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size} // Aspect ratio is roughly 1.28:1 (512x399), but fitting to square size is standard for icons.
        // We can preserve aspectRatio or just scale. 
        // SVGL usually provides clean icons. Let's use the viewBox and content provided.
        viewBox="0 0 512 399.42" // Adjusted viewbox to match the fetched SVG.
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'block' }}
    >
        <g fill="none" fillRule="evenodd">
            <g fillRule="nonzero">
                <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
                <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
                <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
            </g>
            <path fill="#ea4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z" />
            <path fill="#c5221f" fillRule="nonzero" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
        </g>
    </svg>
);
