'use client';

import React, { useState } from 'react';
import { Plus, Search, Calendar, User, Tag, GripVertical } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getPriorityColor = (priority: TaskPriority) => {
    if (priority === 'high') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (priority === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'todo', label: 'To Do', color: 'border-gray-500' },
    { status: 'in-progress', label: 'In Progress', color: 'border-blue-500' },
    { status: 'review', label: 'Review', color: 'border-amber-500' },
    { status: 'done', label: 'Done', color: 'border-emerald-500' },
  ];

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

      {/* Board View with Drag & Drop */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(t => t.status === column.status);

            return (
              <div
                key={column.status}
                className="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <div className={`flex items-center justify-between mb-4 px-2 py-1 rounded-lg border ${column.color}`}>
                  <h3 className="font-medium text-sm capitalize">{column.label}</h3>
                  <span className="text-xs text-muted-foreground bg-card px-2 py-0.5 rounded">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[400px]">
                  {columnTasks.map((task) => (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground mt-1 opacity-40 group-hover:opacity-100" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm leading-snug">{task.title}</p>

                            <div className="flex items-center gap-2 mt-3">
                              {task.assignee && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  {task.assignee}
                                </div>
                              )}
                              {task.dueDate && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {task.dueDate}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 mt-3">
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                              {task.labels?.map(label => (
                                <Badge key={label} variant="secondary" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
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
                  <Badge variant="outline" className="capitalize">
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}