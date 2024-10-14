import type { Metadata } from 'next';
import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../../public/style/style.css';
import React from 'react';
import Layout from '../components/layout/layout';
import localFont from 'next/font/local';
import { Montserrat } from 'next/font/google';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '800', '900'],
});

export const metadata: Metadata = {
  title: '고래밥 | 도커를 쉽게',
  description: '도커 사용을 도와주는 GUI 오픈소스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${montserrat.variable} ${pretendard.variable}`}>
    <body>
    <Layout>{children}</Layout>
    </body>
    </html>
  );
}
