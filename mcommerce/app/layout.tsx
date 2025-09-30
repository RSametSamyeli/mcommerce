import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mini E-Commerce',
  description: 'Modern shopping experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}