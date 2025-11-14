'use cache';

import type { BlogPost } from '@/sanity/types';
import { client } from '@/sanity/client';
import { BlogFeed } from './BlogFeed';

const POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  _type,
  _createdAt,
  title,
  subtitle,
  slug,
  "author": author->{
    _id,
    _type,
    name,
    slug,
    image,
    bio,
    role
  },
  featured,
  category,
  images,
  content,
  tags,
  publishedAt
}`;

type BlogFeedContainerProps = {
  locale: string;
};

// Next.js 16 Cache Components: This component's data is now cached
// First load: fetches from Sanity and caches the result
// Subsequent loads: instant (served from cache)
export async function BlogFeedContainer({ locale }: BlogFeedContainerProps) {
  // Fetch posts from Sanity (if configured)
  const posts = client ? await client.fetch<BlogPost[]>(POSTS_QUERY) : [];

  return <BlogFeed posts={posts} locale={locale} />;
}
