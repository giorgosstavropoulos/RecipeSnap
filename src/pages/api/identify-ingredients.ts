import { identifyIngredientsFromImage } from '../../aiIdentifyIngredients';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }
    // Call Genkit flow
    const result = await identifyIngredientsFromImage(imageBase64);
    res.status(200).json({ ingredients: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to identify ingredients' });
  }
}

// Allow larger payloads (base64 images can be several MB). Adjust as needed.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
