import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

import NavBar from './NavBar';

/**
 * NavBar component displays the main navigation with:
 * - Logo on the left
 * - Desktop: horizontal menu items
 * - Mobile: hamburger menu that morphs the pill container
 */
const meta = {
  title: 'UI/NavBar',
  component: NavBar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/it',
      },
    },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    logo: { control: 'text' },
    logoAlt: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default navigation items for stories
const defaultItems = [
  { label: 'Home', href: '/it' },
  { label: 'Portfolio', href: '/it/portfolio' },
  { label: 'Blog', href: '/it/blog' },
  { label: 'About Me', href: '/it/aboutme' },
  { label: 'Contact', href: '/it/contact' },
];

/**
 * Desktop view with all menu items visible
 */
export const Desktop: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini Logo',
    items: defaultItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

/**
 * Mobile view (closed state) - compact pill with logo and hamburger
 */
export const MobileClosed: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini Logo',
    items: defaultItems,
  },
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile navbar in closed state - shows compact pill with logo and hamburger icon with golden border',
      },
    },
  },
};

/**
 * Mobile view (open state) - expanded pill with menu items
 */
export const MobileOpen: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini Logo',
    items: defaultItems,
  },
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  play: async ({ canvas, userEvent }) => {
    // Click hamburger to open menu
    const hamburger = canvas.getByLabelText('Toggle menu');
    await userEvent.click(hamburger);

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify menu items are visible
    const menuItems = canvas.getAllByRole('menuitem');

    await expect(menuItems.length).toBe(5);
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile navbar in open state - pill expands with GSAP animation and menu items fade in with stagger',
      },
    },
  },
};

/**
 * Mobile interaction - tests hamburger to X transformation
 */
export const MobileInteraction: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini Logo',
    items: defaultItems,
  },
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  play: async ({ canvas, userEvent }) => {
    const hamburger = canvas.getByLabelText('Toggle menu');

    // Open menu
    await userEvent.click(hamburger);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify menu items are visible
    const menuItems = canvas.getAllByRole('menuitem');

    await expect(menuItems.length).toBe(5);

    // Close menu
    await userEvent.click(hamburger);
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests complete mobile menu interaction: open → close with GSAP timeline reverse animation',
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
    logoAlt: 'Lorenzo Saini Logo',
    items: defaultItems,
  },
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};

/**
 * With active route
 */
export const WithActiveRoute: Story = {
  args: {
    logo: '/logo.svg',
    logoAlt: 'Lorenzo Saini Logo',
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
        story: 'NavBar with "Portfolio" as the active route (highlighted)',
      },
    },
  },
};
