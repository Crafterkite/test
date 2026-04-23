'use client';

import React, { useState } from 'react';
import { Plus, Search, Calendar as CalendarIcon, List, Grid3X3, Clock, Table as TableIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';
type ViewMode = 'list' | 'board' | 'timeline' | 'calendar' | 'table';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  labels?: string[];
}

const initialTasks: Task[] = [
  { id: 't1', title: 'Finalize Q4 Campaign Assets', status: 'in-progress', priority: 'high', assignee: 'Sarah Chen', dueDate: '2026-04-28', labels: ['campaign'] },
  { id: 't2', title: 'Review Brand Guidelines v2', status: 'review', priority: 'medium', assignee: 'Marcus Rivera', dueDate: '2026-04-25', labels: ['brand'] },
  { id: 't3', title: 'Update Client Contract Template', status: 'todo', priority: 'low', dueDate: '2026-05-05', labels: ['legal'] },
  { id: 't4', title: 'Prepare Pitch Deck for Bloom Studio', status: 'done', priority: 'high', assignee: 'Aria Johnson', dueDate: '2026-04-20', labels: ['pitch'] },
  { id: 't5', title: 'Create Social Media Assets', status: 'todo', priority: 'medium', assignee: 'Sarah Chen', dueDate: '2026-04-30' },
  { id: 't6', title: 'Client Feedback Review Meeting', status: 'in-progress', priority: 'high', dueDate: '2026-04-24' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    if (priority === 'high') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (priority === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage creative deliverables and workflow</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex rounded-lg border border-border bg-card p-1">
            {[
              { mode: 'list', label: 'List', icon: List },
              { mode: 'board', label: 'Board', icon: Grid3X3 },
              { mode: 'timeline', label: 'Timeline', icon: Clock },
              { mode: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { mode: 'table', label: 'Table', icon: TableIcon },
            ].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                  viewMode === mode 
                    ? 'bg-accent text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Views */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['todo', 'in-progress', 'review', 'done'].map((status) => {
            const columnTasks = filteredTasks.filter(t => t.status === status);
            return (
              <div key={status} className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-3 py-2 bg-card border border-border rounded-lg">
                  <h3 className="font-medium capitalize">{status.replace('-', ' ')}</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">{columnTasks.length}</span>
                </div>
                <div className="space-y-3 min-h-[500px]">
                  {columnTasks.map(task => (
                    <Card key={task.id} className="p-4 cursor-grab active:cursor-grabbing">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="mt-3 flex gap-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card key={task.id} className="p-5">
              <div className="font-medium">{task.title}</div>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'timeline' && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Timeline / Gantt View (coming soon - horizontal timeline with dates)
          </CardContent>
        </Card>
      )}

      {viewMode === 'calendar' && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Calendar View (monthly grid with tasks)
          </CardContent>
        </Card>
      )}

      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Table View (sortable spreadsheet style)
          </CardContent>
        </Card>
      )}
    </div>
  );
}