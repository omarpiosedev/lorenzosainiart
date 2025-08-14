# Components Documentation

## Demo Components

### Counter Demo (`/counter`)

Interactive counter demonstration showing:

- **Form validation** with Zod schema
- **API routes** (`/api/counter`) with proper error handling
- **Server-side rendering** with Next.js App Router
- **In-memory storage** (no database required)
- **Internationalization** with next-intl
- **Error monitoring** with selective Sentry integration

**Files:**
- `CounterForm.tsx` - Form component with validation
- `CurrentCount.tsx` - Server component displaying count
- `src/app/[locale]/api/counter/route.ts` - API endpoint
- `src/validations/CounterValidation.ts` - Zod schema

**Usage:**
This demo can be removed for production or kept as a technical showcase.

## Production Components

### Navigation & Layout
- `LocaleSwitcher.tsx` - Language switcher component
- `BaseTemplate.tsx` - Main layout template

### Analytics
- `PostHogProvider.tsx` - Analytics provider wrapper

### Utility
- `DemoBadge.tsx` - Development indicator
- `DemoBanner.tsx` - Development banner
- `Hello.tsx` - Welcome component
- `Sponsors.tsx` - Sponsor/powered-by section
