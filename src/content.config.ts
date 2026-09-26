import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Courses, FAQ and testimonials as content collections rather than
// hardcoded page markup — see CLAUDE.md "Content collections". Everything
// under `status: 'review'` is a first draft built from the owner's 2026
// content briefs and the legacy database; it still needs the owner's
// sign-off (PLAN.md §11) before `status` can move to 'confirmed'.

const courses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    tagline: z.string(),
    duration: z.string(),
    format: z.string(),
    level: z.string(),
    // Free text, not a typed amount: several source prices are still net-of-VAT
    // or disputed between documents. Write "TBC — …" until a single gross
    // figure is confirmed. Never invent a gross price by multiplying by 1.19.
    price: z.string(),
    certificate: z.string().optional(),
    status: z.enum(['review', 'confirmed']),
    // Freeform notes on what's provisional and why — surfaced on the page
    // itself while status is 'review' so the owner sees exactly what to check.
    reviewNotes: z.array(z.string()).default([]),
    // Required together: a course can ship with no hero image, but never
    // with an image and no alt text.
    heroImage: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
    status: z.enum(['review', 'confirmed']).default('review'),
  }),
});

// No entries yet, deliberately: CLAUDE.md forbids inventing testimonials,
// even as placeholder copy (§5b Abs. 3 UWG). Add real ones here once the
// owner supplies them, with consent for any published name/photo.
const testimonials = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    quote: z.string(),
  }),
});

export const collections = { courses, faq, testimonials };
