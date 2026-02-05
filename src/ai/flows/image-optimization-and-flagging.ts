'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing and flagging images.
 *
 * The flow takes an image data URI as input, checks if it meets the required format standards,
 * and optimizes it. If the image does not meet the standards, it is flagged for further attention.
 *
 * @exports {
 *   optimizeImageAndFlag - The main function to optimize and flag images.
 *   ImageOptimizationInput - The input type for the optimizeImageAndFlag function.
 *   ImageOptimizationOutput - The output type for the optimizeImageAndFlag function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageOptimizationInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'A photo to be optimized, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
});
export type ImageOptimizationInput = z.infer<typeof ImageOptimizationInputSchema>;

const ImageOptimizationOutputSchema = z.object({
  optimizedImageDataUri: z
    .string()
    .describe(
      'The optimized image as a data URI, or null if optimization failed.'
    )
    .nullable(),
  meetsStandards: z.boolean().describe('Whether the image meets format standards.'),
  flagForReview: z.boolean().describe('Whether the image should be flagged for manual review.'),
  reason: z.string().describe('Reason why the image was flagged, if applicable.').optional(),
});
export type ImageOptimizationOutput = z.infer<typeof ImageOptimizationOutputSchema>;

export async function optimizeImageAndFlag(
  input: ImageOptimizationInput
): Promise<ImageOptimizationOutput> {
  return optimizeImageAndFlagFlow(input);
}

const checkImageFormatTool = ai.defineTool({
  name: 'checkImageFormat',
  description: 'Checks if the image meets the required format standards.',
  inputSchema: z.object({
    imageDataUri: z
      .string()
      .describe(
        'The image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
      ),
  }),
  outputSchema: z.object({
    meetsStandards: z.boolean().describe('Whether the image meets format standards.'),
    reason: z.string().describe('Reason why the image does not meet standards.').optional(),
  }),
},
async (input) => {
  // Basic check (can be expanded with more sophisticated checks)
  const isValidBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  const base64Content = input.imageDataUri.split(',')[1];

  if (!base64Content || !isValidBase64.test(base64Content)) {
    return { meetsStandards: false, reason: 'Invalid Base64 format' };
  }

  const mimeType = input.imageDataUri.split(';')[0].split(':')[1];
  if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    return {
      meetsStandards: false,
      reason: 'Unsupported MIME type.  Must be JPEG, PNG, or WEBP.',
    };
  }

  return { meetsStandards: true };
}
);

const optimizeImagePrompt = ai.definePrompt({
  name: 'optimizeImagePrompt',
  input: { schema: ImageOptimizationInputSchema },
  output: { schema: ImageOptimizationOutputSchema },
  tools: [checkImageFormatTool],
  prompt: `You are an image optimization expert. You will receive an image as a data URI.

  First, use the checkImageFormat tool to validate the image format.

  If the image does not meet the format standards (e.g., invalid format, unsupported MIME type), set flagForReview to true and provide a reason.

  If the image meets the format standards, attempt to optimize the image.

  For now, image optimization is stubbed out, so just return the original image data URI as optimizedImageDataUri.
  In the future, this will perform actual image optimization techniques (e.g., compression, resizing).

  Here is the image data URI: {{imageDataUri}}
  `,
});

const optimizeImageAndFlagFlow = ai.defineFlow(
  {
    name: 'optimizeImageAndFlagFlow',
    inputSchema: ImageOptimizationInputSchema,
    outputSchema: ImageOptimizationOutputSchema,
  },
  async input => {
    const { output } = await optimizeImagePrompt(input);

    // Ensure meetsStandards and flagForReview are properly set based on tool results or other logic
    let meetsStandards = false;
    let flagForReview = false;
    let reason: string | undefined = undefined;

    const toolResult = await checkImageFormatTool(input);

    meetsStandards = toolResult.meetsStandards;
    if (!meetsStandards) {
      flagForReview = true;
      reason = toolResult.reason;
    }

    return {
      optimizedImageDataUri: input.imageDataUri, // Stubbed: In the future, this will contain optimized image data URI
      meetsStandards: meetsStandards,
      flagForReview: flagForReview,
      reason: reason,
    };
  }
);
