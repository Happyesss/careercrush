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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CareerCrush - Kickstart Your Dream Career',
  description: 'Find your dream job, connect with expert mentors, and accelerate your career growth with CareerCrush. 10K+ jobs placed successfully.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-secondary min-h-screen flex flex-col">
        <Providers>
          {/* Full-width sticky header */}
          <div className="sticky top-0 z-50 w-full  backdrop-blur-md border-b border-cape-cod-100/20 dark:border-third shadow-sm">
            
              <Header />
          </div>

          {/* Main content with flex-grow to push footer down */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Full-width footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}