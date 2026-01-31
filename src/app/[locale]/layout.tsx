import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import LocaleDirectionSync from '@/components/LocaleDirectionSync';

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
    // Pass timeZone so NextIntlClientProvider (server) does not call getTimeZone(),
    // which uses getConfig -> require('next-intl/config').
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        <LocaleDirectionSync />
        <div className={locale === 'ar' ? 'font-zain' : ''}>
          {children}
        </div>
      </NextIntlClientProvider>
    );
  } catch (e) {
    throw e;
  }
}
