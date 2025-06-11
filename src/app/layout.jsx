import "./globals.css"
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: "Sinkedin: Professional Fails & Career Despair",
  description:
    "A platform for sharing professional fails, fuck-ups, and general career despair - the LinkedIn antithesis.",
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
