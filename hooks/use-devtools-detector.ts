"use client"

import { useEffect, useState } from 'react'

/**
 * Hook to detect if DevTools are open
 * Uses multiple detection methods for better accuracy
 */
export function useDevToolsDetector() {
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false)

    useEffect(() => {
        let devtoolsOpen = false

        // Method 1: Check window dimensions
        const checkWindowSize = () => {
            const threshold = 160
            const widthThreshold = window.outerWidth - window.innerWidth > threshold
            const heightThreshold = window.outerHeight - window.innerHeight > threshold
            return widthThreshold || heightThreshold
        }

        // Method 2: Debug timing check
        const checkDebugger = () => {
            const start = performance.now()
            // eslint-disable-next-line no-debugger
            debugger
            const end = performance.now()
            return end - start > 100
        }

        // Method 3: Console detection
        const element = new Image()
        Object.defineProperty(element, 'id', {
            get: function () {
                devtoolsOpen = true
                setIsDevToolsOpen(true)
                return 'devtools-detector'
            }
        })

        const check = () => {
            console.log(element)
            console.clear()

            const sizeCheck = checkWindowSize()
            if (sizeCheck !== isDevToolsOpen) {
                setIsDevToolsOpen(sizeCheck)
            }
        }

        // Run checks periodically
        const interval = setInterval(check, 1000)

        return () => clearInterval(interval)
    }, [isDevToolsOpen])

    return isDevToolsOpen
}
