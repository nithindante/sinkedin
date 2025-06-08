import "./globals.css"

export const metadata = {
  title: "Sinkedin: Professional Fails & Career Despair",
  description:
    "A platform for sharing professional fails, fuck-ups, and general career despair - the LinkedIn antithesis.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
