import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

import Script from 'next/script'

export const metadata: Metadata = {
  title: 'BetaFold – Protein Intelligence Platform',
  description: 'AI-powered protein structure prediction and visualization',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.1/build/pdbe-molstar-light.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Script src="https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.1/build/pdbe-molstar-plugin.js" strategy="beforeInteractive" />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#111827', color: '#f1f5f9', border: '1px solid #1f2937' }
        }} />
        {children}
      </body>
    </html>
  )
}