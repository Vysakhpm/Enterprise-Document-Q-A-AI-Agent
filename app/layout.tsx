import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Document Q&A Agent' ,
  description: 'Created with Next.js',
  openGraph: {
    title: 'Document Q&A Agent',
    description: 'Created with Next.js',
    url: 'https://your-domain.com',
    siteName: 'Document Q&A Agent',
    images: [
      {
        url: 'https://your-domain.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Document Q&A Agent Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
