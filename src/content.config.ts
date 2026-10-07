import { defineCollection, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

// Courses, FAQ and testimonials are content collections rather than
// hardcoded page markup.

const courseSchema = ({ image }: SchemaContext) =>
  z
    .object({
      title: z.string(),
      order: z.number(),
      tagline: z.string(),
      duration: z.string(),
      format: z.string(),
      level: z.string(),
      // Free text so each language can phrase the gross price, e.g.
      // "€7,140 (inclusive of 19% VAT)".
      price: z.string(),
      certificate: z.string().optional(),
      // `image()` validates the path resolves to a real asset and gives Astro
      // an optimizable reference; kept as two fields (not one object) because
      // content-collection `image()` helpers can't be nested inside z.object().
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
    })
    .refine((data) => !data.heroImage || !!data.heroImageAlt, {
      message: 'heroImageAlt is required whenever heroImage is set',
      path: ['heroImageAlt'],
    });

const courses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courses' }),
  schema: courseSchema,
});

// German translations of the course pages, same ids as `courses`.
const coursesDe = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courses-de' }),
  schema: courseSchema,
});

const faq = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
  }),
});

// Only real testimonials, with consent for any published name or photo.
const testimonials = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    quote: z.string(),
  }),
});

export const collections = { courses, coursesDe, faq, testimonials };
