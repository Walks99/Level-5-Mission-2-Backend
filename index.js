"use strict";

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");
require("dotenv").config();
const cors = require("cors"); // Import cors module
const multer = require("multer");

// Retrieve environment variables for Custom Vision API
const trainingKey = process.env.VISION_TRAINING_KEY;
const trainingEndpoint = process.env.VISION_TRAINING_ENDPOINT;
const predictionKey = process.env.VISION_PREDICTION_KEY;
const predictionResourceId = process.env.VISION_PREDICTION_RESOURCE_ID;
const predictionEndpoint = process.env.VISION_PREDICTION_ENDPOINT;
const PORT = process.env.PORT || 3000;

const publishIterationName = "Iteration2"; // Replace with the actual iteration name

// Check if all required environment variables are set
if (
  !trainingKey ||
  !trainingEndpoint ||
  !predictionKey ||
  !predictionResourceId ||
  !predictionEndpoint
) {
  console.error("Missing one or more required environment variables.");
  process.exit(1);
}

// Set up API key credentials for training
const credentials = new msRest.ApiKeyCredentials({
  inHeader: { "Training-key": trainingKey },
});

// Create a Training API client instance
const trainer = new TrainingApi.TrainingAPIClient(
  credentials,
  trainingEndpoint
);

// Set up API key credentials for prediction
const predictorCredentials = new msRest.ApiKeyCredentials({
  inHeader: { "Prediction-key": predictionKey },
});

// Create a Prediction API client instance
const predictor = new PredictionApi.PredictionAPIClient(
  predictorCredentials,
  predictionEndpoint
);

// Create an express app
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Use the cors middleware to allow requests from a specific origin
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ################ MY CODE ##################
// Specify the destination folder and file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save the file in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

// Create the multer instance with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Set a file size limit (50 MB in this case)
});

// Use the upload middleware for the specific route where file upload is expected
app.post("/predictCarModel", upload.single("carImage"), async (req, res) => {
  console.log(req); // Log the entire request object
  // Access the uploaded file through req.file
  const imageFilePath = req.file.path;

  try {
    const predictionResult = await predictCarModel(imageFilePath);
    res.json({ predictionResult });
  } catch (error) {
    console.error("Error predicting car model:", error);
    res.status(500).json({ error: "Error predicting car model" });
  }
});

// ############## MY CODE #############
// Function for image upload and prediction
async function predictCarModel(imageFilePath) {
  console.log("starting");
  try {
    // Read the image file
    const imageData = fs.readFileSync(imageFilePath);
    console.log(predictionResourceId);
    console.log(publishIterationName);
    console.log(imageData);

    // Make a prediction request to the Custom Vision API
    const predictionResult = await predictor.classifyImage(
      predictionResourceId,
      publishIterationName,
      imageData
    );

    // Show results
    console.log("Results:");
    predictionResult.predictions.forEach((predictedResult) => {
      console.log(
        `\t ${predictedResult.tagName}: ${(
          predictedResult.probability * 100.0
        ).toFixed(2)}%`
      );
    });

    // Process the prediction result (handle as needed for your application)
    console.log("Prediction Result:", predictionResult);

    return predictionResult;
  } catch (error) {
    //--->##########--< Error Handling in `predictCarModel` Function
    console.error("Error predicting car model:", error);
    // Respond with an appropriate error message
    throw new Error("Error predicting car model");
  }
}

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
