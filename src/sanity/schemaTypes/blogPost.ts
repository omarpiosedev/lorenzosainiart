import { defineArrayMember, defineField, defineType } from 'sanity';

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (Optional)',
      type: 'string',
      description: 'Optional - Leave empty for text-only posts',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'publishedAt',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Click "Generate" to auto-create from date',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Display "Must Read" badge',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Must Read', value: 'must-read' },
          { title: 'Latest', value: 'latest' },
          { title: 'Events', value: 'events' },
          { title: 'Behind the Scenes', value: 'behind-the-scenes' },
          { title: 'Photography Tips', value: 'photography-tips' },
        ],
      },
      initialValue: 'latest',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images (Optional)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        }),
      ],
      options: {
        layout: 'grid',
      },
      description: 'Optional - Add images if needed',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description: 'Main post content (preserves formatting)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Add hashtags (without #)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
      author: 'author.name',
      media: 'images.0',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { title, content, author, publishedAt } = selection;
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('it-IT') : 'No date';

      // Use title if exists, otherwise use first 50 chars of content
      const displayTitle = title || (`${content?.[0]?.children?.[0]?.text?.slice(0, 50)}...` || 'Untitled Post');

      return {
        ...selection,
        title: displayTitle,
        subtitle: `${author || 'No author'} • ${date}`,
      };
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
});
