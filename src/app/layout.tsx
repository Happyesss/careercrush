import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/tiptap/styles.css'
import '@mantine/notifications/styles.css'
import { Providers } from '@/components/Providers'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { Divider } from '@mantine/core'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stemlen - Job Portal',
  description: 'Find your dream job or hire the best talent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Divider mx="md" size="xs"/>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}