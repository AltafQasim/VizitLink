import { Roboto } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const roboto = Roboto({
  weight: ['400','500','700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata = {
  title: {
    default: 'VizitLink - Everything you are. In one, simple link in bio.',
    template: '%s | VizitLink'
  },
  description: 'Join 70M+ people using VizitLink for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.',
  keywords: ['link in bio', 'social media', 'bio link', 'linktree alternative', 'creator tools', 'social links'],
  authors: [{ name: 'VizitLink' }],
  creator: 'VizitLink',
  publisher: 'VizitLink',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vizitlink.com'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vizitlink.com',
    siteName: 'VizitLink',
    title: 'VizitLink - Everything you are. In one, simple link in bio.',
    description: 'Join 70M+ people using VizitLink for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.',
    images: [
      {
        url: '/sharecontent.avif',
        width: 1200,
        height: 630,
        alt: 'VizitLink - Link in Bio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VizitLink - Everything you are. In one, simple link in bio.',
    description: 'Join 70M+ people using VizitLink for their link in bio.',
    images: ['/sharecontent.avif'],
    creator: '@vizitlink',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
