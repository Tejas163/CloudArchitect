import React, { useState } from 'react';
import { CloudSolution, CloudProvider } from './types';
import { generateArchitecture } from './services/gemini';
import SolutionDisplay from './components/SolutionDisplay';
import { Cloud, Cpu, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [problemDescription, setProblemDescription] = useState('');
  const [provider, setProvider] = useState<CloudProvider>('AWS');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<CloudSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!problemDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const result = await generateArchitecture({
        problemDescription,
        provider,
      });
      setSolution(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate solution. Please try again or check your API key/connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Cloud className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              CloudArchitect AI
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
             <span className="hidden md:inline">Powered by Gemini 2.5</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro / Input Section */}
        <div className={`transition-all duration-500 ease-in-out ${solution ? 'mb-12' : 'max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center'}`}>
          
          {!solution && (
             <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                  Design your cloud infrastructure <br/>
                  <span className="text-indigo-400">in seconds.</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Describe your problem, select a provider, and let our AI architect design a secure, scalable, and resilient solution for you.
                </p>
             </div>
          )}

          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden p-1">
            <div className="p-6 space-y-6">
                
                {/* Provider Selection */}
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-3">Select Cloud Provider</label>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* AWS */}
                      <button 
                        onClick={() => setProvider('AWS')}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-4 rounded-xl border transition-all ${
                            provider === 'AWS' 
                            ? 'bg-orange-500/10 border-orange-500 text-orange-400' 
                            : 'bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-400'
                        }`}
                      >
                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12.571 16.381v-3.737l3.208-1.921 2.91 1.764v3.526l-2.613 1.844-3.505.324zm-1.127-10.762v3.746l-3.217 1.93-2.902-1.755v-3.535l2.622-1.854 3.497-.332zm1.144 1.25l3.245 1.764v3.465l-3.245 1.72-3.228-1.72v-3.465l3.228-1.764zm5.885 8.353l-2.587-1.579v-3.351l2.587-1.403v6.333zm-13.061-6.22l2.614 1.588v3.36l-2.614 1.395v-6.343zm11.233-5.263l-4.066-2.509-4.057 2.509 4.057 2.158 4.066-2.158z"/></svg>
                         <span className="font-semibold text-sm sm:text-base">AWS</span>
                      </button>
                      
                      {/* GCP */}
                      <button 
                        onClick={() => setProvider('GCP')}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-4 rounded-xl border transition-all ${
                            provider === 'GCP' 
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                            : 'bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-400'
                        }`}
                      >
                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 24c6.627 0 12-5.373 12-12s-5.373-12-12-12-12 5.373-12 12 5.373 12 12 12zm-2.028-16.746l.896.792c.675-.623 1.527-.899 2.529-.899 1.83 0 3.327 1.305 3.327 3.333 0 2.018-1.497 3.327-3.327 3.327-1.298 0-2.327-.723-2.738-1.744h-2.181c.542 2.219 2.522 3.864 4.919 3.864 2.808 0 5.088-2.28 5.088-5.088 0-.465-.054-.864-.132-1.245h-4.956v2.016h2.724c-.117.654-.477 1.152-.942 1.482-.507.339-1.077.51-1.782.51-.954 0-1.782-.489-2.229-1.221l-1.194 1.095z"/></svg>
                         <span className="font-semibold text-sm sm:text-base">GCP</span>
                      </button>

                       {/* Azure */}
                       <button 
                        onClick={() => setProvider('Azure')}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-4 rounded-xl border transition-all ${
                            provider === 'Azure' 
                            ? 'bg-sky-500/10 border-sky-500 text-sky-400' 
                            : 'bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-400'
                        }`}
                      >
                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M5.9 20.3L12.7 3h4.4L8.6 23H4.2l1.7-2.7zm4.2-7l2.8-4.4L18.4 23h-4.3l-4-6.4z"/></svg>
                         <span className="font-semibold text-sm sm:text-base">Azure</span>
                      </button>
                   </div>
                </div>

                {/* Problem Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">Architect's Problem Description</label>
                    <textarea 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-40"
                        placeholder="e.g. We need a highly available e-commerce platform that handles 1M concurrent users. It requires microservices architecture, strict internal routing between payments and order services, and multi-region disaster recovery..."
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                    />
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !problemDescription.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                            isLoading || !problemDescription.trim()
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Generating Solution...
                            </>
                        ) : (
                            <>
                                <Cpu size={20} />
                                Generate Architecture
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Disclaimer Bar */}
            <div className="bg-slate-900/50 p-3 text-center border-t border-slate-700">
                <p className="text-xs text-slate-500">
                    AI generated architecture is a starting point. Always review with a certified professional.
                </p>
            </div>
          </div>
          
           {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {solution && (
           <SolutionDisplay solution={solution} />
        )}

      </main>
    </div>
  );
};

export default App;