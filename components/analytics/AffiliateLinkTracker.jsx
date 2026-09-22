'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Any <a> pointing to one of these hosts — whether it's a React link or raw
// HTML from a translation/CMS string — triggers an admin alert on click.
const TRACKED_HOSTS = ['acomodorentals.com', 'www.acomodorentals.com'];

export default function AffiliateLinkTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(event) {
      const anchor = event.target?.closest?.('a[href]');
      if (!anchor) return;

      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (!TRACKED_HOSTS.includes(url.hostname)) return;

      const payload = JSON.stringify({
        href: url.href,
        page: pathname,
        locale: document.documentElement.lang || '',
        referrer: document.referrer || '',
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/track-affiliate-click',
          new Blob([payload], { type: 'application/json' })
        );
      } else {
        fetch('/api/track-affiliate-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    }

    // Capture phase so this still fires even if a link's own handler
    // stops propagation.
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  return null;
}
