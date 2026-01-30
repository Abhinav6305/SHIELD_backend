import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './NetworkGraph.css';

cytoscape.use(dagre);

const NetworkGraph = ({ nodes, edges, onNodeClick }) => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cytoscape({
        container: cyRef.current,
        elements: [
          ...nodes.map(node => ({
            data: {
              id: node.id,
              label: node.id,
              risk_score: node.risk_score,
              risk_level: node.risk_level
            }
          })),
          ...edges.map(edge => ({
            data: {
              source: edge.source,
              target: edge.target,
              label: edge.amount ? `$${edge.amount}` : ''
            }
          }))
        ],
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (ele) => {
                const risk = ele.data('risk_level');
                if (risk === 'High') return 'red';
                if (risk === 'Medium') return 'yellow';
                return 'green';
              },
              'label': 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': 'white',
              'font-size': '12px',
              'width': 40,
              'height': 40,
              'border-width': 2,
              'border-color': '#333'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '10px',
              'text-background-color': '#fff',
              'text-background-opacity': 0.8
            }
          }
        ],
        layout: {
          name: 'dagre',
          rankDir: 'LR'
        }
      });

      cy.on('tap', 'node', (evt) => {
        const node = evt.target;
        onNodeClick(node.id());
      });

      return () => cy.destroy();
    }
  }, [nodes, edges, onNodeClick]);

  return <div ref={cyRef} className="network-graph" />;
};

export default NetworkGraph;
