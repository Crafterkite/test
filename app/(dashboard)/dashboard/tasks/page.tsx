'use client';

import React, { useState } from 'react';
import { Plus, Search, Calendar as CalendarIcon, List, Grid3X3, Clock, Table as TableIcon, GripVertical, X, Check, User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
  description?: string;
}

const initialTasks: Task[] = [
  { 
    id: 't1', 
    title: 'Finalize Q4 Campaign Assets', 
    status: 'in-progress', 
    priority: 'high', 
    assignee: 'Sarah Chen', 
    dueDate: '2026-04-28', 
    labels: ['campaign'],
    description: 'Complete final assets for social, web, and print. Include variations and source files.'
  },
  { 
    id: 't2', 
    title: 'Review Brand Guidelines v2', 
    status: 'review', 
    priority: 'medium', 
    assignee: 'Marcus Rivera', 
    dueDate: '2026-04-25', 
    labels: ['brand'],
    description: 'Check consistency across all assets and update color usage section.'
  },
  // ... add more as needed
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  // Task Detail State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // New Task Modal State
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignee: '',
    dueDate: '',
    description: '',
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee || undefined,
      dueDate: newTask.dueDate || undefined,
      description: newTask.description || undefined,
    };

    setTasks([task, ...tasks]);
    setShowNewTaskModal(false);
    setNewTask({ title: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '', description: '' });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    if (priority === 'high') return 'bg-red-500/10 text-red-400 border-red-500/30';
    if (priority === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  };

  const columns = [
    { status: 'todo' as const, label: 'To Do', color: 'border-gray-500' },
    { status: 'in-progress' as const, label: 'In Progress', color: 'border-blue-500' },
    { status: 'review' as const, label: 'Review', color: 'border-amber-500' },
    { status: 'done' as const, label: 'Done', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage creative deliverables and workflow</p>
        </div>
        <Button onClick={() => setShowNewTaskModal(true)}>
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
                  viewMode === mode ? 'bg-accent text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
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

      {/* ====================== VIEWS ====================== */}

      {/* Board View with Drag & Drop */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div
                key={col.status}
                className="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
              >
                <div className={`flex items-center justify-between mb-4 px-3 py-2 rounded-lg border ${col.color}`}>
                  <h3 className="font-medium capitalize">{col.label}</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                </div>

                <div className="space-y-3 min-h-[500px]">
                  {columnTasks.map(task => (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => setSelectedTask(task)}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground mt-1 opacity-40" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{task.title}</p>
                            <div className="mt-3 flex gap-2">
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card 
              key={task.id} 
              className="hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                    {task.dueDate && <span>Due {task.dueDate}</span>}
                    {task.assignee && <span>Assigned to {task.assignee}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  <Badge variant="outline" className="capitalize">{task.status.replace('-', ' ')}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Other views (Timeline, Calendar, Table) - kept as placeholders */}
      {(viewMode === 'timeline' || viewMode === 'calendar' || viewMode === 'table') && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground py-16">
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View – Coming soon
          </CardContent>
        </Card>
      )}

      {/* ==================== TASK DETAIL SIDEBAR ==================== */}
      {selectedTask && (
        <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl z-50 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Task Details</h2>
              <button onClick={() => setSelectedTask(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <Input
              value={selectedTask.title}
              onChange={(e) => updateTask({ ...selectedTask, title: e.target.value })}
              className="text-lg font-semibold mb-4"
            />

            <div className="space-y-6">
              <div>
                <Label>Status</Label>
                <Select 
                  value={selectedTask.status} 
                  onValueChange={(v) => updateTask({ ...selectedTask, status: v as TaskStatus })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select 
                  value={selectedTask.priority} 
                  onValueChange={(v) => updateTask({ ...selectedTask, priority: v as TaskPriority })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assignee</Label>
                <Input
                  value={selectedTask.assignee || ''}
                  onChange={(e) => updateTask({ ...selectedTask, assignee: e.target.value })}
                  placeholder="Assign to..."
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={selectedTask.dueDate || ''}
                  onChange={(e) => updateTask({ ...selectedTask, dueDate: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedTask.description || ''}
                  onChange={(e) => updateTask({ ...selectedTask, description: e.target.value })}
                  placeholder="Add more details..."
                  className="mt-1.5 min-h-[120px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">New Task</h2>
              <button onClick={() => setShowNewTaskModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Finalize logo variations"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={newTask.status} onValueChange={(v) => setNewTask({ ...newTask, status: v as TaskStatus })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Assignee</Label>
                <Input
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="Team member name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add more details about this task..."
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                Create Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}