const express = require('express');
const axios = require('axios');
const pdfPoppler = require('pdf-poppler');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 📌 Fetch PDF from URL and Save Temporarily
async function downloadPdfFromUrl(pdfUrl, savePath) {
    const response = await axios({
        method: 'GET',
        url: pdfUrl,
        responseType: 'arraybuffer',
    });

    fs.writeFileSync(savePath, Buffer.from(response.data));
}

// 📌 Convert Signed PDF to Images
async function convertPdfToImages(pdfPath, outputFolder) {
    console.log(`📌 Converting PDF to images: ${pdfPath}`);

    const options = {
        format: 'png', // Force PNG output
        out_dir: outputFolder,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null // Convert all pages
    };

    try {
        await pdfPoppler.convert(pdfPath, options);
        console.log("✅ PDF converted successfully!");
    } catch (error) {
        console.error("🚨 PDF Conversion Failed:", error);
        throw new Error("❌ Failed to convert PDF to images. Check Poppler installation.");
    }
}


// 📌 Create New PDF with Base64 Overlay
async function createPdfFromImages(imagePaths, outputPdfPath, base64Overlay) {
    try {
        console.log("outputPdfPath", outputPdfPath);


        // Ensure the directory exists
        const outputDir = path.dirname(outputPdfPath);
        if (!fs.existsSync(outputDir)) {
            console.log("🚀 Creating missing directory:", outputDir);
            fs.mkdirSync(outputDir, { recursive: true }); // Create the folder if it doesn't exist
        }

        const pdfDoc = await PDFDocument.create();

        for (let imagePath of imagePaths) {
            console.log("imagePath", imagePath);
            const page = pdfDoc.addPage([600, 800]); // Adjust based on image size
            // const imageBytes = fs.readFileSync(imagePath);

            const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
            // console.log("imageBase64", imageBase64);
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            console.log("imageBuffer", imageBuffer);

            const embeddedImage = await pdfDoc.embedPng(imageBuffer);

            // Draw the original page image
            page.drawImage(embeddedImage, { x: 0, y: 0, width: 600, height: 800 });

            // Decode Base64 Overlay and Add to PDF
            const overlayBuffer = Buffer.from(base64Overlay, 'base64');
            const embeddedOverlay = await pdfDoc.embedPng(overlayBuffer);
            page.drawImage(embeddedOverlay, { x: 100, y: 100, width: 200, height: 100 }); // Adjust position
        }

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPdfPath, pdfBytes);
    } catch (error) {
        console.error('Error createPdfFromImages PDF:', error);
    }

}

// 📌 API: Process PDF from URL & Overlay Base64 Image
app.post('/process-pdf', async(req, res) => {
    try {

        const { pdfUrl, overlayBase64 } = req.body;
        if (!pdfUrl || !overlayBase64) {
            return res.status(400).json({ error: "Missing PDF URL or Base64 overlay data" });
        }

        const pdfPath = 'uploads/original.pdf';
        const outputFolder = 'converted_images';
        const outputPdfPath = 'modified_signed.pdf';

        // Step 1: Download the Signed PDF
        await downloadPdfFromUrl(pdfUrl, pdfPath);

        // Step 2: Convert PDF to Images
        await convertPdfToImages(pdfPath, outputFolder);

        // Step 3: Get All Converted Images
        const imagePaths = fs.readdirSync(outputFolder)
            .filter(file => file.endsWith('.png'))
            .map(file => path.join(outputFolder, file));

        // Step 4: Generate a New PDF with Overlay
        await createPdfFromImages(imagePaths, outputPdfPath, overlayBase64);

        // Step 5: Send the Modified PDF to Frontend
        res.download(outputPdfPath);
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).send('Error processing PDF');
    }
});

// 📌 Start Backend Server
app.listen(5000, () => console.log('Backend running on port 5000'));