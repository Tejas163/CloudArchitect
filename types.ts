export interface CloudSolution {
  title: string;
  summary: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  mermaidDiagram: string;
  techStack: Array<{
    category: string;
    services: string[];
    justification: string;
  }>;
  networking: {
    vpcDesign: string;
    subnets: string;
    connectivity: string;
    securityGroups: string;
  };
  reliability: {
    loadBalancing: string;
    failoverStrategy: string;
    disasterRecovery: string;
    backupPlan: string;
  };
  walkthrough: string[];
}

export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

export interface GenerationRequest {
  problemDescription: string;
  provider: CloudProvider;
}