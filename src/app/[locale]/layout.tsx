import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

function hasLocale(locales: readonly string[], locale: string): boolean {
  return locales.includes(locale);
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  try {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
      notFound();
    }
    // Bypass getMessages()/next-intl/config: load messages directly to avoid
    // "Couldn't find next-intl config file" when next-intl's config resolution fails.
    const messages = (await import(`@/messages/${locale}.json`)).default;
    // Pass now and timeZone so NextIntlClientProvider (server) does not call
    // getNow()/getTimeZone(), which use getConfig -> require('next-intl/config').
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <NextIntlClientProvider locale={locale} messages={messages} now={now} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    );
  } catch (e) {
    throw e;
  }
}
