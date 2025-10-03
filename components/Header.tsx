
import React from 'react';
import { BananaIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="bg-indigo-600 p-2 rounded-lg mr-4">
            <BananaIcon/>
        </div>
        <div>
            <h1 className="text-2xl font-bold text-white">Nano Banana Image Editor</h1>
            <p className="text-sm text-gray-400">AI-powered image editing with Gemini</p>
        </div>
      </div>
    </header>
  );
};
