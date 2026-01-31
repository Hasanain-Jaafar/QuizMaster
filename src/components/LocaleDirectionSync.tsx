'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export default function LocaleDirectionSync() {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', locale);
  }, [locale]);

  return null;
}
