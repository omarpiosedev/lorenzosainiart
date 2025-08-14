'use client';

import { useEffect } from 'react';

type SentryProviderProps = {
  children: React.ReactNode;
  enableSentry?: boolean;
};

export function SentryProvider({ children, enableSentry = false }: SentryProviderProps) {
  useEffect(() => {
    // Only load Sentry client-side when explicitly enabled
    if (enableSentry && !process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
      import('../instrumentation-client').catch(console.error);
    }
  }, [enableSentry]);

  return <>{children}</>;
}
