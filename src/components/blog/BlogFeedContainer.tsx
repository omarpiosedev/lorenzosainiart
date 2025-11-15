'use cache';

import type { BlogPost } from '@/sanity/types';
import { cacheLife, cacheTag } from 'next/cache';
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

// Next.js 16 Cache Components: Proper cache strategy for Sanity CMS
// - cacheTag: enables on-demand revalidation with revalidateTag('blog-posts')
// - cacheLife: balances freshness (10 min) with performance
// - Error handling: gracefully handles client initialization failures
export async function BlogFeedContainer({ locale }: BlogFeedContainerProps) {
  // Configure cache strategy for external CMS (Sanity)
  cacheTag('blog-posts');
  cacheLife({
    stale: 300, // 5 minutes - client can use stale data
    revalidate: 600, // 10 minutes - background revalidation
    expire: 3600, // 1 hour - maximum cache lifetime
  });

  // Fetch posts from Sanity with error handling
  let posts: BlogPost[] = [];

  if (!client) {
    console.error('[BlogFeedContainer] Sanity client not initialized. Check NEXT_PUBLIC_SANITY_* env vars.');
    return <BlogFeed posts={posts} locale={locale} />;
  }

  try {
    posts = await client.fetch<BlogPost[]>(POSTS_QUERY);
  } catch (error) {
    console.error('[BlogFeedContainer] Failed to fetch posts from Sanity:', error);
    // Return empty array on error - BlogFeed will show "No posts found"
  }

  return <BlogFeed posts={posts} locale={locale} />;
}
