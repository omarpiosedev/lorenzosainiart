'use client';

import type { BlogPost } from '@/sanity/types';
import { useGSAP } from '@gsap/react';
import { PortableText } from '@portabletext/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { urlForImage } from '@/sanity/lib/image';

type BlogPostCardProps = {
  post: BlogPost;
  locale: string;
};

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Image navigation handlers
  const handleNextImage = () => {
    if (post.images) {
      setCurrentImageIndex(prev => (prev + 1) % post.images!.length);
    }
  };

  const handlePrevImage = () => {
    if (post.images) {
      setCurrentImageIndex(prev => (prev - 1 + post.images!.length) % post.images!.length);
    }
  };

  // GSAP hover animation
  useGSAP(
    () => {
      if (!cardRef.current) {
        return;
      }

      const card = cardRef.current;

      gsap.set(card, {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      });

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          duration: 0.2,
          ease: 'power2.out',
        });
      });
    },
    { scope: cardRef },
  );

  // Helper to get embed URL for video platforms
  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct video file
    return url;
  };

  const isDirectVideoUrl = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  // Custom components for PortableText
  const portableTextComponents = {
    types: {
      image: ({ value }: { value: { asset: any; alt?: string; caption?: string } }) => {
        if (!value?.asset) {
          return null;
        }
        return (
          <div className="my-[var(--space-4)]">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={urlForImage(value.asset).width(800).height(450).url()}
                alt={value.alt || 'Post image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {value.caption && (
              <p className="mt-[var(--space-2)] text-center text-[var(--text-sm)] text-neutral-500">
                {value.caption}
              </p>
            )}
          </div>
        );
      },
      videoEmbed: ({ value }: { value: { url: string; caption?: string } }) => {
        if (!value?.url) {
          return null;
        }

        const embedUrl = getVideoEmbedUrl(value.url);
        const isDirect = isDirectVideoUrl(value.url);

        return (
          <div className="my-[var(--space-4)]">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900">
              {isDirect
                ? (
                    <video
                      src={embedUrl}
                      controls
                      className="h-full w-full"
                      preload="metadata"
                    >
                      <track kind="captions" />
                      Your browser does not support the video tag.
                    </video>
                  )
                : (
                    <iframe
                      src={embedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded video"
                    />
                  )}
            </div>
            {value.caption && (
              <p className="mt-[var(--space-2)] text-center text-[var(--text-sm)] text-neutral-500">
                {value.caption}
              </p>
            )}
          </div>
        );
      },
      linkPreview: ({ value }: { value: { url: string; title?: string; description?: string } }) => {
        if (!value?.url) {
          return null;
        }

        const domain = new URL(value.url).hostname.replace('www.', '');

        return (
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-[var(--space-4)] block overflow-hidden rounded-lg border border-neutral-200 transition-shadow hover:shadow-md"
          >
            <div className="p-[var(--space-4)]">
              {value.title && (
                <h4 className="mb-[var(--space-2)] text-[var(--text-base)] font-semibold text-neutral-900">
                  {value.title}
                </h4>
              )}
              {value.description && (
                <p className="mb-[var(--space-2)] text-[var(--text-sm)] text-neutral-600">
                  {value.description}
                </p>
              )}
              <div className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)] text-neutral-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span>{domain}</span>
              </div>
            </div>
          </a>
        );
      },
    },
  };

  return (
    <article
      ref={cardRef}
      className="relative w-full overflow-hidden rounded-xl bg-white"
    >
      {/* Author Header */}
      <div className="flex items-center gap-[var(--space-3)] p-[var(--space-4)]">
        {post.author.image && (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={urlForImage(post.author.image).width(40).height(40).url()}
              alt={post.author.image.alt || post.author.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-[var(--text-base)] font-semibold text-neutral-900">
            {post.author.name}
          </h3>
          <p className="text-[var(--text-sm)] text-neutral-500">
            {formattedDate}
          </p>
        </div>
        {post.featured && (
          <span className="rounded-full bg-neutral-900 px-[var(--space-3)] py-[var(--space-1)] text-[var(--text-xs)] font-medium text-white">
            Must Read
          </span>
        )}
      </div>

      {/* Post Content */}
      <div className="px-[var(--space-4)] pb-[var(--space-4)]">
        <div className="prose prose-neutral max-w-none text-[var(--text-base)] leading-relaxed text-neutral-800">
          <PortableText value={post.content} components={portableTextComponents} />
        </div>
      </div>

      {/* Standalone Images Carousel (if using images field) */}
      {post.images && post.images.length > 0 && (
        <div className="group/carousel relative">
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
            <Image
              src={urlForImage(post.images[currentImageIndex]!.asset).width(800).height(450).url()}
              alt={post.images[currentImageIndex]!.alt || 'Post image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            {post.images[currentImageIndex]!.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-sm)] text-white">
                {post.images[currentImageIndex]!.caption}
              </div>
            )}

            {/* Image Counter */}
            {post.images.length > 1 && (
              <div className="absolute right-[var(--space-3)] top-[var(--space-3)] rounded-full bg-black/60 px-[var(--space-3)] py-[var(--space-1)] text-[var(--text-xs)] font-medium text-white backdrop-blur-sm">
                {currentImageIndex + 1}
                {' '}
                /
                {post.images.length}
              </div>
            )}

            {/* Navigation Arrows */}
            {post.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-[var(--space-2)] top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-[var(--space-2)] opacity-0 shadow-lg transition-opacity hover:bg-white group-hover/carousel:opacity-100"
                  aria-label="Previous image"
                  type="button"
                >
                  <svg
                    className="h-5 w-5 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-[var(--space-2)] top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-[var(--space-2)] opacity-0 shadow-lg transition-opacity hover:bg-white group-hover/carousel:opacity-100"
                  aria-label="Next image"
                  type="button"
                >
                  <svg
                    className="h-5 w-5 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dot Indicators (mobile-friendly) */}
          {post.images.length > 1 && (
            <div className="flex justify-center gap-[var(--space-1)] py-[var(--space-2)]">
              {post.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-6 bg-neutral-900'
                      : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-[var(--space-2)] border-t border-neutral-100 px-[var(--space-4)] py-[var(--space-3)]">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-[var(--text-sm)] font-medium text-blue-600"
            >
              #
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
