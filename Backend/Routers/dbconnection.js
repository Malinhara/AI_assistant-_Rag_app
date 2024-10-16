// dbConnect.js
const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connect("mongodb://localhost:27017/assistant", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to Local MongoDB'))
    .catch(err => console.error('Error connecting to Local MongoDB:', err));
};

module.exports = connectDB;
