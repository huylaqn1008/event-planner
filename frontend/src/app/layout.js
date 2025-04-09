import "@/assets/fonts/fonts.css"
import "./globals.css"
import MainLayout from "@/layout/MainLayout"
import NextTopLoader from "nextjs-toploader"

export default function RootGroup({ children }) {
  return (
    <html lang="en">
      <body className={`font-pregular bg-whitesmoke`}>
        <MainLayout>
          <NextTopLoader color="#1E1B4B"/>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}
