import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { SpeechRecognitionProvider } from "@/components/speech-recognition-provider";
import PerformanceMonitor from "@/components/performance-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SakanEgypt - AI-Powered Real Estate Platform",
  description:
    "Egypt's first AI-powered real estate platform with furniture and maintenance services all in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SpeechRecognitionProvider>
              {children}
              <PerformanceMonitor />
            </SpeechRecognitionProvider>
          </LanguageProvider>
        </ThemeProvider>
        <TempoInit />
        <Script id="performance-optimization" strategy="afterInteractive">
          {`
            // Preload critical resources
            const preloadLinks = [
              '/api/properties',
              '/images/hero-bg.jpg'
            ];
            
            preloadLinks.forEach(resource => {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.href = resource;
              link.as = resource.endsWith('.js') ? 'script' : 
                     resource.endsWith('.css') ? 'style' : 
                     resource.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 
                     'fetch';
              document.head.appendChild(link);
            });
            
            // Add intersection observer for lazy loading images
            if ('IntersectionObserver' in window) {
              const imgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                      img.setAttribute('src', src);
                      img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                  }
                });
              });
              
              document.addEventListener('DOMContentLoaded', () => {
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imgObserver.observe(img));
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
