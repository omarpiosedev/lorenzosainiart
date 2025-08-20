import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Env configuration for T3 stack (currently unused)
// export const Env = createEnv({
createEnv({
  server: {},
  client: {
    // App configuration
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    // App configuration
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,

    // Environment
    NODE_ENV: process.env.NODE_ENV,
  },
});
