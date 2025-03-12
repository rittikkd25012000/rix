import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import SimpleTemplate from '@/components/minimal/SimpleTemplate'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RIX - Stream Movies and TV Shows',
  description: 'Stream your favorite movies and TV shows on RIX',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SimpleTemplate>
          {children}
        </SimpleTemplate>
      </body>
    </html>
  )
}
