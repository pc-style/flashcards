import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ollama from 'ollama';

const app = express();
const port = 3004;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload and image processing
app.post('/upload', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;

    try {
        const response = await ollama.chat({
            model: 'llava',
            messages: [{
                role: 'user',
                content: 'Analyze this image of a vocabulary list. Extract the Polish-English word pairs using OCR and format them into a JavaScript array named "wordPairs". Each pair should be an array with the Polish word first, then the English word. Ensure special characters are properly escaped. return JUST THE ARRAY.',
                images: [imagePath]
            }]
        });

        console.log('Response from ollama:', response);

        if (response && response.message && response.message.content) {
            const content = response.message.content;
            const arrayStringMatch = content.match(/wordPairs = \[(.*?)\];/s);
            if (arrayStringMatch && arrayStringMatch[1]) {
                const arrayString = `[${arrayStringMatch[1]}]`;
                const wordPairs = JSON.parse(arrayString);
                res.json(wordPairs);
            } else {
                res.status(500).send('Invalid response format from ollama');
            }
        } else {
            res.status(500).send('Invalid response from ollama');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing image');
    } finally {
        // Clean up the uploaded file
        fs.unlinkSync(imagePath);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});