'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  labels?: string[];
  description?: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Finalize Q4 Campaign Assets',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Sarah Chen',
    dueDate: '2026-04-28',
    labels: ['campaign', 'design'],
  },
  {
    id: 't2',
    title: 'Review Brand Guidelines v2',
    status: 'review',
    priority: 'medium',
    assignee: 'Marcus Rivera',
    dueDate: '2026-04-25',
    labels: ['brand'],
  },
  {
    id: 't3',
    title: 'Update Client Contract Template',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-05-05',
    labels: ['legal'],
  },
  {
    id: 't4',
    title: 'Prepare Pitch Deck for Bloom Studio',
    status: 'done',
    priority: 'high',
    assignee: 'Aria Johnson',
    dueDate: '2026-04-20',
    labels: ['pitch'],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    if (priority === 'high') return 'bg-red-500/10 text-red-400';
    if (priority === 'medium') return 'bg-amber-500/10 text-amber-400';
    return 'bg-emerald-500/10 text-emerald-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your creative workflow and deliverables</p>
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

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${viewMode === 'list' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${viewMode === 'board' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Board
            </button>
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

      {/* Tasks List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-sm transition-all cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                    {task.dueDate && <span>Due {task.dueDate}</span>}
                    {task.assignee && <span>Assigned to {task.assignee}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">{task.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Simple Board View Placeholder */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['todo', 'in-progress', 'review', 'done'].map((status) => (
            <div key={status} className="space-y-3">
              <h3 className="font-medium capitalize text-sm text-muted-foreground px-2">
                {status.replace('-', ' ')} ({filteredTasks.filter(t => t.status === status).length})
              </h3>
              <div className="space-y-3">
                {filteredTasks
                  .filter(t => t.status === status)
                  .map(task => (
                    <Card key={task.id} className="p-4">
                      <div className="font-medium text-sm">{task.title}</div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}