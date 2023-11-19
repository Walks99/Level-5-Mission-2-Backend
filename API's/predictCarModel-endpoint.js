const express = require('express');
const bodyParser = require('body-parser');
const predictCarModel = require('../Functions/predictCarModel')

const app = express();

app.use(bodyParser.json());

// API endpoint for image prediction
app.post('/predictCarModel', async (req, res) => {
    const { imageFilePath } = req.body;

    try {
        const predictionResult = await predictCarModel(imageFilePath);
        res.json({ predictionResult });
    } catch (error) {
        res.status(500).json({ error: "Error predicting car model" });
    }
});

