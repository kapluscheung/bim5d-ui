import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, ChevronRight, ChevronDown, Download, GripVertical } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { BIMQuantityTakeoff } from './BIMQuantityTakeoff';
import { FormulaEditor } from './FormulaEditor';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface QuantityItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  costMapped: boolean;
  taskMapped: boolean;
}

interface Element {
  id: string;
  name: string;
  type: string;
  quantityExpression: string;
  quantities: QuantityItem[];
  costMapped: boolean;
  taskMapped: boolean;
}

interface BQItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  uom: string;
  unitCost: number;
  totalCost: number;
  mapped: boolean;
  mappedQuantityId?: string;
  children?: BQItem[];
  level: number;
}

const mockElements: Element[] = [
  {
    id: 'E001',
    name: 'Sub Non Structural Wall_30/20_200mm',
    type: 'Wall',
    quantityExpression: 'Quantity Exp.',
    quantities: [
      { id: 'Q001', name: 'Count', value: 33.0, unit: 'EA', costMapped: false, taskMapped: false },
      { id: 'Q002', name: 'Length', value: 65.1, unit: 'M', costMapped: false, taskMapped: false },
      { id: 'Q003', name: 'Net Volume', value: 26.6, unit: 'M3', costMapped: true, taskMapped: false },
      { id: 'Q004', name: 'Gross Volume', value: 28.9, unit: 'M3', costMapped: false, taskMapped: false },
    ],
    costMapped: true,
    taskMapped: false,
  },
  {
    id: 'E002',
    name: 'Sub Wall_60/20_200mm',
    type: 'Wall',
    quantityExpression: 'Quantity Exp.',
    quantities: [
      { id: 'Q009', name: 'Count', value: 12.0, unit: 'EA', costMapped: false, taskMapped: false },
      { id: 'Q010', name: 'Length', value: 45.2, unit: 'M', costMapped: false, taskMapped: false },
      { id: 'Q011', name: 'Net Volume', value: 18.4, unit: 'M3', costMapped: true, taskMapped: false },
    ],
    costMapped: true,
    taskMapped: false,
  },
  {
    id: 'E003',
    name: 'Sub Wall_60/20_500mm',
    type: 'Wall',
    quantityExpression: 'Quantity Exp.',
    quantities: [
      { id: 'Q013', name: 'Count', value: 8.0, unit: 'EA', costMapped: false, taskMapped: false },
      { id: 'Q014', name: 'Length', value: 32.8, unit: 'M', costMapped: false, taskMapped: false },
      { id: 'Q015', name: 'Net Volume', value: 22.1, unit: 'M3', costMapped: true, taskMapped: false },
    ],
    costMapped: true,
    taskMapped: false,
  },
];

const mockBQData: BQItem[] = [
  { id: 'BQ000', code: '000', description: 'A BLK3 3rd Deliverable 20151217', quantity: 1.0, uom: '', unitCost: 0, totalCost: 0, mapped: false, level: 0 },
  { 
    id: 'BQ001', 
    code: 'A', 
    description: 'A', 
    quantity: 1.0, 
    uom: '', 
    unitCost: 0, 
    totalCost: 0, 
    mapped: false, 
    level: 1,
    children: [
      { 
        id: 'BQ002', 
        code: 'A.01', 
        description: 'SUBSTRUCTURAL', 
        quantity: 0.0, 
        uom: '', 
        unitCost: 0, 
        totalCost: 0, 
        mapped: false, 
        level: 2,
        children: [
          { 
            id: 'BQ003', 
            code: 'A.01.01', 
            description: 'EXECUTION OF PILE CAPS AND FOOTINGS TO EXCAVATION', 
            quantity: 1.0, 
            uom: '', 
            unitCost: 0, 
            totalCost: 0, 
            mapped: false, 
            level: 3,
            children: [
              { id: 'BQ004', code: 'A.01.01.01.01', description: 'Excavating for pile caps and footings', quantity: 0.0, uom: 'm3', unitCost: 0, totalCost: 0, mapped: false, level: 4 },
              { id: 'BQ005', code: 'A.01.01.01.01.01', description: 'Not Exceeding 1.50 m deep', quantity: 2945.2, uom: 'm3', unitCost: 0, totalCost: 0, mapped: true, mappedQuantityId: 'Q007', level: 5 },
              { id: 'BQ006', code: 'A.01.01.01.01.02', description: '1.50m - 3.00m deep', quantity: 2482.6, uom: 'm3', unitCost: 0, totalCost: 0, mapped: true, mappedQuantityId: 'Q012', level: 5 },
              { id: 'BQ007', code: 'A.01.01.01.01.03', description: '3.00m - 4.50m deep', quantity: 1602.7, uom: 'm3', unitCost: 0, totalCost: 0, mapped: true, mappedQuantityId: 'Q016', level: 5 },
              { id: 'BQ008', code: 'A.01.01.01.01.04', description: '4.50m - 6.00m deep', quantity: 242.4, uom: 'm3', unitCost: 0, totalCost: 0, mapped: true, level: 5 },
            ]
          },
          { 
            id: 'BQ009', 
            code: 'A.01.01.02', 
            description: 'IN-SITU CONCRETE', 
            quantity: 0.0, 
            uom: '', 
            unitCost: 0, 
            totalCost: 0, 
            mapped: false, 
            level: 3,
            children: [
              { id: 'BQ010', code: 'A.01.01.02.01', description: 'Concrete: grade 20/20', quantity: 1.0, uom: '', unitCost: 0, totalCost: 0, mapped: false, level: 4 },
              { id: 'BQ011', code: 'A.01.01.02.01.01', description: 'Blinding: under pile caps, footings, tie beams', quantity: 0.0, uom: '', unitCost: 0, totalCost: 0, mapped: false, level: 5 },
              { id: 'BQ012', code: 'A.01.01.02.01.01.01', description: '75 mm thick', quantity: 111.2, uom: 'm3', unitCost: 0, totalCost: 0, mapped: true, level: 6 },
            ]
          }
        ]
      }
    ]
  }
];

interface DraggableQuantityProps {
  quantity: QuantityItem;
  elementId: string;
}

function DraggableQuantity({ quantity, elementId }: DraggableQuantityProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${elementId}-${quantity.id}`,
    data: { quantity, elementId }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className="hover:bg-collection-1-lgiht-blue-BG"
    >
      <TableCell>
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-collection-1-gray-word" />
        </div>
      </TableCell>
      <TableCell className="pl-8">
        <span className="text-sm">{quantity.name}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-sm">{quantity.value}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{quantity.unit}</span>
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <span className="text-xs">{quantity.costMapped ? 'Yes' : 'No'}</span>
      </TableCell>
      <TableCell>
        <span className="text-xs">{quantity.taskMapped ? 'Yes' : 'No'}</span>
      </TableCell>
    </TableRow>
  );
}

interface DroppableBQRowProps {
  item: BQItem;
  onDrop: (bqId: string, quantityId: string) => void;
  onOpenFormula: (item: BQItem) => void;
  expandedBQ: Set<string>;
  toggleBQ: (id: string) => void;
}

function DroppableBQRow({ item, onDrop, onOpenFormula, expandedBQ, toggleBQ }: DroppableBQRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: item.id,
    data: { bqItem: item }
  });

  return (
    <>
      <TableRow 
        ref={setNodeRef}
        className={`${isOver ? 'bg-collection-1-light-blue-HL/30' : ''} hover:bg-collection-1-lgiht-blue-BG`}
      >
        <TableCell>
          {item.children && item.children.length > 0 && (
            <button
              onClick={() => toggleBQ(item.id)}
              className="hover:bg-collection-1-button-color-BG rounded p-1"
              style={{ marginLeft: `${item.level * 12}px` }}
            >
              {expandedBQ.has(item.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {(!item.children || item.children.length === 0) && (
            <div style={{ marginLeft: `${(item.level * 12) + 8}px` }} />
          )}
        </TableCell>
        <TableCell>
          <span className="text-sm" style={{ marginLeft: `${item.level * 12}px` }}>{item.code}</span>
        </TableCell>
        <TableCell>
          <span className="text-sm">{item.description}</span>
        </TableCell>
        <TableCell className="text-right">
          {item.quantity > 0 && (
            <button
              onClick={() => onOpenFormula(item)}
              className="text-collection-1-select-color hover:underline text-sm"
            >
              {item.quantity.toFixed(1)}
            </button>
          )}
        </TableCell>
        <TableCell>
          <span className="text-sm">{item.uom}</span>
        </TableCell>
        <TableCell className="text-right">
          <span className="text-sm">{item.unitCost.toFixed(2)}</span>
        </TableCell>
        <TableCell className="text-right">
          <span className="text-sm">{item.totalCost.toFixed(2)}</span>
        </TableCell>
        <TableCell className="text-center">
          {item.mapped && <span className="text-xs">Yes</span>}
        </TableCell>
      </TableRow>
      {item.children && expandedBQ.has(item.id) && item.children.map((child) => (
        <DroppableBQRow 
          key={child.id} 
          item={child} 
          onDrop={onDrop} 
          onOpenFormula={onOpenFormula}
          expandedBQ={expandedBQ}
          toggleBQ={toggleBQ}
        />
      ))}
    </>
  );
}

interface BIM5DDetailPageProps {
  scheduleId: string;
  onBack: () => void;
}

export function BIM5DDetailPage({ scheduleId, onBack }: BIM5DDetailPageProps) {
  const [expandedElements, setExpandedElements] = useState<Set<string>>(new Set(['E001']));
  const [expandedBQ, setExpandedBQ] = useState<Set<string>>(new Set(['BQ001', 'BQ002', 'BQ003', 'BQ009']));
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showExpressionDialog, setShowExpressionDialog] = useState(false);
  const [showFormulaDialog, setShowFormulaDialog] = useState(false);
  const [selectedBQItem, setSelectedBQItem] = useState<BQItem | null>(null);
  const [bqItems, setBQItems] = useState(mockBQData);

  const toggleElement = (elementId: string) => {
    const newExpanded = new Set(expandedElements);
    if (newExpanded.has(elementId)) {
      newExpanded.delete(elementId);
    } else {
      newExpanded.add(elementId);
    }
    setExpandedElements(newExpanded);
  };

  const toggleBQ = (bqId: string) => {
    const newExpanded = new Set(expandedBQ);
    if (newExpanded.has(bqId)) {
      newExpanded.delete(bqId);
    } else {
      newExpanded.add(bqId);
    }
    setExpandedBQ(newExpanded);
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
    setShowExpressionDialog(true);
  };

  const handleOpenFormula = (item: BQItem) => {
    setSelectedBQItem(item);
    setShowFormulaDialog(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const dragData = active.data.current as { quantity: QuantityItem; elementId: string };
      const dropData = over.data.current as { bqItem: BQItem };
      
      if (dragData && dropData) {
        // Update the BQ item to mark it as mapped
        const updateBQItems = (items: BQItem[]): BQItem[] => {
          return items.map(item => {
            if (item.id === dropData.bqItem.id) {
              return {
                ...item,
                mapped: true,
                mappedQuantityId: dragData.quantity.id,
                quantity: dragData.quantity.value
              };
            }
            if (item.children) {
              return {
                ...item,
                children: updateBQItems(item.children)
              };
            }
            return item;
          });
        };
        
        setBQItems(updateBQItems(bqItems));
      }
    }
  };

  const renderBQRows = (items: BQItem[]) => {
    return items.map((item) => (
      <DroppableBQRow 
        key={item.id} 
        item={item} 
        onDrop={(bqId, quantityId) => {}}
        onOpenFormula={handleOpenFormula}
        expandedBQ={expandedBQ}
        toggleBQ={toggleBQ}
      />
    ));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-collection-1-light-gray-BG px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl text-collection-1-select-color">BIM 5D Schedule: {scheduleId}</h1>
                <p className="text-sm text-collection-1-gray-word">Foundation & Structural Works</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border-b border-collection-1-light-gray-BG px-4 py-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Quantity All</Button>
            <Button variant="outline" size="sm">
              Quantity by Element Type
            </Button>
            <div className="flex-1" />
            <Button variant="outline" size="sm">Search</Button>
            <Button variant="outline" size="sm">Expand</Button>
            <Button variant="outline" size="sm">Collapse</Button>
          </div>
        </div>

        {/* Resizable Panels */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            {/* QTO Section */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="flex flex-col h-full bg-white">
                <div className="px-4 py-3 border-b border-collection-1-light-gray-BG">
                  <h2 className="text-lg text-collection-1-select-color">Takeoff Manager</h2>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-collection-1-light-gray-BG hover:bg-collection-1-light-gray-BG">
                          <TableHead className="w-8"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-24">Value</TableHead>
                          <TableHead className="w-20">Unit</TableHead>
                          <TableHead className="w-24">Type</TableHead>
                          <TableHead className="w-24">Cost Mapped</TableHead>
                          <TableHead className="w-24">Task Mapped</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockElements.map((element) => (
                          <React.Fragment key={element.id}>
                            {/* Element Row */}
                            <TableRow className="bg-collection-1-lgiht-blue-BG hover:bg-collection-1-light-blue-HL/30">
                              <TableCell>
                                <button
                                  onClick={() => toggleElement(element.id)}
                                  className="hover:bg-collection-1-button-color-BG rounded p-1"
                                >
                                  {expandedElements.has(element.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{element.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <button
                                  onClick={() => handleElementClick(element.id)}
                                  className="text-collection-1-select-color hover:underline cursor-pointer bg-collection-1-button-color-BG px-2 py-0.5 rounded text-xs"
                                >
                                  {element.quantityExpression}
                                </button>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell>
                                <span className="text-xs">{element.type}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs">{element.costMapped ? 'Yes' : 'No'}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs">{element.taskMapped ? 'Yes' : 'No'}</span>
                              </TableCell>
                            </TableRow>

                            {/* Quantity Items (when expanded) - Draggable */}
                            {expandedElements.has(element.id) && element.quantities.map((quantity) => (
                              <DraggableQuantity 
                                key={quantity.id}
                                quantity={quantity}
                                elementId={element.id}
                              />
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle className="bg-collection-1-light-gray-BG hover:bg-collection-1-light-blue-HL" />

            {/* BQ Section */}
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="flex flex-col h-full bg-white">
                <div className="px-4 py-3 border-b border-collection-1-light-gray-BG">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg text-collection-1-select-color">Cost Planner</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-collection-1-gray-word">Schedule:</span>
                      <Select defaultValue="budget1">
                        <SelectTrigger className="w-48 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget1">[BUDGET1] main schedule</SelectItem>
                          <SelectItem value="budget2">[BUDGET2] alternative</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">New</Button>
                      <Button variant="outline" size="sm">Import</Button>
                      <Button variant="outline" size="sm">Export</Button>
                      <Button variant="outline" size="sm">Auto Mapping</Button>
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 overflow-hidden">
                  <div className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-collection-1-light-gray-BG hover:bg-collection-1-light-gray-BG">
                          <TableHead className="w-8"></TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right w-24">Quantity</TableHead>
                          <TableHead className="w-16">UOM</TableHead>
                          <TableHead className="text-right w-24">Unit Cost</TableHead>
                          <TableHead className="text-right w-24">Total Cost</TableHead>
                          <TableHead className="text-center w-20">Mapped</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {renderBQRows(bqItems)}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* QTO Expression Dialog */}
        {/* <Dialog open={showExpressionDialog} onOpenChange={setShowExpressionDialog}>
          <DialogContent className="max-w-[80vw] w-[80vw] h-[80vh] p-0 gap-0 resize overflow-auto">
            <DialogHeader className="px-6 py-4 border-b border-collection-1-light-gray-BG shrink-0">
              <DialogTitle className="text-collection-1-select-color">QTO Expression</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <BIMQuantityTakeoff />
            </div>
          </DialogContent>
        </Dialog> */}

        {/* Formula Editor Dialog */}
        <Dialog open={showFormulaDialog} onOpenChange={setShowFormulaDialog}>
          <DialogContent className="max-w-[80vw] w-[80vw] h-[80vh] p-0 gap-0 resize overflow-auto">
            {selectedBQItem && (
              <FormulaEditor 
                bqItem={selectedBQItem}
                onSave={(formula) => {
                  console.log('Saved formula:', formula);
                  setShowFormulaDialog(false);
                }}
                onCancel={() => setShowFormulaDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DndContext>
  );
}
