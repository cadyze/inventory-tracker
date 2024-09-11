import { useState } from 'react';
import { Box, Button, Typography, Card, CircularProgress } from '@mui/material';

interface Label {
  Name: string;
}

interface InventoryItem {
  itemName: string;
  quantity: number;
}

export default function UploadImage({ addItem }: { addItem: (itemName: string) => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64Image = reader.result?.toString().split(',')[1]; // Get base64 without the prefix

      if (!base64Image) return;

      setLoading(true); // Start loading spinner

      try {
        const response = await fetch('/api/rekognition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData: base64Image }),
        });

        const data = await response.json();
        if (response.ok) {
          setLabels(data.labels); // Assuming response has a 'labels' array
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }} padding={5}>
      <Typography variant="h4" gutterBottom>
        Choose an image to detect for objects:
      </Typography>
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Choose Image
        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
      </Button>

      {image && (
        <Card sx={{ mb: 2, width: '100%', maxWidth: 500, borderRadius: '8px', boxShadow: 20 }}>
          <img src={image} alt="Uploaded" style={{ width: '100%' }} />
        </Card>
      )}

      {loading && <CircularProgress />}

      {labels.length > 0 && (
        <Box>
          <Typography variant="h5">Detected Labels:</Typography>
          {labels.map((label) => (
            <Button 
              key={label.Name} 
              variant="outlined" 
              onClick={() => addItem(label.Name)} 
              sx={{ m: 1, boxShadow: '1' }}
            >
              {label.Name}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
