const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup file storage using Multer
const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to process image files with Tesseract
const processImage = async (filePath) => {
  try {
    const { data } = await tesseract.recognize(filePath, "eng");
    return data.text;
  } catch (err) {
    console.error("Tesseract error:", err);
    throw new Error("Failed to process image");
  }
};

// Helper function to process PDF files with pdf-parse
const processPDF = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (err) {
    console.error("PDF processing error:", err);
    throw new Error("Failed to process PDF");
  }
};

// Helper function to process DOCX files with Mammoth
const processDOCX = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  try {
    const data = await mammoth.extractRawText({ buffer: fileBuffer });
    return data.value;
  } catch (err) {
    console.error("DOCX processing error:", err);
    throw new Error("Failed to process DOCX");
  }
};

// Endpoint for file uploads and processing
app.post("/extract", upload.single("file"), async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.resolve(file.path);
  let extractedText = "";

  try {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      extractedText = await processImage(filePath);
    } else if (file.mimetype === "application/pdf") {
      extractedText = await processPDF(filePath);
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extractedText = await processDOCX(filePath);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Send extracted text to Gemini model for analysis
    const prompt = `Extract patient, hospital details, and dates from the following text:\n${extractedText}`;
    const result = await model.generateContent([prompt]);

    res.json({ extractedText, analyzedDetails: result.response.text() });
  } catch (error) {
    console.error("Error processing file:", error);
    if (error.status === 400 && error.statusText === 'Bad Request') {
      res.status(400).json({ error: "Invalid API key. Please provide a valid API key." });
    } else {
      res.status(500).json({ error: "Failed to process file" });
    }
  } finally {
    // Cleanup uploaded file
    fs.unlinkSync(filePath);
  }
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await model.generateContent([prompt]);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    if (error.status === 400 && error.statusText === 'Bad Request') {
      res.status(400).json({ error: "Invalid API key. Please provide a valid API key." });
    } else {
      res.status(500).json({ error: "Failed to generate content" });
    }
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
