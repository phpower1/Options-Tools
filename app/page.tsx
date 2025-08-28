"use client";

import { useState } from 'react';
import ROICalculator from './ROICalculator';
import BreakevenCalculator from './BreakevenCalculator';

// Define a type for the available tools
type Tool = 'roi-calculator' | 'breakeven-calculator' | 'implied-volatility';

const HomePage = () => {
  // State to track which tool is currently selected
  const [activeTool, setActiveTool] = useState<Tool>('roi-calculator');

  // Function to render the active tool component
  const renderTool = () => {
    switch (activeTool) {
      case 'roi-calculator':
        return <ROICalculator />;
      case 'breakeven-calculator':
        return <BreakevenCalculator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 font-sans flex flex-col items-center relative overflow-hidden">
      {/* Background animation element */}
      <style jsx>{`
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-blue-900 via-teal-900 to-purple-900 bg-[length:400%_400%] animate-[gradient-move_20s_ease_infinite]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-700 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-teal-400 mb-4">
            Options Tools
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Select a tool to get started.
          </p>
          
          {/* Navigation for tools */}
          <nav className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTool('roi-calculator')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTool === 'roi-calculator'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-teal-600 hover:text-white'
              }`}
            >
              ROI Calculator
            </button>
            <button
              onClick={() => setActiveTool('breakeven-calculator')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTool === 'breakeven-calculator'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-teal-600 hover:text-white'
              }`}
            >
              Breakeven Calculator
            </button>
          </nav>
        </div>

        {/* Render the selected tool */}
        <main className="flex-1 w-full max-w-4xl flex flex-col items-center">
          {renderTool()}
        </main>

        {/* Disclaimer and Footer */}
        <footer className="w-full max-w-4xl mt-12 py-8 text-center text-xs text-gray-500 border-t border-gray-700">
          <div className="mb-4 text-red-400 font-bold">
            <p>RISK DISCLAIMER:</p>
            <p>The calculators and tools provided on this website are for informational and educational purposes only. They are not intended as financial advice. All investments, including options trading, involve risk. Please consult with a qualified financial advisor before making any investment decisions.</p>
          </div>
          <div>
            <p>&copy; {new Date().getFullYear()} Options Tools. All Rights Reserved.</p>
            <p>Powered by Next.js and Tailwind CSS.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
