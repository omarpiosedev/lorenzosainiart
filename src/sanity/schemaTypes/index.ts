import type { SchemaTypeDefinition } from 'sanity';
import { authorType } from './author';
import { blockContentType } from './blockContent';
import { blogPostType } from './blogPost';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [authorType, blockContentType, blogPostType],
};
