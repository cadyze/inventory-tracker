// components/UploadImage.js
import { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Get base64 without the prefix

      setLoading(true); // Start loading spinner
      
      try {
        const response = await fetch('./api/rekognition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Image,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setLabels(data.labels);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    reader.readAsDataURL(file);
    setImage(URL.createObjectURL(file));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Upload an Image
      </Typography>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2 }}
      >
        Choose Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Button>

      {image && (
        <Card sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
          <img src={image} alt="Uploaded" style={{ width: '100%' }} />
        </Card>
      )}

      {loading && (
        <CircularProgress sx={{ mb: 2 }} />
      )}

      {labels.length > 0 && (
        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h6">Detected Labels:</Typography>
            <ul>
              {labels.map((label) => (
                <li key={label.Name}>
                  {label.Name} - {label.Confidence.toFixed(2)}%
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
