import React, { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface QuantityItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  children?: QuantityItem[];
}

interface FormulaEditorProps {
  bqItem: {
    code: string;
    description: string;
  };
  onSave: (formula: string) => void;
  onCancel: () => void;
}

const mockQuantityTree: QuantityItem[] = [
  {
    id: '1',
    name: 'Sub Non Structural Wall_30/20_200mm',
    value: 0,
    unit: '',
    children: [
      {
        id: '1-1',
        name: 'Sub Wall_60/20_200mm',
        value: 0,
        unit: '',
        children: [
          {
            id: '1-1-1',
            name: 'Sub Wall_60/20_500mm',
            value: 0,
            unit: '',
            children: [
              { id: '1-1-1-1', name: 'Count', value: 32.0, unit: 'EA' },
              { id: '1-1-1-2', name: 'Length', value: 85.6, unit: 'M' },
              { id: '1-1-1-3', name: 'Reference side Surface Area', value: 225.9, unit: 'M2' },
              { id: '1-1-1-4', name: 'Opposite side Surface Area', value: 227.6, unit: 'M2' },
              { id: '1-1-1-5', name: 'Top Surface Area', value: 42.2, unit: 'M2' },
            ]
          }
        ]
      }
    ]
  }
];

export function FormulaEditor({ bqItem, onSave, onCancel }: FormulaEditorProps) {
  const [formula, setFormula] = useState('0 + Excavation_1.5~3m:Net Volume');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '1-1', '1-1-1']));
  const [evaluated, setEvaluated] = useState('2,945.2');

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderQuantityTree = (items: QuantityItem[], level: number = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <div 
          className={`flex items-center gap-2 px-2 py-1 hover:bg-collection-1-lgiht-blue-BG cursor-pointer`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {item.children ? (
            <button onClick={() => toggleNode(item.id)} className="shrink-0">
              {expandedNodes.has(item.id) ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-3" />
          )}
          <span className="flex-1 text-sm">{item.name}</span>
          {item.value > 0 && (
            <>
              <span className="text-sm text-right w-20">{item.value}</span>
              <span className="text-sm w-12">{item.unit}</span>
            </>
          )}
        </div>
        {item.children && expandedNodes.has(item.id) && renderQuantityTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-collection-1-light-gray-BG bg-collection-1-light-gray-BG">
        <h2 className="text-lg text-collection-1-select-color">Formula Editor</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Quantity Tree */}
        <div className="border-b border-collection-1-light-gray-BG">
          <div className="px-4 py-2 bg-collection-1-button-color-BG flex items-center justify-between">
            <span className="text-sm">Description / Quantity</span>
            <div className="flex gap-16">
              <span className="text-sm w-20 text-right">Value</span>
              <span className="text-sm w-12">Unit</span>
            </div>
          </div>
          <ScrollArea className="h-48">
            <div className="bg-collection-1-lgiht-blue-BG">
              {renderQuantityTree(mockQuantityTree)}
            </div>
          </ScrollArea>
        </div>

        {/* Formula Input */}
        <div className="flex-1 flex flex-col p-4">
          <label className="text-sm mb-2">Enter formula</label>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">fx =</span>
            <div className="flex-1">
              <Textarea
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="min-h-32 font-mono text-sm"
                placeholder="Enter formula..."
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-collection-1-light-gray-BG">
            <div className="flex items-center gap-4">
              <span className="text-sm text-collection-1-gray-word">Evaluated</span>
              <span className="text-sm">{evaluated}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => onSave(formula)}>
                OK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
