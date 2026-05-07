import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

// Redirect bare / to /en (or default locale)
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}