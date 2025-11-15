'use client';

import type { BlogPost } from '@/sanity/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { BlogPostCard } from './BlogPostCard';

gsap.registerPlugin(ScrollTrigger);

type BlogFeedProps = {
  posts: BlogPost[];
  locale: string;
};

export function BlogFeed({ posts, locale }: BlogFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  // GSAP scroll reveal animation
  useGSAP(
    () => {
      if (!feedRef.current) {
        return;
      }

      const cards = feedRef.current.querySelectorAll('.blog-card');
      const triggers: ScrollTrigger[] = [];
      const tweens: gsap.core.Tween[] = [];

      cards.forEach((card, index) => {
        const tween = gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        );

        // Store both tween and ScrollTrigger for comprehensive cleanup
        tweens.push(tween);
        if (tween.scrollTrigger) {
          triggers.push(tween.scrollTrigger);
        }
      });

      // GSAP Best Practice: Refresh ScrollTrigger after all instances created
      // This ensures accurate positioning calculations, especially after:
      // - Async data loading (Sanity posts)
      // - Page transitions
      // - Suspense boundaries resolving
      ScrollTrigger.refresh();

      // CRITICAL: Complete cleanup in correct order
      // 1. Kill ScrollTriggers first (removes scroll listeners)
      // 2. Kill tweens (stops any in-flight animations)
      // This prevents DOM manipulation after React unmounts
      return () => {
        triggers.forEach(st => st.kill());
        tweens.forEach(tw => tw.kill());
      };
    },
    { dependencies: [posts], scope: feedRef },
  );

  if (!posts || posts.length === 0) {
    return (
      <div className="py-[var(--space-16)] text-center">
        <p className="text-pretty text-[var(--text-base)] text-neutral-500">No posts found.</p>
      </div>
    );
  }

  return (
    <section ref={feedRef} className="w-full bg-white py-[var(--space-12)] md:py-[var(--space-16)]">
      <div className="container mx-auto max-w-4xl px-[var(--space-4)] md:px-[var(--space-8)]">
        <div className="grid gap-[var(--space-8)]">
          {posts.map(post => (
            <div key={post._id} className="blog-card">
              <BlogPostCard post={post} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
