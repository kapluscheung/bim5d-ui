import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Calendar, DollarSign, Clock, FileText } from 'lucide-react';

interface Schedule {
  id: string;
  name: string;
  type: '5D' | '4D';
  project: string;
  status: 'Active' | 'Completed' | 'In Progress' | 'Planning';
  lastModified: string;
  totalCost?: string;
  duration?: string;
}

const mockSchedules: Schedule[] = [
  { id: '5D-001', name: 'Foundation & Structural Works', type: '5D', project: 'Tower A Construction', status: 'In Progress', lastModified: '2025-10-08', totalCost: '$2,450,000' },
  { id: '5D-002', name: 'MEP Installation Phase 1', type: '5D', project: 'Tower A Construction', status: 'Planning', lastModified: '2025-10-09', totalCost: '$890,000' },
  { id: '5D-003', name: 'Facade & Cladding', type: '5D', project: 'Tower A Construction', status: 'Active', lastModified: '2025-10-10', totalCost: '$1,200,000' },
  { id: '4D-001', name: 'Overall Construction Timeline', type: '4D', project: 'Tower A Construction', status: 'Active', lastModified: '2025-10-10', duration: '18 months' },
  { id: '4D-002', name: 'Superstructure Phase', type: '4D', project: 'Tower A Construction', status: 'In Progress', lastModified: '2025-10-09', duration: '8 months' },
  { id: '5D-004', name: 'Interior Fitout - Level 1-10', type: '5D', project: 'Tower B Construction', status: 'Planning', lastModified: '2025-10-07', totalCost: '$650,000' },
  { id: '4D-003', name: 'MEP Installation Timeline', type: '4D', project: 'Tower B Construction', status: 'Planning', lastModified: '2025-10-06', duration: '6 months' },
  { id: '5D-005', name: 'Site Preparation & Earthworks', type: '5D', project: 'Tower B Construction', status: 'Completed', lastModified: '2025-09-28', totalCost: '$320,000' },
];

interface HomePageProps {
  onSelectSchedule: (scheduleId: string, type: '5D' | '4D') => void;
}

export function HomePage({ onSelectSchedule }: HomePageProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-collection-1-select-color';
      case 'Completed': return 'bg-collection-1-main-color-logo';
      case 'In Progress': return 'bg-collection-1-light-blue-HL';
      case 'Planning': return 'bg-collection-1-gray-word';
      default: return 'bg-collection-1-gray-word';
    }
  };

  const schedule5D = mockSchedules.filter(s => s.type === '5D');
  const schedule4D = mockSchedules.filter(s => s.type === '4D');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-collection-1-light-gray-BG px-6 py-4">
        <h1 className="text-2xl text-collection-1-select-color">BIM Project Dashboard</h1>
        <p className="text-collection-1-gray-word mt-1">Manage 4D and 5D schedules</p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-collection-1-light-gray-BG">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total 5D Schedules</CardTitle>
              <DollarSign className="h-4 w-4 text-collection-1-main-color-logo" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-collection-1-select-color">{schedule5D.length}</div>
              <p className="text-xs text-collection-1-gray-word mt-1">Cost tracking enabled</p>
            </CardContent>
          </Card>
          <Card className="border-collection-1-light-gray-BG">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total 4D Schedules</CardTitle>
              <Clock className="h-4 w-4 text-collection-1-main-color-logo" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-collection-1-select-color">{schedule4D.length}</div>
              <p className="text-xs text-collection-1-gray-word mt-1">Time-based planning</p>
            </CardContent>
          </Card>
          <Card className="border-collection-1-light-gray-BG">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Active Schedules</CardTitle>
              <FileText className="h-4 w-4 text-collection-1-main-color-logo" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-collection-1-select-color">{mockSchedules.filter(s => s.status === 'Active').length}</div>
              <p className="text-xs text-collection-1-gray-word mt-1">Currently running</p>
            </CardContent>
          </Card>
          <Card className="border-collection-1-light-gray-BG">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Projects</CardTitle>
              <Calendar className="h-4 w-4 text-collection-1-main-color-logo" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-collection-1-select-color">2</div>
              <p className="text-xs text-collection-1-gray-word mt-1">Tower A & B</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedules Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Schedules</TabsTrigger>
                <TabsTrigger value="5d">5D Schedules</TabsTrigger>
                <TabsTrigger value="4d">4D Schedules</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schedule ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost/Duration</TableHead>
                      <TableHead>Last Modified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSchedules.map((schedule) => (
                      <TableRow 
                        key={schedule.id}
                        className="cursor-pointer hover:bg-collection-1-lgiht-blue-BG"
                        onClick={() => onSelectSchedule(schedule.id, schedule.type)}
                      >
                        <TableCell>{schedule.id}</TableCell>
                        <TableCell>{schedule.name}</TableCell>
                        <TableCell>
                          <Badge variant={schedule.type === '5D' ? 'default' : 'secondary'}>
                            {schedule.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.project}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.totalCost || schedule.duration}</TableCell>
                        <TableCell>{schedule.lastModified}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="5d" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schedule ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Last Modified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule5D.map((schedule) => (
                      <TableRow 
                        key={schedule.id}
                        className="cursor-pointer hover:bg-collection-1-lgiht-blue-BG"
                        onClick={() => onSelectSchedule(schedule.id, schedule.type)}
                      >
                        <TableCell>{schedule.id}</TableCell>
                        <TableCell>{schedule.name}</TableCell>
                        <TableCell>{schedule.project}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.totalCost}</TableCell>
                        <TableCell>{schedule.lastModified}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="4d" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schedule ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Last Modified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule4D.map((schedule) => (
                      <TableRow 
                        key={schedule.id}
                        className="cursor-pointer hover:bg-collection-1-lgiht-blue-BG"
                        onClick={() => onSelectSchedule(schedule.id, schedule.type)}
                      >
                        <TableCell>{schedule.id}</TableCell>
                        <TableCell>{schedule.name}</TableCell>
                        <TableCell>{schedule.project}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.duration}</TableCell>
                        <TableCell>{schedule.lastModified}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
