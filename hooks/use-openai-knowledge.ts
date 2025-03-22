import { useState } from 'react';

export const useOpenAIKnowledge = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOpenAIResponse = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('useOpenAIKnowledge: Sending query to API:', query);
      
      // Use relative URL to avoid port issues
      const response = await fetch('/api/openai-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to get response from OpenAI knowledge API';
        console.error('useOpenAIKnowledge: API error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('useOpenAIKnowledge: Received response from API:', data);
      return data;
    } catch (err) {
      console.error('Error getting OpenAI knowledge response:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getOpenAIResponse,
    isLoading,
    error
  };
}; 