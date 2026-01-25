import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuizMaster - Interactive Quiz App',
  description: 'Test your knowledge with our interactive quiz app featuring instant feedback and detailed explanations.',
  icons: {
    icon: '/icon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get('x-next-intl-locale') || 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir}>
      <body className={locale === 'ar' ? 'font-zain' : inter.className}>
        {children}
      </body>
    </html>
  );
}