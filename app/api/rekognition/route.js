import { detectLabels } from '../../lib/rekognition';

export async function POST(request) {
  try {
    const { imageData } = await request.json();
    
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    const labels = await detectLabels(imageBuffer);

    console.log('Detected labels:', labels);

    return new Response(JSON.stringify({ labels }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Rekognition:', error);

    return new Response(JSON.stringify({ error: 'Failed to process image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
