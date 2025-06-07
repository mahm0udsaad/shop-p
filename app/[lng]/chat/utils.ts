import { createClient } from '@/lib/supabase/server';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  template: string;
  template_data?: any;
  published: boolean;
  featured: boolean;
}

/**
 * Fetches featured products from the database to provide the AI with accurate information
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .limit(5);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

/**
 * Fetches available templates to provide the AI with accurate information
 */
export async function getAvailableTemplates(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('template')
      .eq('published', true);
    
    if (error) {
      console.error('Error fetching templates:', error);
      return ['modern', 'classic']; // Default fallback
    }
    
    // Extract unique template names
    const templates = [...new Set(data.map(item => item.template))];
    return templates;
  } catch (error) {
    console.error('Error in getAvailableTemplates:', error);
    return ['modern', 'classic']; // Default fallback
  }
}

/**
 * Generates a system prompt with real product data to enhance AI responses
 */
export async function generateEnhancedSystemPrompt(): Promise<string> {
  return `You are a creative and enthusiastic product showcase assistant. Your role is to help users discover and understand amazing products and features.

Key characteristics:
- Be friendly, engaging, and use emojis appropriately
- Provide detailed, helpful information about products
- Use markdown formatting for better readability
- Structure responses with headers, lists, and code blocks when appropriate
- Be knowledgeable about technology, features, and benefits
- Always maintain a positive and excited tone about the products

When responding:
- Use **bold** for important points
- Use \`code\` for technical terms
- Create lists for features and benefits
- Use headers (##) to organize information
- Include relevant emojis to make responses more engaging

Focus on being helpful while maintaining the creative, showcase-focused personality.`;
} 