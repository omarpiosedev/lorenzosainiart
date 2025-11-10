export type PhotographyProject = {
  id: string;
  titleKey: string;
  labelKey: string;
  image: string;
  category: 'fashion' | 'editorial' | 'portrait' | 'commercial';
};

export const photographyProjects: PhotographyProject[] = [
  {
    id: 'wild-bloom',
    titleKey: 'PortfolioPage.photography.projects.wildBloom.title',
    labelKey: 'PortfolioPage.photography.projects.wildBloom.label',
    image: '/assets/images/PortfolioHero/62a73e53-e709-445b-83b3-ec4283ab3fe7_rw_19205948.webp',
    category: 'fashion',
  },
  {
    id: 'soft-metals',
    titleKey: 'PortfolioPage.photography.projects.softMetals.title',
    labelKey: 'PortfolioPage.photography.projects.softMetals.label',
    image: '/assets/images/PortfolioHero/53c9c768-8380-4850-8b3f-b43f6cf07b8f_rw_1920c93c.webp',
    category: 'commercial',
  },
  {
    id: 'urban-essence',
    titleKey: 'PortfolioPage.photography.projects.urbanEssence.title',
    labelKey: 'PortfolioPage.photography.projects.urbanEssence.label',
    image: '/assets/images/PortfolioHero/0df95003-185c-4339-9b8c-d4b673e48b974bde.webp',
    category: 'portrait',
  },
  {
    id: 'light-forms',
    titleKey: 'PortfolioPage.photography.projects.lightForms.title',
    labelKey: 'PortfolioPage.photography.projects.lightForms.label',
    image: '/assets/images/PortfolioHero/6ff895bc-e829-44ab-8895-d5e2c069ff6a_rw_38400696.webp',
    category: 'editorial',
  },
  {
    id: 'timeless-moments',
    titleKey: 'PortfolioPage.photography.projects.timelessMoments.title',
    labelKey: 'PortfolioPage.photography.projects.timelessMoments.label',
    image: '/assets/images/PortfolioHero/521bf560-6b45-43d3-8f20-b22d725c5dee_rw_3840ff89.webp',
    category: 'fashion',
  },
];
