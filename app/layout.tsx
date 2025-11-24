import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Roboto } from "next/font/google";

import FeedbackButton from "@/components/FeedbackButton";
import { CartProvider } from "@/components/CartContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import MetaCapiPageView from "@/components/MetaCapiPageView";

export const metadata: Metadata = {
  title: "Logicology",
  description: "Empowering Minds Through STEM Play and Logic-Based Learning",
};

const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    
    <html lang="en" className={`${outfit.variable} ${roboto.variable}`}>
      <head>
        <link
          rel="icon"
          href="https://ik.imagekit.io/pratik2002/logo-logicology-removebg-preview.png?updatedAt=1760432002538"
        />
        {/* Google Analytics: gtag.js */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-V56MW94G3L`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-V56MW94G3L', { page_path: window.location.pathname });
          `}
        </Script>
      </head>
      <body>
        <CartProvider>
          {/* Meta Pixel Script */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1374809147978540');
              fbq('track', 'PageView');
              window.fbq = window.fbq || fbq;
            `}
          </Script>

          {/* Server-to-Meta: CAPI PageView ping from the browser */}
          <MetaCapiPageView />

          {/* NoScript fallback */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1374809147978540&ev=PageView&noscript=1"
              alt="facebook pixel"
            />
          </noscript>

          {children}
          <FeedbackButton />
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
