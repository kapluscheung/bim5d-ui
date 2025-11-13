import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface QuantityRow {
  id: number;
  quantity: string;
  value: string;
  unit: string;
  expression: string;
  highlighted?: 'orange' | 'blue';
}

interface Element {
  id: string;
  name: string;
}

interface Calculation {
  id: number;
  label: string;
  description: string;
  type: 'info' | 'warning' | 'error';
}

const mockElements: Element[] = [
  { id: '1', name: 'Sub Wall_60/20mm_wall01' },
  { id: '2', name: 'Sub Wall_60/20mm_wall02' },
  { id: '3', name: 'Sub Wall_60/20mm_wall03' },
  { id: '4', name: 'Sub Wall_60/20mm_wall04' },
];

const mockQuantities: QuantityRow[] = [
  { id: 1, quantity: 'Length', value: '65.1', unit: 'M', expression: '', highlighted: 'blue' },
];

const mockCalculations: Calculation[] = [
];

export function BIMQuantityTakeoff() {
  const [selectedElement, setSelectedElement] = useState('2');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Tabs */}
      <Tabs defaultValue="measurement-rules" className="flex-1 flex flex-col">
        <div className="bg-white border-b border-collection-1-light-gray-BG">
          <TabsList className="bg-transparent border-0 h-8 p-0">
            <TabsTrigger 
              value="measurement-rules" 
              className="rounded-none border-0 data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:text-collection-1-select-color px-4 py-1"
            >
              Measurement Rules
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="measurement-rules" className="flex-1 flex m-0">
          {/* Sidebar */}
          <div className="w-48 bg-collection-1-light-gray-BG border-r border-collection-1-light-gray-BG">
            <div className="px-3 py-2 bg-collection-1-button-color-BG border-b border-collection-1-light-gray-BG">
              <h2 className="text-sm text-collection-1-button-color">Elements</h2>
            </div>
            <ScrollArea className="h-full">
              <div className="py-1">
                {mockElements.map((element) => (
                  <button
                    key={element.id}
                    onClick={() => setSelectedElement(element.id)}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-collection-1-button-color-BG ${
                      selectedElement === element.id ? 'bg-collection-1-select-color text-white hover:bg-collection-1-select-color' : ''
                    }`}
                  >
                    {element.id}. {element.name}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Element Info Header */}
            <div className="px-4 py-2 bg-white border-b border-collection-1-light-gray-BG flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-collection-1-gray-word">Name:</span>
                <span className="text-sm text-collection-1-button-color">Sub Wall_60/20_500mm_wall02</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-collection-1-gray-word">Type:</span>
                <span className="text-sm text-collection-1-button-color">Wall</span>
              </div>
            </div>

            {/* Quantity Table */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-collection-1-button-color-BG hover:bg-collection-1-button-color-BG">
                      <TableHead className="text-collection-1-button-color border border-collection-1-light-gray-BG w-12">#</TableHead>
                      <TableHead className="text-collection-1-button-color border border-collection-1-light-gray-BG">Quantity</TableHead>
                      <TableHead className="text-collection-1-button-color border border-collection-1-light-gray-BG w-24">Value</TableHead>
                      <TableHead className="text-collection-1-button-color border border-collection-1-light-gray-BG w-20">Unit</TableHead>
                      <TableHead className="text-collection-1-button-color border border-collection-1-light-gray-BG">Expression</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockQuantities.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className={`${
                          row.highlighted === 'orange' 
                            ? 'bg-orange-100 hover:bg-orange-100' 
                            : 'bg-collection-1-lgiht-blue-BG hover:bg-collection-1-lgiht-blue-BG'
                        }`}
                      >
                        <TableCell className="border border-collection-1-light-gray-BG text-sm">{row.id}</TableCell>
                        <TableCell className="border border-collection-1-light-gray-BG text-sm">{row.quantity}</TableCell>
                        <TableCell className="border border-collection-1-light-gray-BG text-sm text-right">{row.value}</TableCell>
                        <TableCell className="border border-collection-1-light-gray-BG text-sm">{row.unit}</TableCell>
                        <TableCell className="border border-collection-1-light-gray-BG text-sm">
                          {row.expression && (
                            <span className="text-collection-1-main-color-logo">{row.expression}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Calculations Section */}
                <div className="mt-8">
                  <h3 className="text-sm mb-2 text-collection-1-select-color">Calculations</h3>
                  <div className="space-y-1">
                    {mockCalculations.map((calc) => (
                      <div key={calc.id} className="flex gap-2 text-sm">
                        <span className={`${
                          calc.type === 'error' ? 'text-red-600' : 
                          calc.type === 'warning' ? 'text-orange-500' : 
                          'text-collection-1-button-color'
                        }`}>
                          {calc.id}. {calc.label}:
                        </span>
                        <span className="text-collection-1-gray-word">{calc.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
