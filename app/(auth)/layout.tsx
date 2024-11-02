import { ClerkProvider } from '@clerk/nextjs'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

export const medata: Metadata = {
  title: 'Fruski',
  description: 'Learn about France or Russia interacting with natives',
}
const inter = Inter({
  subsets: ['latin', 'cyrillic', 'latin-ext', 'cyrillic-ext'],
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${inter.className} bg-dark-1`}>
          <div className='w-full flex-justify-center items-center min-h-screen'>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
