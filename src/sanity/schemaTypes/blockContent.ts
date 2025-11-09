import { defineArrayMember, defineType } from 'sanity';

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: Rule =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'Video URL',
          description: 'YouTube, Vimeo, or direct video link',
          validation: Rule => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
      preview: {
        select: {
          url: 'url',
        },
        prepare(selection: Record<string, any>) {
          return {
            title: 'Video',
            subtitle: selection.url,
          };
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'linkPreview',
      title: 'Link Preview',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'URL',
          description: 'Link to preview',
          validation: Rule => Rule.required(),
        },
        {
          name: 'title',
          type: 'string',
          title: 'Title (optional)',
          description: 'Override title',
        },
        {
          name: 'description',
          type: 'text',
          title: 'Description (optional)',
          rows: 2,
        },
      ],
      preview: {
        select: {
          url: 'url',
          title: 'title',
        },
        prepare(selection: Record<string, any>) {
          return {
            title: selection.title || 'Link Preview',
            subtitle: selection.url,
          };
        },
      },
    }),
  ],
});
