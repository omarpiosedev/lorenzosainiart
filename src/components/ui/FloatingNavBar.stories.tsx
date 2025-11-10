import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

import FloatingNavBar from './FloatingNavBar';

const meta = {
  title: 'UI/FloatingNavBar',
  component: FloatingNavBar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/it/home',
      },
    },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FloatingNavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  { label: 'Home', href: '/it/home' },
  { label: 'Portfolio', href: '/it/portfolio' },
  { label: 'Blog', href: '/it/blog' },
  { label: 'About', href: '/it/aboutme' },
  { label: 'Contact', href: '/it/contact' },
];

/**
 * Desktop Floating Dock with magnifying glass effect
 * Move your mouse over the icons to see the smooth scaling animation
 */
export const Desktop: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini',
    items: defaultItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story:
          'Desktop dock with GSAP-powered magnifying glass effect. Hover over icons to see smooth scale animations.',
      },
    },
  },
};

/**
 * Mobile Floating Dock (closed state)
 */
export const MobileClosed: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini',
    items: defaultItems,
  },
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile dock in closed state with golden border hamburger icon',
      },
    },
  },
};

/**
 * Mobile Floating Dock (open state)
 */
export const MobileOpen: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini',
    items: defaultItems,
  },
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  play: async ({ canvas, userEvent }) => {
    const hamburger = canvas.getByLabelText('Toggle menu');
    await userEvent.click(hamburger);
    await new Promise(resolve => setTimeout(resolve, 400));
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile dock with staggered menu animation when opened. Items fade in from bottom.',
      },
    },
  },
};

/**
 * With active route highlighting
 */
export const WithActiveRoute: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini',
    items: defaultItems,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/it/portfolio',
      },
    },
    docs: {
      description: {
        story: 'Portfolio icon highlighted with golden background',
      },
    },
  },
};

/**
 * Tablet view
 */
export const Tablet: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini',
    items: defaultItems,
  },
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};
