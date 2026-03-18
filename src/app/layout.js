import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "Vizualgo",
  description: "Watch & Learn algorithms in action",
};

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${jetBrainsMono.className} antialiased`}
      >
        <Navbar />
        <main className="w-full max-w-3xl mx-auto px-6 pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
