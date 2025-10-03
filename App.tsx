
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageInput } from './components/ImageInput';
import { Spinner } from './components/Spinner';
import { MagicWandIcon, ErrorIcon } from './components/Icons';
import { editImage } from './services/geminiService';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setOriginalImageFile(file);
    setGeneratedImage(null);
    setGeneratedText(null);
    setError(null);
    if (originalImagePreview) {
      URL.revokeObjectURL(originalImagePreview);
    }
    setOriginalImagePreview(URL.createObjectURL(file));
  };

  const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImageFile);
      const result = await editImage({
        imageBase64: base64,
        imageMimeType: mimeType,
        prompt: prompt,
      });

      if (result.image) {
        setGeneratedImage(`data:image/jpeg;base64,${result.image}`);
      }
      if (result.text) {
          setGeneratedText(result.text);
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Column */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">1. Upload Image</h2>
            <ImageInput onImageChange={handleImageChange} previewUrl={originalImagePreview} />

            <h2 className="text-2xl font-bold text-gray-100">2. Describe Your Edit</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'add a futuristic city in the background' or 'make it a watercolor painting'"
              className="w-full h-32 p-4 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
              disabled={isLoading}
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading || !originalImageFile || !prompt}
              className="w-full flex items-center justify-center py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                <>
                  <MagicWandIcon />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {/* Output Column */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">3. Result</h2>
            <div className="w-full aspect-square bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
              {isLoading && <Spinner size="lg" />}
              {!isLoading && error && (
                <div className="text-center text-red-400 p-4">
                  <ErrorIcon />
                  <p className="mt-2 font-semibold">Generation Failed</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              {!isLoading && !error && generatedImage && (
                <img src={generatedImage} alt="Generated result" className="w-full h-full object-contain" />
              )}
               {!isLoading && !error && !generatedImage && (
                <div className="text-center text-slate-500 p-4">
                    <p className="text-lg">Your edited image will appear here.</p>
                </div>
              )}
            </div>
             {generatedText && (
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-semibold text-indigo-400 mb-2">Model's Note:</h3>
                    <p className="text-gray-300">{generatedText}</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
