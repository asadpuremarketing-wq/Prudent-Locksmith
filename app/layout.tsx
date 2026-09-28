import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SITE } from '@/lib/site';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { StickyCtaBar } from '@/components/sticky-cta';
import { RequestServiceProvider } from '@/components/request-service-context';
import { RequestServiceModal } from '@/components/request-service-modal';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#0B1116',
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`
  },
  description: SITE.description,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: SITE.baseUrl
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.baseUrl}/#business`,
    name: SITE.name,
    url: SITE.baseUrl,
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    image: `${SITE.baseUrl}/logo.png`,
    priceRange: '$$',
    currenciesAccepted: 'CAD',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    description: SITE.description,
    areaServed: SITE.serviceAreaCities.map((city) => ({
      '@type': 'City',
      name: `${city}, Ontario, Canada`
    })),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 43.2557,
        longitude: -79.8711
      },
      geoRadius: '80000'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    knowsAbout: [
      'Locksmith Services',
      'Garage Door Repair',
      'Garage Door Opener Installation',
      'Residential Locksmith',
      'Commercial Locksmith',
      'Automotive Locksmith',
      'Emergency Lockout Service'
    ],
    hasMap: 'https://maps.google.com/?q=Hamilton,ON'
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body className={inter.className}>
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18090932025"
          strategy="afterInteractive"
        />
        <Script id="google-tag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18090932025');
          `}
        </Script>

        {/* Meta Pixel - deferred */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1071637329149538');
            fbq('track', 'PageView');
          `}
        </Script>

        <RequestServiceProvider>
          <Header />
          <main className="min-h-screen pb-24 sm:pb-0">{children}</main>
          <Footer />
          <StickyCtaBar />
          <RequestServiceModal />
        </RequestServiceProvider>
        {/* Meta Pixel noscript fallback - always on */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1071637329149538&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
