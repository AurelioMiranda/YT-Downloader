import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Youtube Downloader By Aurélio Miranda",
  description: "Made by Aurélio Miranda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{height: 100 + '%'}}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
