'use server';
/**
 * @fileOverview A Genkit flow for natural language product search.
 *
 * - naturalLanguageProductSearch - A function that processes a natural language query
 *   to identify relevant product categories.
 * - NaturalLanguageProductSearchInput - The input type for the flow.
 * - NaturalLanguageProductSearchOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the natural language product search flow
const NaturalLanguageProductSearchInputSchema = z.object({
  query: z.string().describe('The natural language query from the user.'),
});
export type NaturalLanguageProductSearchInput = z.infer<typeof NaturalLanguageProductSearchInputSchema>;

// Output schema for the natural language product search flow
const NaturalLanguageProductSearchOutputSchema = z.object({
  categories: z.array(z.enum(['all', 'ghee', 'combo', 'sweets', 'honey', 'superfoods'])).describe('A list of product categories that match the query.'),
});
export type NaturalLanguageProductSearchOutput = z.infer<typeof NaturalLanguageProductSearchOutputSchema>;

// Exported wrapper function for the flow
export async function naturalLanguageProductSearch(
  input: NaturalLanguageProductSearchInput
): Promise<NaturalLanguageProductSearchOutput> {
  return naturalLanguageProductSearchFlow(input);
}

// Define the prompt for the natural language product search
const naturalLanguageProductSearchPrompt = ai.definePrompt({
  name: 'naturalLanguageProductSearchPrompt',
  input: { schema: NaturalLanguageProductSearchInputSchema },
  output: { schema: NaturalLanguageProductSearchOutputSchema },
  prompt: `You are a helpful assistant for Vivaan Farms.
The user is searching for products with the following query: "{{{query}}}".

Your task is to identify the most relevant product categories from the following list: 'all', 'ghee', 'combo', 'sweets', 'honey', 'superfoods'.
- If the query specifically mentions or strongly implies one or more categories, return those.
- If the query mentions "mithai" or "sweets", return 'sweets'.
- If the query mentions "honey", return 'honey'.
- If the query is very general or broad (e.g., "all products", "any item"), return 'all'.
- If the query implies multiple categories (e.g., "healthy breakfast items"), return all relevant categories.

Your response MUST be a JSON object conforming to the following schema:
{
  "categories": ["category1", "category2"]
}
Do NOT include any other text or explanation, only the JSON object.

Examples:
- User query: "sweets for guests"
- Expected JSON output: { "categories": ["sweets"] }

- User query: "honey for weight loss"
- Expected JSON output: { "categories": ["honey"] }

- User query: "ghee for daily cooking"
- Expected JSON output: { "categories": ["ghee"] }

Respond with the JSON object for the query: "{{{query}}}"
`,
});

// Define the Genkit flow
const naturalLanguageProductSearchFlow = ai.defineFlow(
  {
    name: 'naturalLanguageProductSearchFlow',
    inputSchema: NaturalLanguageProductSearchInputSchema,
    outputSchema: NaturalLanguageProductSearchOutputSchema,
  },
  async (input): Promise<NaturalLanguageProductSearchOutput> => {
    try {
      const { output } = await naturalLanguageProductSearchPrompt(input);
      if (output && Array.isArray(output.categories) && output.categories.length > 0) {
        return output;
      }
      return { categories: ['all'] };
    } catch (err) {
      console.warn("AI Search failed, falling back to basic matching:", err instanceof Error ? err.message : String(err));
      const queryLower = (input.query || '').toLowerCase();
      const categories: ('all' | 'ghee' | 'combo' | 'sweets' | 'honey' | 'superfoods')[] = [];
      if (queryLower.includes('ghee')) categories.push('ghee');
      if (queryLower.includes('sweet') || queryLower.includes('mithai')) categories.push('sweets');
      if (queryLower.includes('honey')) categories.push('honey');
      if (categories.length === 0) categories.push('all');
      return { categories };
    }
  }
);
