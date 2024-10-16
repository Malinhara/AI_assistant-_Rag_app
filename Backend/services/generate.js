
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { PineconeStore } = require('@langchain/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const ExtractPdf = require("../services/extarctpdf");

const extractpdf = new ExtractPdf();
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Initialize embeddings
const embedding = new HuggingFaceInferenceEmbeddings({
    model: 'intfloat/multilingual-e5-large',
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
});

class GenerateAnswer {

  async answer(prompt) {
    try {
      // First, establish a connection to Pinecone
      const connectdb = await extractpdf.connectToPinecone();
      
      if (connectdb) {
        // Check if the prompt is provided
        if (!prompt) {
          throw new Error('Prompt is required');
        }

        // Retrieve relevant chunks based on the prompt
        const relevantChunks = await this.retrieveRelevantChunks(prompt);
        const context = relevantChunks.length > 0 ? relevantChunks.join(' ') : '';
 
        // Prepare input for generation model
        const inputs = [`Context: ${context}\nQuestion: ${prompt}`];

        // Generate answer using your model
        const generationResponse = await model.generateContent(inputs);
        const contentText = generationResponse.response.candidates[0].content.parts[0].text;

        // Return the generated content
        return {
          answer: contentText,
        };

      } else {
        throw new Error("Failed to connect to Pinecone.");
      }

    } catch (error) {
      // Throw the error so the controller can handle it
      throw new Error(`Error in answer generation: ${error.message}`);
    }
  }



  async retrieveRelevantChunks(prompt) {

 
    const vectorStore = await PineconeStore.fromExistingIndex(embedding, {
      pineconeIndex,
      maxConcurrency: 5,
    });
    console.log("retriever")
    try {
      const retriever = vectorStore.asRetriever({ k: 3 }); // Number of top results to return
      const queryResult = await retriever.invoke(prompt);

      console.log(queryResult)
      
      // Extract and return the page contents
      const pageContents = queryResult.map(match => match.pageContent);
      console.log("retriever")
      return pageContents;

    } catch (err) {
      console.error('Error retrieving relevant chunks:', err.message);
      return [];
    }
  }

  // Method to retrieve relevant chunks from Pinecone


}

module.exports = GenerateAnswer;
