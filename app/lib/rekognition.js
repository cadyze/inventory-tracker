import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';

// Initialize the Rekognition client
const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Function to detect labels in an image using Amazon Rekognition
 * @param {Buffer} image - The image buffer data
 * @returns {Promise}
 */
export const detectLabels = async (image) => {
  const params = {
    Image: {
      Bytes: image,
    },
    MaxLabels: 10,
    MinConfidence: 70,
  };

  try {
    const command = new DetectLabelsCommand(params);
    const response = await rekognitionClient.send(command);
    return response.Labels;
  } catch (error) {
    console.error('Error detecting labels:', error);
    throw error;
  }
};
