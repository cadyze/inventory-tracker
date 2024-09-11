import localFont from "next/font/local";
import "./globals.css";

// Importing local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",  // Make sure the path is correct
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the site
export const metadata = {
  title: "Inventory Manager",
  description: "Track your inventory using Rekognition AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
