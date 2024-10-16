// controllers/pdfController.js
const ExtractPdf = require("../services/extarctpdf");

const extractpdf =new ExtractPdf();

class PdfController {
  
    async extractData(req, res) {
        const id = req.params.id;
        console.log(id)

      try {
     
        const newItem = await extractpdf.extractData(id); // Use the injected service instance
        res.status(200).json(newItem); // Respond with the item
      } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
      }
    }
  }
  
  // Export using CommonJS syntax
  module.exports = PdfController;
  