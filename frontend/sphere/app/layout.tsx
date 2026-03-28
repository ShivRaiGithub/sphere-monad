import type { Metadata } from 'next';
import { Press_Start_2P, Inter } from 'next/font/google';
import './globals.css';
import Web3Provider from '@/providers/Web3Provider';
import { SphereProvider } from '@/context/SphereContext';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Sphere — On-Chain Community Platform',
  description:
    'Interactive on-chain community platform. Join communities, grow your tree, and connect with others on an isometric pixel grid.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${inter.variable}`}>
      <body>
        <Web3Provider>
          <SphereProvider>{children}</SphereProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
