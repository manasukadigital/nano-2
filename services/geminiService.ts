
import { GoogleGenAI, Modality } from "@google/genai";

interface EditImagePayload {
  imageBase64: string;
  imageMimeType: string;
  prompt: string;
}

interface EditImageResponse {
    image: string | null;
    text: string | null;
}

export const editImage = async ({
  imageBase64,
  imageMimeType,
  prompt,
}: EditImagePayload): Promise<EditImageResponse> => {
  // Assume process.env.API_KEY is set in the environment
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: imageMimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (
      !response.candidates ||
      response.candidates.length === 0 ||
      !response.candidates[0].content ||
      !response.candidates[0].content.parts
    ) {
      throw new Error('Invalid response structure from Gemini API.');
    }

    let image: string | null = null;
    let text: string | null = null;

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
            image = part.inlineData.data;
        } else if (part.text) {
            text = part.text;
        }
    }
    
    if (!image) {
      throw new Error("The API did not return an image. It may have refused the request.");
    }

    return { image, text };

  } catch (error) {
    console.error('Gemini API call failed:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the Gemini API.');
  }
};
