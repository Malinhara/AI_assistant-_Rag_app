// item_model.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  filePath: { type: String, required: true }
});

const Item = mongoose.model('Item', ItemSchema); // Use singular for model name
module.exports = Item;
