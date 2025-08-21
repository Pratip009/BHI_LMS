'use client'

import './globals.css'
import { ThemeProvider } from './utils/theme-provider'
import { Toaster } from 'react-hot-toast'
import { Providers } from './Provider'
import { SessionProvider } from 'next-auth/react'
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import Loader from "./components/Loader/Loader"
import socketIO from 'socket.io-client'
import { useEffect } from 'react'
import { Poppins, Josefin_Sans } from 'next/font/google'

// ✅ Socket Setup
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || ""
const socket = socketIO(ENDPOINT, { transports: ['websocket'] })

// ✅ Google Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-Poppins',
})

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-Josefin',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable}
          !bg-white bg-no-repeat 
          dark:bg-gradient-to-b dark:from-gray-900 dark:to-black 
          duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}

// ✅ Custom Wrapper Component
const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({})

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return isLoading ? <Loader /> : <>{children}</>
}
