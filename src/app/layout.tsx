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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CareerCrush',
  description: 'Find your dream job or hire the best talent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-secondary">
        <Providers>
          <div className="sticky top-4 z-50 flex justify-center px-4">
            <div className="w-full max-w-6xl mx-auto rounded-lg border border-cape-cod-100/60 dark:border-secondary  dark:bg-cape-cod-900/60 backdrop-blur shadow-sm">
              <Header />
            </div>
          </div>
          {children}
          <Divider mx="md" size="xs"/>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}