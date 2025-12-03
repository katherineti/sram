'use server';
/**
 * @fileOverview Generates content suggestions for the landing page carousel.
 *
 * - generateLandingPageCarouselContent - A function that suggests content for the landing page carousel.
 * - LandingPageCarouselContentInput - The input type for the generateLandingPageCarouselContent function.
 * - LandingPageCarouselContentOutput - The return type for the generateLandingPageCarouselContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LandingPageCarouselContentInputSchema = z.object({
  karateEventDescription: z
    .string()
    .describe('A description of karate events to generate content for.'),
  karateCompetitionDescription: z
    .string()
    .describe('A description of karate competitions to generate content for.'),
});
export type LandingPageCarouselContentInput = z.infer<
  typeof LandingPageCarouselContentInputSchema
>;

const LandingPageCarouselContentOutputSchema = z.object({
  karateEventMediaSuggestion: z
    .string()
    .describe(
      'A suggestion for media content (image or video URL) for karate events.'
    ),
  karateCompetitionMediaSuggestion: z
    .string()
    .describe(
      'A suggestion for media content (image or video URL) for karate competitions.'
    ),
});
export type LandingPageCarouselContentOutput = z.infer<
  typeof LandingPageCarouselContentOutputSchema
>;

export async function generateLandingPageCarouselContent(
  input: LandingPageCarouselContentInput
): Promise<LandingPageCarouselContentOutput> {
  return generateLandingPageCarouselContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'landingPageCarouselContentPrompt',
  input: {schema: LandingPageCarouselContentInputSchema},
  output: {schema: LandingPageCarouselContentOutputSchema},
  prompt: `You are an expert in generating engaging content suggestions for landing pages, especially for sports-related websites. Your goal is to suggest appropriate media content (image or video) for a landing page carousel.

You will receive descriptions for both karate events and karate competitions. Based on these descriptions, suggest a specific URL for a placeholder image from picsum.photos that would be suitable for each section of the carousel. The image size should be 800x1000.

Karate Event Description: {{{karateEventDescription}}}
Karate Competition Description: {{{karateCompetitionDescription}}}

Respond with specific media URLs for each category. Do not include descriptive text. Only provide the URL.
`,
});

const generateLandingPageCarouselContentFlow = ai.defineFlow(
  {
    name: 'generateLandingPageCarouselContentFlow',
    inputSchema: LandingPageCarouselContentInputSchema,
    outputSchema: LandingPageCarouselContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
