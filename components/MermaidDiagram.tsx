import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Maximize2, Minimize2 } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter',
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !chart) return;
      setError(null);
      
      try {
        // Generate a unique ID for each render to avoid conflicts
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render architecture diagram. The syntax might be invalid.");
      }
    };

    renderChart();
  }, [chart]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={`relative transition-all duration-300 ${isExpanded ? 'fixed inset-0 z-50 bg-slate-900 p-8 flex items-center justify-center' : 'w-full h-auto'}`}>
      
      <div className={`relative bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-xl ${isExpanded ? 'w-full h-full' : ''}`}>
        <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
                onClick={toggleExpand}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-200 transition-colors"
                title={isExpanded ? "Minimize" : "Maximize"}
            >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
        </div>

        <div 
          ref={containerRef}
          className={`w-full overflow-auto p-4 flex justify-center items-center bg-slate-800 ${isExpanded ? 'h-full' : 'min-h-[300px]'}`}
        >
          {error ? (
            <div className="text-red-400 p-4 text-center">
              <p>{error}</p>
              <pre className="mt-2 text-xs text-slate-500 overflow-auto max-w-full text-left bg-slate-900 p-2 rounded">
                {chart}
              </pre>
            </div>
          ) : (
            <div 
                className="w-full h-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: svgContent }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MermaidDiagram;
