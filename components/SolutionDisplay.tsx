import React from 'react';
import { CloudSolution } from '../types';
import MermaidDiagram from './MermaidDiagram';
import { 
  Server, 
  ShieldCheck, 
  Activity, 
  List, 
  Layers, 
  Network,
  CloudLightning,
  CheckCircle2
} from 'lucide-react';

interface SolutionDisplayProps {
  solution: CloudSolution;
}

const getProviderBadgeStyle = (provider: string) => {
  switch (provider) {
    case 'AWS':
      return 'bg-orange-500/20 text-orange-400';
    case 'GCP':
      return 'bg-blue-500/20 text-blue-400';
    case 'Azure':
      return 'bg-sky-500/20 text-sky-400';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getProviderBadgeStyle(solution.provider)}`}>
                {solution.provider}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{solution.title}</h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-lg">{solution.summary}</p>
      </div>

      {/* Architecture Diagram */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="text-indigo-400" /> 
            Architecture Diagram
        </h3>
        <MermaidDiagram chart={solution.mermaidDiagram} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Networking Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center gap-2">
                <Network className="text-cyan-400" size={20} />
                <h3 className="font-semibold text-slate-100">Networking & Security</h3>
            </div>
            <div className="p-6 space-y-4">
                <DetailRow label="VPC Design" value={solution.networking.vpcDesign} />
                <DetailRow label="Subnets" value={solution.networking.subnets} />
                <DetailRow label="Connectivity" value={solution.networking.connectivity} />
                <DetailRow label="Security Groups" value={solution.networking.securityGroups} />
            </div>
        </div>

        {/* Reliability Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
             <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20} />
                <h3 className="font-semibold text-slate-100">Reliability & Recovery</h3>
            </div>
            <div className="p-6 space-y-4">
                <DetailRow label="Load Balancing" value={solution.reliability.loadBalancing} />
                <DetailRow label="Failover" value={solution.reliability.failoverStrategy} />
                <DetailRow label="Disaster Recovery" value={solution.reliability.disasterRecovery} />
                <DetailRow label="Backup Plan" value={solution.reliability.backupPlan} />
            </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center gap-2">
            <Layers className="text-purple-400" size={20} />
            <h3 className="font-semibold text-slate-100">Technology Stack</h3>
        </div>
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solution.techStack.map((stack, idx) => (
                    <div key={idx} className="space-y-2">
                        <h4 className="font-medium text-slate-200 border-b border-slate-700 pb-1">{stack.category}</h4>
                        <div className="flex flex-wrap gap-2">
                            {stack.services.map((service, sIdx) => (
                                <span key={sIdx} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded text-center">
                                    {service}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 italic mt-1">{stack.justification}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Walkthrough */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <List className="text-blue-400" />
            Solution Walkthrough
        </h3>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <ul className="space-y-4">
                {solution.walkthrough.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                         <div className="flex-shrink-0 mt-1">
                            <CheckCircle2 size={20} className="text-indigo-500" />
                        </div>
                        <p className="text-slate-300">{step}</p>
                    </li>
                ))}
            </ul>
        </div>
      </div>

    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="border-b border-slate-700/50 last:border-0 pb-3 last:pb-0">
        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">{label}</span>
        <span className="block text-slate-200 text-sm leading-relaxed">{value}</span>
    </div>
);

export default SolutionDisplay;