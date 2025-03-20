// We don't actually need to initialize the client here since
// we're using the REST API directly in our backend

// For future expansion if needed, we could use the Pinecone service
// to index custom content directly

export const queryAssistant = async (
  assistantId: string,
  query: string,
  apiKey: string
) => {
  try {
    // Call Pinecone Assistant API
    const response = await fetch(
      `https://api.pinecone.io/assistants/${assistantId}/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: query,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to query assistant: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error querying Pinecone assistant:', error);
    throw error;
  }
};

// Function to retrieve context snippets
export const getContextSnippets = async (
  assistantId: string,
  query: string,
  apiKey: string
) => {
  try {
    // Use the REST API to get context snippets
    const response = await fetch(
      `https://api.pinecone.io/assistants/${assistantId}/context-snippets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
        body: JSON.stringify({
          query,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to retrieve context snippets: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving context snippets:', error);
    throw error;
  }
}; 