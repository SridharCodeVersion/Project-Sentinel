import React from 'react';

// Define the interface mapping fields
export interface GraphNode {
  id: string;
  label: string;
  sub: string;
  type: string; // TARGET, CMD_IP, CMD_NODE, VOIP_GW, MULE, CRYPTO, HAWALA
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

interface NetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedCampaign: string;
  selectedNodeId: string | null;
  onSelect: (id: string | null) => void;
}

export default function NetworkGraph({
  nodes,
  edges,
  selectedCampaign,
  selectedNodeId,
  onSelect
}: NetworkGraphProps) {

  // Node styles and colors based on user specification
  const getNodeStyles = (type: string) => {
    switch (type) {
      case 'TARGET':
        return {
          bg: '#1E293B',
          stroke: '#64748B',
          ringColor: 'rgba(100, 116, 139, 0.4)',
          radius: 12
        };
      case 'CMD_NODE':
      case 'CMD_IP':
        return {
          bg: '#7F1D1D',
          stroke: '#EF4444',
          ringColor: 'rgba(239, 68, 68, 0.4)',
          radius: 18
        };
      case 'VOIP_GW':
        return {
          bg: '#78350F',
          stroke: '#F59E0B',
          ringColor: 'rgba(245, 158, 11, 0.4)',
          radius: 14
        };
      case 'MULE':
      case 'CRYPTO':
      case 'HAWALA':
        return {
          bg: '#0F766E',
          stroke: '#06B6D4',
          ringColor: 'rgba(6, 182, 212, 0.4)',
          radius: 14
        };
      default:
        return {
          bg: '#1E293B',
          stroke: '#64748B',
          ringColor: 'rgba(100, 116, 139, 0.4)',
          radius: 12
        };
    }
  };

  // Define campaign nodes based on Louvain Community logic
  const isNodeInCampaign = (nodeId: string, campaign: string) => {
    if (campaign === 'ALL NODES') return true;
    if (campaign === 'MEWAT EXTORTION CAMPAIGN 04') {
      return ['n1', 'n3', 'n4', 'n6', 'n7', 'n10', 'n11'].includes(nodeId);
    }
    if (campaign === 'CROSS-BORDER CRYPTO FOOTPRINTS') {
      return ['n7', 'n8', 'n9', 'n10', 'n11'].includes(nodeId);
    }
    if (campaign === 'JAMTARA TELECOM FRAUD RING') {
      return ['n2', 'n4', 'n5', 'n8', 'n9', 'n10'].includes(nodeId);
    }
    return false;
  };

  // Check if edge is active under current campaign filtering
  const isEdgeInCampaign = (from: string, to: string, campaign: string) => {
    if (campaign === 'ALL NODES') return true;
    return isNodeInCampaign(from, campaign) && isNodeInCampaign(to, campaign);
  };

  return (
    <div 
      className="w-full h-full bg-[#030712] rounded border border-slate-800 relative overflow-hidden" 
      onClick={() => onSelect(null)}
    >
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#1E293B 1.5px, transparent 1.5px)', 
          backgroundSize: '24px 24px' 
        }}
      ></div>
      
      {/* Inline SVG Canvas Container */}
      <svg 
        viewBox="0 0 1000 900" 
        className="w-full h-full absolute inset-0 z-10 select-none"
      >
        <defs>
          {/* Arrowhead marker for edges */}
          <marker 
            id="arrowhead" 
            markerWidth="8" 
            markerHeight="8" 
            refX="24" 
            refY="4" 
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#1F2937" />
          </marker>
          <marker 
            id="arrowhead-active" 
            markerWidth="8" 
            markerHeight="8" 
            refX="24" 
            refY="4" 
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#38BDF8" />
          </marker>

          {/* Glow filter for command nodes */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Draw Edges */}
        {edges.map((edge, i) => {
          const src = nodes.find(n => n.id === edge.from);
          const tgt = nodes.find(n => n.id === edge.to);
          if (!src || !tgt) return null;
          
          const isEdgeActive = isEdgeInCampaign(edge.from, edge.to, selectedCampaign);
          const isSelectedPath = selectedNodeId === edge.from || selectedNodeId === edge.to;
          
          return (
            <g key={`edge-${i}`} className="transition-all duration-500">
              <line 
                x1={src.x} y1={src.y} 
                x2={tgt.x} y2={tgt.y} 
                stroke={isSelectedPath ? "#38BDF8" : isEdgeActive ? "#1F2937" : "#111827"} 
                strokeWidth={isSelectedPath ? "2.5" : "1.5"}
                className="transition-all duration-500"
                opacity={isEdgeActive ? 1.0 : 0.15}
                markerEnd={isSelectedPath ? "url(#arrowhead-active)" : "url(#arrowhead)"}
              />
              <g 
                transform={`translate(${(src.x + tgt.x) / 2}, ${(src.y + tgt.y) / 2 - 6})`}
                opacity={isEdgeActive ? 1.0 : 0.15}
                className="transition-all duration-500"
              >
                <rect 
                  x="-75" 
                  y="-10" 
                  width="150" 
                  height="16" 
                  fill="#030712" 
                  rx="4"
                  opacity="0.85"
                />
                <text 
                  fontSize="9.5" 
                  fill={isSelectedPath ? "#38BDF8" : "#94A3B8"} 
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="transition-all duration-500"
                >
                  {edge.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const styles = getNodeStyles(node.type);
          const isNodeActive = isNodeInCampaign(node.id, selectedCampaign);
          
          return (
            <g 
              key={node.id} 
              transform={`translate(${node.x}, ${node.y})`} 
              className="cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
              opacity={isNodeActive ? 1.0 : 0.3}
            >
              {/* Concentric rings for Node types */}
              {isNodeActive && (
                <circle 
                  r={styles.radius + 6} 
                  fill="none" 
                  stroke={styles.stroke} 
                  strokeWidth="1.5" 
                  opacity="0.25"
                  className="animate-pulse"
                />
              )}
              {isSelected && (
                <circle 
                  r={styles.radius + 9} 
                  fill="none" 
                  stroke={styles.stroke} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 3"
                >
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0" 
                    to="360" 
                    dur="10s" 
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Main Node Circle */}
              <circle 
                r={styles.radius} 
                fill={styles.bg} 
                stroke={styles.stroke}
                strokeWidth={isSelected ? "3" : "2"}
                filter={node.type.startsWith('CMD') ? "url(#glow)" : undefined}
                className="transition-all duration-500"
              />
              
              {/* Inner core circle for command nodes */}
              {node.type.startsWith('CMD') && (
                <circle 
                  r={styles.radius - 6} 
                  fill="#EF4444" 
                  className="animate-ping"
                  opacity="0.3"
                />
              )}

              {/* Node Labels */}
              <g transform={`translate(0, ${styles.radius + 18})`}>
                <rect 
                  x="-90" 
                  y="-14" 
                  width="180" 
                  height="30" 
                  fill="#030712" 
                  stroke={isSelected ? "#38BDF8" : "rgba(30, 41, 59, 0.5)"} 
                  strokeWidth="1"
                  rx="4"
                  opacity="0.9"
                  className="transition-all duration-500"
                />
                <text 
                  y="2"
                  fontSize="10" 
                  fill={isSelected ? "#fff" : "#F8FAFC"} 
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="transition-all duration-500"
                >
                  {node.label}
                </text>
                <text 
                  y="12"
                  fontSize="8.5" 
                  fill={isSelected ? "#38BDF8" : "#94A3B8"} 
                  textAnchor="middle"
                  fontFamily="monospace"
                  className="transition-all duration-500"
                >
                  {node.sub}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
