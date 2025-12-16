import { GoogleGenAI, Type } from "@google/genai";
import { CloudSolution, GenerationRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArchitecture = async (
  request: GenerationRequest
): Promise<CloudSolution> => {
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    You are a Senior Principal Cloud Architect. 
    Design a comprehensive cloud solution for the following problem on ${request.provider}.
    
    Problem Description:
    "${request.problemDescription}"
    
    Requirements:
    1. Create a detailed Mermaid.js flowchart diagram code representing the architecture. Use strict flowchart direction TB (Top to Bottom) or LR (Left to Right). Include subgraphs for VPCs/VNets, Regions, or Availability Zones to show isolation.
    2. Focus heavily on networking constraints: internal routing, private IPs, peering (VPC/VNet Peering), Hub-and-Spoke topologies, Transit Gateways (AWS), or Virtual WAN (Azure), and secure ingress/egress.
    3. Detail the Load Balancing strategy (Layer 4 vs Layer 7).
    4. Define a Failover and Disaster Recovery (DR) plan (e.g., Multi-AZ, Multi-Region, Pilot Light, Warm Standby).
    5. List the exact Technology Stack.
    6. Provide a step-by-step solution walkthrough.

    Output must be valid JSON following the defined schema.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 1024 }, // Enable reasoning for complex architecture
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A professional title for the architecture" },
          summary: { type: Type.STRING, description: "A high-level executive summary" },
          provider: { type: Type.STRING, enum: ["AWS", "GCP", "Azure"] },
          mermaidDiagram: { type: Type.STRING, description: "Valid Mermaid.js flowchart code. Do not include markdown backticks." },
          techStack: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: "e.g., Compute, Database, Networking" },
                services: { type: Type.ARRAY, items: { type: Type.STRING } },
                justification: { type: Type.STRING, description: "Why this service was chosen" },
              },
              required: ["category", "services", "justification"],
            },
          },
          networking: {
            type: Type.OBJECT,
            properties: {
              vpcDesign: { type: Type.STRING, description: "CIDR blocks, VPC/VNet structure" },
              subnets: { type: Type.STRING, description: "Public vs Private subnets strategy" },
              connectivity: { type: Type.STRING, description: "VPN, Direct Connect/ExpressRoute, Interconnect, etc." },
              securityGroups: { type: Type.STRING, description: "Firewall rules, NSGs, Security Groups" },
            },
            required: ["vpcDesign", "subnets", "connectivity", "securityGroups"],
          },
          reliability: {
            type: Type.OBJECT,
            properties: {
              loadBalancing: { type: Type.STRING, description: "ALB/NLB, App Gateway, or HTTP(S) LB details" },
              failoverStrategy: { type: Type.STRING, description: "How automatic failover is handled" },
              disasterRecovery: { type: Type.STRING, description: "RTO/RPO targets and strategy" },
              backupPlan: { type: Type.STRING, description: "Backup frequency and retention" },
            },
            required: ["loadBalancing", "failoverStrategy", "disasterRecovery", "backupPlan"],
          },
          walkthrough: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step data flow or user journey through the system",
          },
        },
        required: ["title", "summary", "provider", "mermaidDiagram", "techStack", "networking", "reliability", "walkthrough"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(text) as CloudSolution;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse architecture data");
  }
};