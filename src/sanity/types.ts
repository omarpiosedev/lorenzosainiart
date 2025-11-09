import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export type Author = {
  _id: string;
  _type: 'author';
  name: string;
  slug: {
    current: string;
  };
  image?: SanityImageSource & {
    alt?: string;
  };
  bio?: string;
  role?: string;
};

export type BlogPostImage = {
  _key: string;
  _type: 'image';
  asset: SanityImageSource;
  alt?: string;
  caption?: string;
};

export type BlogPost = {
  _id: string;
  _type: 'blogPost';
  _createdAt: string;
  title?: string;
  subtitle?: string;
  slug: {
    current: string;
  };
  author: Author;
  featured: boolean;
  category: 'must-read' | 'latest' | 'events' | 'behind-the-scenes' | 'photography-tips';
  images?: BlogPostImage[];
  content: PortableTextBlock[];
  tags?: string[];
  publishedAt: string;
};

export type BlogPostsQueryResult = {
  posts: BlogPost[];
  total: number;
};
