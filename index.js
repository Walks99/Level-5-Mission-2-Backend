// Import required modules
const util = require('util');
const fs = require('fs');
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

// Retrieve environment variables for Custom Vision API
const trainingKey = process.env["VISION_TRAINING_KEY"];
const trainingEndpoint = process.env["VISION_TRAINING_ENDPOINT"];

const predictionKey = process.env["VISION_PREDICTION_KEY"];
const predictionResourceId = process.env["VISION_PREDICTION_RESOURCE_ID"];
const predictionEndpoint = process.env["VISION_PREDICTION_ENDPOINT"];

// Specify the name of the published iteration
const publishIterationName = "Mission-2";

// Promisify setTimeout for easier use
const setTimeoutPromise = util.promisify(setTimeout);

// Set up API key credentials for training
const credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": trainingKey } });

// Create a Training API client instance
const trainer = new TrainingApi.TrainingAPIClient(credentials, trainingEndpoint);

// Set up API key credentials for prediction
const predictorCredentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });

// Create a Prediction API client instance
const predictor = new PredictionApi.PredictionAPIClient(predictorCredentials, predictionEndpoint);
