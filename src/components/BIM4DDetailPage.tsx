import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Maximize2, Play, Pause, SkipBack, SkipForward, Download, Eye, Calendar } from 'lucide-react';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  dependencies: string[];
}

const mockTasks: Task[] = [
  { id: 'T001', name: 'Site Preparation', startDate: '2025-01-01', endDate: '2025-01-15', duration: 15, progress: 100, status: 'Completed', dependencies: [] },
  { id: 'T002', name: 'Foundation Excavation', startDate: '2025-01-16', endDate: '2025-02-05', duration: 21, progress: 100, status: 'Completed', dependencies: ['T001'] },
  { id: 'T003', name: 'Foundation Concrete Pour', startDate: '2025-02-06', endDate: '2025-02-20', duration: 15, progress: 100, status: 'Completed', dependencies: ['T002'] },
  { id: 'T004', name: 'Ground Floor Slab', startDate: '2025-02-21', endDate: '2025-03-10', duration: 18, progress: 85, status: 'In Progress', dependencies: ['T003'] },
  { id: 'T005', name: 'Level 1 Columns & Walls', startDate: '2025-03-11', endDate: '2025-04-05', duration: 26, progress: 60, status: 'In Progress', dependencies: ['T004'] },
  { id: 'T006', name: 'Level 1 Slab', startDate: '2025-04-06', endDate: '2025-04-25', duration: 20, progress: 0, status: 'Not Started', dependencies: ['T005'] },
  { id: 'T007', name: 'Level 2 Columns & Walls', startDate: '2025-04-26', endDate: '2025-05-20', duration: 25, progress: 0, status: 'Not Started', dependencies: ['T006'] },
  { id: 'T008', name: 'Level 2 Slab', startDate: '2025-05-21', endDate: '2025-06-08', duration: 19, progress: 0, status: 'Not Started', dependencies: ['T007'] },
];

interface BIM4DDetailPageProps {
  scheduleId: string;
  onBack: () => void;
}

export function BIM4DDetailPage({ scheduleId, onBack }: BIM4DDetailPageProps) {
  const [selectedViewport, setSelectedViewport] = useState('3D View');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState([50]);
  const [selectedDate, setSelectedDate] = useState('2025-03-15');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-collection-1-main-color-logo';
      case 'In Progress': return 'bg-collection-1-light-blue-HL';
      case 'Not Started': return 'bg-collection-1-gray-word';
      case 'Delayed': return 'bg-red-500';
      default: return 'bg-collection-1-gray-word';
    }
  };

  const getMonthPosition = (date: string) => {
    const taskDate = new Date(date);
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-06-30');
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (taskDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (daysPassed / totalDays) * 100;
  };

  const getTaskWidth = (task: Task) => {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-06-30');
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (task.duration / totalDays) * 100;
  };

  return (
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
              <h1 className="text-xl text-collection-1-select-color">BIM 4D Schedule: {scheduleId}</h1>
              <p className="text-sm text-collection-1-gray-word">Overall Construction Timeline</p>
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

      {/* Timeline Controls */}
      <div className="px-4 py-3 bg-white border-b border-collection-1-light-gray-BG">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setTimelinePosition([Math.max(0, timelinePosition[0] - 10)])}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setTimelinePosition([Math.min(100, timelinePosition[0] + 10)])}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          <div className="flex-1 px-2">
            <Slider 
              value={timelinePosition} 
              onValueChange={setTimelinePosition}
              max={100}
              step={1}
            />
          </div>
          <span className="text-sm text-collection-1-gray-word w-32 text-right">{timelinePosition[0]}% Complete</span>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <div className="flex items-center gap-2 text-sm text-collection-1-gray-word">
            <Calendar className="w-4 h-4" />
            <span>Jan 2025 - Jun 2025</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Schedule Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats */}
          <div className="px-4 py-3 bg-white border-b border-collection-1-light-gray-BG">
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-collection-1-light-gray-BG">
                <CardContent className="pt-4">
                  <div className="text-xs text-collection-1-gray-word">Total Tasks</div>
                  <div className="text-xl mt-1 text-collection-1-select-color">{mockTasks.length}</div>
                </CardContent>
              </Card>
              <Card className="border-collection-1-light-gray-BG">
                <CardContent className="pt-4">
                  <div className="text-xs text-collection-1-gray-word">Completed</div>
                  <div className="text-xl mt-1 text-collection-1-select-color">{mockTasks.filter(t => t.status === 'Completed').length}</div>
                </CardContent>
              </Card>
              <Card className="border-collection-1-light-gray-BG">
                <CardContent className="pt-4">
                  <div className="text-xs text-collection-1-gray-word">In Progress</div>
                  <div className="text-xl mt-1 text-collection-1-select-color">{mockTasks.filter(t => t.status === 'In Progress').length}</div>
                </CardContent>
              </Card>
              <Card className="border-collection-1-light-gray-BG">
                <CardContent className="pt-4">
                  <div className="text-xs text-collection-1-gray-word">Overall Progress</div>
                  <div className="text-xl mt-1 text-collection-1-select-color">
                    {Math.round(mockTasks.reduce((sum, t) => sum + t.progress, 0) / mockTasks.length)}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Construction Schedule - Gantt Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Timeline Header */}
                    <div className="flex mb-2">
                      <div className="w-64 shrink-0" />
                      <div className="flex-1 flex">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
                          <div key={month} className="flex-1 text-center text-sm border-l border-collection-1-light-gray-BG py-1">
                            {month} 2025
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      {mockTasks.map((task) => (
                        <div key={task.id} className="flex items-center">
                          <div className="w-64 shrink-0 pr-4">
                            <div className="text-sm">{task.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getStatusColor(task.status)} text-xs`}>
                                {task.status}
                              </Badge>
                              <span className="text-xs text-collection-1-gray-word">{task.duration}d</span>
                            </div>
                          </div>
                          <div className="flex-1 relative h-12 border-l border-collection-1-light-gray-BG">
                            {/* Vertical month dividers */}
                            <div className="absolute inset-0 flex">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex-1 border-l border-collection-1-light-gray-BG" />
                              ))}
                            </div>
                            {/* Task bar */}
                            <div 
                              className="absolute top-2 h-8 rounded"
                              style={{
                                left: `${getMonthPosition(task.startDate)}%`,
                                width: `${getTaskWidth(task)}%`,
                                backgroundColor: task.status === 'Completed' ? 'rgba(107, 137, 177, 1)' : 
                                               task.status === 'In Progress' ? 'rgba(138, 191, 234, 1)' : 
                                               task.status === 'Delayed' ? '#ef4444' : 'rgba(148, 148, 148, 1)',
                              }}
                            >
                              <div 
                                className="h-full bg-white/30 rounded"
                                style={{ width: `${task.progress}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
                                {task.progress}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500" />
                        <span>Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500" />
                        <span>In Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-500" />
                        <span>Not Started</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500" />
                        <span>Delayed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
