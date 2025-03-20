import { useState } from 'react';

export const usePineconeKnowledge = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPineconeResponse = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use relative URL to avoid port issues
      const response = await fetch('/api/pinecone/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from Pinecone');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting Pinecone response:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getKnowledgeSnippets = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use relative URL to avoid port issues
      const response = await fetch('/api/pinecone/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get context snippets');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting knowledge snippets:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPineconeResponse,
    getKnowledgeSnippets,
    isLoading,
    error
  };
}; 