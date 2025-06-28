import "./globals.css"
import { Toaster } from "react-hot-toast"

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
export const metadata = {
  title: "Sinkedin: Professional Fails & Career Despair",
  description:
    "The brutally honest, hilariously real anti-professional network. Share job rejection stories, epic interview fails, and career disasters. It's schadenfreude, but for work.",
  // Uncomment when pushin to production
  // keywords: [
  //   "career failure",
  //   "job rejection",
  //   "interview fail",
  //   "layoff stories",
  //   "startup crash",
  //   "professional fuckups",
  //   "work humor",
  //   "dark humor",
  //   "bad boss stories",
  //   "toxic workplace",
  //   "LinkedIn alternative",
  //   "career despair",
  // ],
  // robots: {
  //   // Rules for search engine crawlers
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     "max-video-preview": -1,
  //     "max-image-preview": "large",
  //     "max-snippet": -1,
  //   },
  // },
  // metadataBase: new URL(siteUrl), // Required for absolute URLs in Open Graph
  // openGraph: {
  //   title: "Sinkedin: Professional Fails & Career Despair",
  //   description:
  //     "The LinkedIn antithesis. Share your glorious failures and laugh at the chaos of corporate life.",
  //   url: siteUrl,
  //   siteName: "Sinkedin",
  //   // images: [
  //   //   {
  //   //     url: "/og-image.png", // MUST create this image and place it in your `public` folder
  //   //     width: 1200,
  //   //     height: 630,
  //   //     alt: "Sinkedin Logo with the tagline: Where careers go to die (and get roasted).",
  //   //   },
  //   // ],
  //   locale: "en_US",
  //   type: "website",
  // },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* This is the Toaster component that will render all our toasts */}
        <Toaster
          position="bottom-center" // Or "top-right", "bottom-left" etc.
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "var(--color-dark-secondary)", // #161b22
              color: "var(--color-light)", // #e6edf3
              border: "1px solid var(--color-dark-border)", // #30363d
            },

            // Define specific options for different toast types
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981", // A nice green
                secondary: "var(--color-light)",
              },
            },

            // Our custom error toast to match the brand's accent color
            error: {
              duration: 5000,
              style: {
                background: "var(--color-accent)", // Our red accent color #e03131
                color: "var(--color-light)", // White text looks good on red
              },
              iconTheme: {
                primary: "var(--color-light)", // The icon color
                secondary: "var(--color-accent)", // The icon background
              },
            },
          }}
        />

        {children}
      </body>
    </html>
  )
}
