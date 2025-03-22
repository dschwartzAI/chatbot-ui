import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Folder containing your knowledge base files
const KNOWLEDGE_DIR = process.env.KNOWLEDGE_DIR || path.join(__dirname, '../knowledge');

// Vector store name
const VECTOR_STORE_NAME = 'james-kemps-knowledge';

/**
 * Upload a single file to OpenAI
 */
async function uploadFile(filePath: string) {
  try {
    console.log(`Uploading file: ${filePath}`);
    
    const fileStream = fs.createReadStream(filePath);
    const response = await openai.files.create({
      file: fileStream,
      purpose: 'assistants',
    });
    
    console.log(`File uploaded successfully with ID: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error(`Error uploading file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Create a vector store
 */
async function createVectorStore(name: string) {
  try {
    console.log(`Creating vector store: ${name}`);
    
    const vectorStore = await openai.vectorStores.create({
      name: name,
    });
    
    console.log(`Vector store created successfully with ID: ${vectorStore.id}`);
    return vectorStore.id;
  } catch (error) {
    console.error(`Error creating vector store ${name}:`, error);
    throw error;
  }
}

/**
 * Add a file to a vector store
 */
async function addFileToVectorStore(vectorStoreId: string, fileId: string) {
  try {
    console.log(`Adding file ${fileId} to vector store ${vectorStoreId}`);
    
    await openai.vectorStores.files.create(
      vectorStoreId,
      { file_id: fileId }
    );
    
    console.log(`File added successfully to vector store`);
  } catch (error) {
    console.error(`Error adding file to vector store:`, error);
    throw error;
  }
}

/**
 * Check the status of files in a vector store
 */
async function checkFileStatus(vectorStoreId: string) {
  try {
    console.log(`Checking file status in vector store ${vectorStoreId}`);
    
    const response = await openai.vectorStores.files.list(vectorStoreId);
    
    console.log(`Vector store files status:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error checking file status:`, error);
    throw error;
  }
}

/**
 * Main function to set up the OpenAI vector store
 */
async function setupVectorStore() {
  try {
    // Check if knowledge directory exists
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      console.error(`Knowledge directory ${KNOWLEDGE_DIR} does not exist`);
      return;
    }
    
    // Get all files in the knowledge directory
    const files = fs.readdirSync(KNOWLEDGE_DIR);
    const supportedExtensions = ['.txt', '.pdf', '.md', '.docx'];
    const knowledgeFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });
    
    if (knowledgeFiles.length === 0) {
      console.error(`No supported files found in ${KNOWLEDGE_DIR}`);
      return;
    }
    
    console.log(`Found ${knowledgeFiles.length} files to process`);
    
    // Create vector store
    const vectorStoreId = await createVectorStore(VECTOR_STORE_NAME);
    
    // Upload files and add to vector store
    for (const file of knowledgeFiles) {
      const filePath = path.join(KNOWLEDGE_DIR, file);
      const fileId = await uploadFile(filePath);
      await addFileToVectorStore(vectorStoreId, fileId);
    }
    
    // Check status
    await checkFileStatus(vectorStoreId);
    
    console.log('\nSetup completed successfully!');
    console.log('---------------------------------------');
    console.log(`Vector Store ID: ${vectorStoreId}`);
    console.log(`Add this ID to your .env.local file as OPENAI_VECTOR_STORE_ID`);
    console.log('---------------------------------------');
  } catch (error) {
    console.error('Error setting up vector store:', error);
  }
}

// Run the setup
setupVectorStore(); 