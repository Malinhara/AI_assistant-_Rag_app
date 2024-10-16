const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs for file system operations
const Item = require('../Backend/model/item_model'); // Import your item model
const dbconnection = require('../Backend/Routers/dbconnection');
const router = require('./Routers/Router');
const app = express();
const PORT = process.env.PORT || 3001;
// Define the route


dbconnection();

// Directory for uploads
const uploadDir = path.join(__dirname, '../uploads');

// Check if upload directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create uploads directory
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage });

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB

// POST route to create an item with a file upload
app.post('/create', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const newItem = await Item.create({ 
      filePath: file.path, // Ensure your model has this field
    });
    return res.status(201).json({ message: 'PDF added successfully', item: newItem });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating item', details: error.message });
  }
});

// DELETE route to delete an item by ID
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
    const result = await Item.findByIdAndDelete(id); // Use findByIdAndDelete for better handling
    if (!result) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully', item: result });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item', details: error.message });
  }
});

// GET route to view all items
app.get('/view', async (req, res) => {
  try {
    const pdfs = await Item.find();
    res.status(200).json({ pdfs }); // Use status 200 for successful retrieval
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving items', details: error.message });
  }
});

//RAG part
app.use('/pdf',router);
app.use('/chat',router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
