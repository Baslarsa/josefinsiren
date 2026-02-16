import type { Metadata } from 'next'

import React from 'react'
import { ViewTransitions } from 'next-view-transitions'

import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import CustomLoadingOverlay from '@/components/LoadingOverlay'
import Script from 'next/script'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID!
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-gtag" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `}
          </Script>
          <InitTheme />
          <link href="/js-favicon.png" rel="icon" sizes="32x32" />
          <link href="/js-favicon.svg" rel="icon" type="image/svg+xml" />
        </head>
        <body className="relative">
          <Providers>
            <Header />
            <CustomLoadingOverlay />
            {children}
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
