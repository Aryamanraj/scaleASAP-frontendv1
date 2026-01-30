// Utility to decode obfuscated sensitive data
export function decodeSensitiveData(data?: string): string | undefined {
    if (!data) return data
    try {
        return atob(data)
    } catch {
        return data // Return as-is if not base64
    }
}
