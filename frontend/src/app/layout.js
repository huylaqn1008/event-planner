import "@/assets/fonts/fonts.css"
import "./globals.css"
import MainLayout from "@/layout/MainLayout"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-pregular bg-whitesmoke`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
