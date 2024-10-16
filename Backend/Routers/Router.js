const express = require('express');
const PdfController = require('../controller/extract'); // Adjust path as necessary
const answerController = require('../controller/pdfgenerate')
const ExtractPdf = require('../services/extarctpdf'); // Adjust path as necessary
const answerService =  require('../services/generate')

const router = express.Router();

// Create an instance of the service
const extractPdfService = new ExtractPdf();
const answer_Service =  new answerService()
// Create an instance of the controller, injecting the service
const pdfController = new PdfController(extractPdfService);
const answer_controller =  new answerController(answer_Service)
// Define the route
router.post('/find/:id', (req, res) => pdfController.extractData(req, res));
router.post('/generate', (req,res) => answer_controller.answer(req,res));
// Use CommonJS export
module.exports = router;
