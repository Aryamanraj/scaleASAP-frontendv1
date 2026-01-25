import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ScaleASAP - ICP Discovery Platform",
  description: "Identify your ICP and scale your GTM.",
  icons: {
    icon: "https://pub-3d3b224ee6544903a80a5051e75e33a4.r2.dev/BLUE_BG.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
        <Toaster />
        <script dangerouslySetInnerHTML={{
          __html: `
          // Security Guard: Monitor for destructive commands in inputs
          document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
              const value = e.target.value;
              const destructivePatterns = [/rm\\s+-rf\\b/i, /mkfs\\b/i];
              if (destructivePatterns.some(p => p.test(value))) {
                console.warn('%c[Security Alert] Destructive command pattern detected!', 'color: red; font-weight: bold; font-size: 14px;');
                // Optional: alert('Destructive commands are blocked in this application for security reasons.');
              }
            }
          });
          
          // Self-protection from malicious console copy-pasting
          if (typeof window !== 'undefined') {
            const warningTitle = 'STOP!';
            const warningText = 'This is a browser feature intended for developers. If someone told you to copy-paste something here to "fix" something or "get a feature", it is a scam and will give them access to your account.';
            console.log('%c' + warningTitle, 'color: red; font-size: 50px; font-weight: bold; -webkit-text-stroke: 1px black;');
            console.log('%c' + warningText, 'font-size: 18px;');
          }
        `}} />
      </body>
    </html>
  );
}
