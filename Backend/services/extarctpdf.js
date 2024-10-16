const Item = require('../model/item_model'); 
const pdf = require('pdf-parse'); // PDF parsing library
const { Pinecone } = require('@pinecone-database/pinecone');
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { PineconeStore } = require('@langchain/pinecone');
const { Document } = require('@langchain/core/documents'); // Import Document class
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique IDs
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Initialize Pinecone client
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

const uploadDir = path.join(__dirname, '../uploads'); 

const embedding = new HuggingFaceInferenceEmbeddings({
    model: 'intfloat/multilingual-e5-large',
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
});

class ExtractPdf {
  constructor() {}

  // Method to extract data from a PDF file based on its ID
  async extractData(id) {
    try {
      // Find the item by ID in the database
      const result = await Item.findById(id);

      if (!result) {
        throw new Error('Item not found');
      }

      // Get the file path from the result
      const filePath = path.join(uploadDir, result.filePath); // Ensure you correctly concatenate the path

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.log(`File path: ${filePath}`);
        throw new Error('File not found on the server');
      } else {
        // If file exists, proceed to add it to Pinecone
        console.log('File found, processing...');
        await this.addPdfToPinecone(filePath);
      }

    } catch (error) {
      throw error;
    }
  }

  // Method to connect to Pinecone
  async connectToPinecone() {
    const indexName = 'multilingual-e5-large';
    try {
      await pinecone.describeIndex(indexName); // Check if index exists
      console.log(`Index ${indexName} exists, using it.`);
      return pinecone.Index(indexName); // Return the existing index object
    } catch (error) {
      console.error(`Error connecting to Pinecone index:`, error.message);
      throw error;
    }
  }

  // Method to read a PDF and add its content to Pinecone
  async addPdfToPinecone(pdfFilePath) {
    try {
      const dataBuffer = fs.readFileSync(pdfFilePath);
      const data = await pdf(dataBuffer); // Extract text from PDF

      // Create a document with the extracted text
      const doc = new Document({
        pageContent: data.text, // Use the extracted text
        metadata: { id: uuidv4() }, // Generate a unique ID for the document
      });

      // Create a Pinecone store instance and upsert the document
      await PineconeStore.fromDocuments([doc], embedding, {
        pineconeIndex: pineconeIndex, // Pass the actual Pinecone index object
      });

      console.log('PDF content added to Pinecone successfully.');
    } catch (error) {
      console.error('Error adding PDF content to Pinecone:', error.message);
      throw error;
    }
  }
}

module.exports = ExtractPdf;
