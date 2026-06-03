import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CardNest LLC - Scan, Detect, Analyze, Prevent",

   icons: {
    // icon: '/favicon.ico', // path from the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head >
        <link rel="icon" href="/images/favicon.jpg" type="image/jpg" />
        {/* Or use: <link rel="icon" href="/favicon.ico" /> */}
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18207710728"
        />
        <Script
          id="google-ads-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-18207710728');
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}

