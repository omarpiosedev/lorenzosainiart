# Sanity CMS Setup Guide

Complete guide to configure and use Sanity CMS for the blog.

---

## 🚀 Quick Start

### 1. Create a Sanity Account

1. Visit [sanity.io](https://sanity.io)
2. Sign up with your email or GitHub account
3. Create a new project when prompted

### 2. Get Your Project Credentials

After creating your project:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Copy the **Project ID** and **Dataset** name (usually `production`)

### 3. Configure Environment Variables

Update the `.env.local` file in the project root:

```bash
# Replace with your actual Sanity credentials
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

### 4. Initialize Sanity Studio

Run the following command to initialize Sanity in your project:

```bash
# Install Sanity CLI globally (if not already installed)
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Initialize the project (use existing project ID)
sanity init --project <YOUR_PROJECT_ID> --dataset production
```

**Important:** When prompted, select "Use existing project" and choose your project.

### 5. Start Development Server

```bash
npm run dev
```

Your app will be available at:
- **Main site:** http://localhost:3000
- **Sanity Studio:** http://localhost:3000/studio

---

## 📝 Content Management

### Creating Your First Blog Post

1. **Access Sanity Studio:**
   - Navigate to `http://localhost:3000/studio`
   - You'll see the Sanity Studio interface

2. **Create an Author (First Time Only):**
   - Click on "Author" in the left sidebar
   - Click "Create new Author"
   - Fill in:
     - Name: `Lorenzo Saini`
     - Slug: `lorenzo-saini` (auto-generated)
     - Profile Image: Upload your photo
     - Bio: Short bio
     - Role: `Videomaker e Fotografo`
   - Click "Publish"

3. **Create a Blog Post:**
   - Click on "Blog Post" in the left sidebar
   - Click "Create new Blog Post"
   - Fill in the fields:
     - **Title:** Main post title (e.g., "Behind the scenes at Milano Premier Padel")
     - **Subtitle:** Optional subtitle/excerpt
     - **Slug:** Auto-generated from title
     - **Author:** Select "Lorenzo Saini"
     - **Featured:** Toggle ON for "Must Read" badge
     - **Category:** Choose category (Must Read, Latest, Events, etc.)
     - **Images:** Upload 1 or more images (supports gallery)
     - **Content:** Rich text editor for main content
     - **Tags:** Add hashtags (without #, e.g., "premierpadel", "milano", "photographer")
     - **Published at:** Date and time
   - Click "Publish"

### Managing Content

- **Edit Post:** Click on any post and modify fields, then click "Publish"
- **Delete Post:** Click the three dots (...) → "Delete"
- **Unpublish:** Click "Unpublish" to hide from public (remains in drafts)

---

## 🎨 Blog Features

### LinkedIn-Style Feed

The blog displays posts in a LinkedIn-inspired feed:

- **Author profile** with photo and role
- **Featured badge** ("Must Read") for important posts
- **Image gallery** with navigation arrows
- **Hashtags** clickable and visible
- **Date** formatted by locale (IT/EN)
- **GSAP animations** on scroll

### Image Handling

- **Multiple images per post:** Upload as many as you want
- **Gallery navigation:** Users can browse through images
- **Optimized delivery:** Sanity CDN automatically optimizes images
- **Alt text:** Always add for accessibility

### Categories Available

1. **Must Read** - Featured/important posts
2. **Latest** - Recent updates
3. **Events** - Event coverage
4. **Behind the Scenes** - Process/workflow posts
5. **Photography Tips** - Educational content

---

## 🔧 Advanced Configuration

### Customizing Schema

Edit schema files in `src/sanity/schemaTypes/`:

- **blogPost.ts** - Blog post structure
- **author.ts** - Author profile
- **blockContent.ts** - Rich text editor config

### Adding New Fields

1. Open `src/sanity/schemaTypes/blogPost.ts`
2. Add a new field using `defineField()`:

```typescript
defineField({
  name: 'newField',
  title: 'New Field',
  type: 'string',
})
```

3. Restart dev server
4. Field appears in Sanity Studio

### Image Optimization

Modify image settings in `src/sanity/lib/image.ts`:

```typescript
export function urlForImage(source: SanityImageSource) {
  return builder
    .image(source)
    .auto('format')
    .fit('max')
    .width(1200) // Add custom width
    .quality(90); // Adjust quality
}
```

---

## 🌐 Multilingual Support

The blog is i18n-ready:

- **Translations:** Edit `src/locales/it.json` and `src/locales/en.json`
- **Blog Hero:** Translated in both languages
- **Post content:** Can be language-specific (add locale field to schema)

### Adding Locale to Posts (Optional)

1. Edit `src/sanity/schemaTypes/blogPost.ts`
2. Add locale field:

```typescript
defineField({
  name: 'locale',
  title: 'Language',
  type: 'string',
  options: {
    list: [
      { title: 'Italian', value: 'it' },
      { title: 'English', value: 'en' },
    ],
  },
  initialValue: 'it',
})
```

3. Filter posts by locale in `src/app/[locale]/blog/page.tsx`:

```typescript
const POSTS_QUERY = `*[_type == "blogPost" && locale == $locale] | order(publishedAt desc) { ... }`;
const posts = await client.fetch<BlogPost[]>(POSTS_QUERY, { locale });
```

---

## 🚢 Deployment

### Environment Variables (Production)

Add these to your hosting platform (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

### Deploy Sanity Studio

#### Option 1: Self-hosted (Current Setup)
Studio is already at `/studio` route - no additional deployment needed.

#### Option 2: Separate Deployment
To deploy Studio separately:

```bash
# Navigate to project root
cd /path/to/project

# Deploy to Sanity's hosting
sanity deploy
```

Studio will be available at `https://your-project.sanity.studio`

### CORS Configuration

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project → API → CORS Origins
3. Add your production URL:
   - Origin: `https://yourdomain.com`
   - Allow credentials: ✅

---

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/next-js-quickstart)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Image URL Builder](https://www.sanity.io/docs/image-url)

---

## 🐛 Troubleshooting

### "Project ID not found"
- Check `.env.local` file exists and has correct credentials
- Restart dev server after changing env variables

### "CORS error"
- Add your localhost URL to CORS settings in Sanity dashboard
- For localhost: `http://localhost:3000`

### "No posts showing"
- Ensure you've published at least one post in Sanity Studio
- Check browser console for errors
- Verify GROQ query in `src/app/[locale]/blog/page.tsx`

### "Studio not loading"
- Clear browser cache
- Check if `/studio` route is accessible
- Verify `sanity.config.ts` has correct project ID

---

## ✅ Next Steps

1. **Create demo content:**
   - Create Author profile
   - Add 3-5 sample blog posts
   - Upload images with proper alt text

2. **Customize design:**
   - Adjust colors in BlogPostCard
   - Modify typography in BlogHero
   - Add custom GSAP animations

3. **SEO optimization:**
   - Add blog post slug pages (`/blog/[slug]`)
   - Implement JSON-LD structured data
   - Add Open Graph images per post

4. **Analytics:**
   - Track post views
   - Monitor popular tags
   - Analyze engagement

---

**Need help?** Check Sanity's [community forum](https://www.sanity.io/community) or [Discord](https://slack.sanity.io/).
