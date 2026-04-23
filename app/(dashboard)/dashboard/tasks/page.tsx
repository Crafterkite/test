'use client';

import React, { useState } from 'react';
import { 
  Plus, Search, Calendar as CalendarIcon, List, Grid3X3, Clock, 
  Table as TableIcon, GripVertical, X, User, Tag, Paperclip, 
  MessageSquare, CheckSquare, MoreHorizontal, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

/* -------------------------------------------------- */
/* TYPES & MOCK DATA */
/* -------------------------------------------------- */

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
  metrics?: {
    attachments: number;
    comments: number;
    subtasks: { completed: number; total: number };
  };
}

const initialTasks: Task[] = [
  { 
    id: 't1', 
    title: 'Finalize Q4 Campaign Assets', 
    status: 'in-progress', 
    priority: 'high', 
    assignee: 'Sarah Chen', 
    dueDate: '2026-04-28', 
    labels: ['Design', 'Marketing'],
    description: 'Complete final assets for social, web, and print. Include variations and source files.',
    metrics: { attachments: 4, comments: 2, subtasks: { completed: 2, total: 5 } }
  },
  { 
    id: 't2', 
    title: 'Review Brand Guidelines v2', 
    status: 'review', 
    priority: 'medium', 
    assignee: 'Marcus Rivera', 
    dueDate: '2026-04-25', 
    labels: ['Brand', 'Internal'],
    description: 'Check consistency across all assets and update color usage section.',
    metrics: { attachments: 1, comments: 8, subtasks: { completed: 4, total: 4 } }
  },
  { 
    id: 't3', 
    title: 'Update Onboarding Flow', 
    status: 'todo', 
    priority: 'high', 
    assignee: 'Alex Foster', 
    dueDate: '2026-05-02', 
    labels: ['Product', 'UX'],
    description: 'Redesign the first 3 steps of the user onboarding to reduce drop-off.',
    metrics: { attachments: 0, comments: 0, subtasks: { completed: 0, total: 3 } }
  },
  { 
    id: 't4', 
    title: 'Weekly Sync Prep', 
    status: 'done', 
    priority: 'low', 
    assignee: 'Sarah Chen', 
    dueDate: '2026-04-20', 
    labels: ['Internal'],
    description: 'Gather metrics for the weekly all-hands meeting.',
    metrics: { attachments: 2, comments: 1, subtasks: { completed: 1, total: 1 } }
  },
];

/* -------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------- */

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getPriorityStyles = (priority: TaskPriority) => {
  if (priority === 'high') return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20';
  if (priority === 'medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20';
  return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo': return 'bg-slate-200 dark:bg-slate-800';
    case 'in-progress': return 'bg-blue-500';
    case 'review': return 'bg-amber-500';
    case 'done': return 'bg-emerald-500';
    default: return 'bg-slate-200';
  }
};

/* -------------------------------------------------- */
/* MAIN COMPONENT */
/* -------------------------------------------------- */

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
    title: '', status: 'todo' as TaskStatus, priority: 'medium' as TaskPriority,
    assignee: '', dueDate: '', description: '', labels: ''
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* Drag & Drop Handlers */
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  /* Create / Update */
  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTask.title,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee || undefined,
      dueDate: newTask.dueDate || undefined,
      description: newTask.description || undefined,
      labels: newTask.labels.split(',').map(l => l.trim()).filter(Boolean),
      metrics: { attachments: 0, comments: 0, subtasks: { completed: 0, total: 0 } }
    };
    setTasks([task, ...tasks]);
    setShowNewTaskModal(false);
    setNewTask({ title: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '', description: '', labels: '' });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  const columns = [
    { status: 'todo' as const, label: 'To Do' },
    { status: 'in-progress' as const, label: 'In Progress' },
    { status: 'review' as const, label: 'Review' },
    { status: 'done' as const, label: 'Done' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* HEADER & CONTROLS */}
      <div className="flex-none p-6 pb-4 border-b space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Active Sprints</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage creative deliverables and team workflow</p>
          </div>
          <Button onClick={() => setShowNewTaskModal(true)} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full bg-muted/50 focus-visible:bg-background transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            <div className="flex rounded-md border bg-muted/50 p-1">
              {[
                { mode: 'list', icon: List },
                { mode: 'board', icon: Grid3X3 },
                { mode: 'table', icon: TableIcon },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as ViewMode)}
                  className={`p-1.5 rounded-sm transition-all ${
                    viewMode === mode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={mode.charAt(0).toUpperCase() + mode.slice(1)}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-border mx-1" />

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | 'all')}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* VIEWS AREA */}
      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        
        {/* === BOARD VIEW === */}
        {viewMode === 'board' && (
          <div className="flex gap-6 h-full items-start overflow-x-auto pb-4">
            {columns.map((col) => {
              const columnTasks = filteredTasks.filter(t => t.status === col.status);
              return (
                <div
                  key={col.status}
                  className="flex flex-col min-w-[320px] w-[320px] max-h-full bg-muted/40 rounded-xl border p-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.status)}
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(col.status)}`} />
                      <h3 className="font-semibold text-sm tracking-tight capitalize">{col.label.replace('-', ' ')}</h3>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">{columnTasks.length}</Badge>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pb-2">
                    {columnTasks.length === 0 ? (
                      <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                        Drop tasks here
                      </div>
                    ) : (
                      columnTasks.map(task => (
                        <Card
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedTask(task)}
                          className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm group"
                        >
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex gap-2 flex-wrap">
                                {task.labels?.map(label => (
                                  <Badge key={label} variant="secondary" className="text-[10px] px-1.5 py-0 rounded-sm font-medium">
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>

                            <div>
                              <p className="font-medium text-sm leading-tight">{task.title}</p>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <Badge className={`text-[11px] px-2 py-0 h-5 font-medium uppercase tracking-wider ${getPriorityStyles(task.priority)}`} variant="outline">
                                {task.priority}
                              </Badge>

                              <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium">
                                {task.metrics?.subtasks && task.metrics.subtasks.total > 0 && (
                                  <div className="flex items-center gap-1">
                                    <CheckSquare className="h-3.5 w-3.5" />
                                    <span>{task.metrics.subtasks.completed}/{task.metrics.subtasks.total}</span>
                                  </div>
                                )}
                                {task.assignee && (
                                  <Avatar className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                      {getInitials(task.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* === LIST VIEW === */}
        {viewMode === 'list' && (
          <div className="max-w-5xl mx-auto space-y-3">
            {filteredTasks.map(task => (
              <Card 
                key={task.id} 
                className="hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 w-48 shrink-0">
                    <Badge variant="outline" className="capitalize w-24 justify-center">{task.status.replace('-', ' ')}</Badge>
                    <Badge className={`w-20 justify-center capitalize ${getPriorityStyles(task.priority)}`} variant="outline">
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{task.title}</div>
                    <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-3 flex-wrap">
                      {task.dueDate && (
                        <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {task.dueDate}</span>
                      )}
                      {task.labels && task.labels.length > 0 && (
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {task.labels.join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-muted-foreground">
                    <div className="flex items-center gap-4 text-xs font-medium hidden md:flex">
                      {task.metrics && (
                        <>
                          <div className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />{task.metrics.comments}</div>
                          <div className="flex items-center gap-1.5"><Paperclip className="h-3.5 w-3.5" />{task.metrics.attachments}</div>
                        </>
                      )}
                    </div>
                    {task.assignee ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-muted">{getInitials(task.assignee)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full border border-dashed border-border flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* === TABLE VIEW === */}
        {viewMode === 'table' && (
          <Card className="max-w-6xl mx-auto overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-6 py-4">Task Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Assignee</th>
                    <th className="px-6 py-4">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTasks.map(task => (
                    <tr 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{task.title}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="capitalize font-medium text-xs">
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`capitalize font-medium text-xs ${getPriorityStyles(task.priority)}`} variant="outline">
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{getInitials(task.assignee)}</AvatarFallback></Avatar>
                            <span className="text-muted-foreground">{task.assignee}</span>
                          </div>
                        ) : <span className="text-muted-foreground/50 italic">Unassigned</span>}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {task.dueDate || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* ==================== TASK DETAIL SIDEBAR ==================== */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/20 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md bg-card border-l border-border shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <span className="uppercase">{selectedTask.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedTask(null)}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Title Section */}
              <div>
                <Textarea
                  value={selectedTask.title}
                  onChange={(e) => updateTask({ ...selectedTask, title: e.target.value })}
                  className="text-xl font-semibold border-transparent px-0 focus-visible:ring-0 resize-none min-h-[40px] p-0"
                  rows={2}
                />
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-[100px_1fr] gap-y-4 gap-x-2 items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <Select value={selectedTask.status} onValueChange={(v) => updateTask({ ...selectedTask, status: v as TaskStatus })}>
                  <SelectTrigger className="h-8 w-[160px] bg-transparent border-transparent hover:bg-muted font-medium capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>

                <span className="text-muted-foreground">Priority</span>
                <Select value={selectedTask.priority} onValueChange={(v) => updateTask({ ...selectedTask, priority: v as TaskPriority })}>
                  <SelectTrigger className="h-8 w-[160px] bg-transparent border-transparent hover:bg-muted font-medium capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <span className="text-muted-foreground">Assignee</span>
                <div className="flex items-center gap-2 w-full max-w-[200px] hover:bg-muted p-1 rounded-md transition-colors cursor-pointer border border-transparent">
                  {selectedTask.assignee ? (
                    <>
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{getInitials(selectedTask.assignee)}</AvatarFallback></Avatar>
                      <Input 
                        value={selectedTask.assignee}
                        onChange={(e) => updateTask({ ...selectedTask, assignee: e.target.value })}
                        className="h-6 border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none"
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground w-full">
                      <User className="h-4 w-4 ml-1" />
                      <span className="text-xs">Unassigned</span>
                    </div>
                  )}
                </div>

                <span className="text-muted-foreground">Due Date</span>
                <Input
                  type="date"
                  value={selectedTask.dueDate || ''}
                  onChange={(e) => updateTask({ ...selectedTask, dueDate: e.target.value })}
                  className="h-8 w-[160px] bg-transparent border-transparent hover:bg-muted shadow-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Description</Label>
                <Textarea
                  value={selectedTask.description || ''}
                  onChange={(e) => updateTask({ ...selectedTask, description: e.target.value })}
                  placeholder="Add a more detailed description..."
                  className="min-h-[120px] bg-muted/30 border-transparent focus-visible:border-border transition-colors resize-y"
                />
              </div>

              {/* Subtasks (Mock Visuals) */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Subtasks</Label>
                  <span className="text-xs font-medium text-muted-foreground">
                    {selectedTask.metrics?.subtasks.completed || 0} / {selectedTask.metrics?.subtasks.total || 0}
                  </span>
                </div>
                {/* Mock Subtask Item */}
                <div className="flex items-start gap-3 group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded-sm border-muted-foreground accent-primary" />
                  <Input defaultValue="Draft initial copy" className="h-7 text-sm bg-transparent border-transparent hover:border-border group-hover:bg-muted/50 px-2 shadow-none" />
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground"><Plus className="h-3 w-3 mr-1"/> Add subtask</Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== NEW TASK MODAL ==================== */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-border">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Create New Task</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={() => setShowNewTaskModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-6 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Task Title</Label>
                <Input autoFocus id="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="What needs to be done?" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={newTask.status} onValueChange={(v) => setNewTask({ ...newTask, status: v as TaskStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Assignee</Label>
                  <Input value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} placeholder="Name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Due Date</Label>
                  <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Labels (comma separated)</Label>
                <Input value={newTask.labels} onChange={(e) => setNewTask({ ...newTask, labels: e.target.value })} placeholder="e.g. Design, Frontend, Urgent" />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Add details..." className="resize-none h-24" />
              </div>
            </CardContent>

            <div className="border-t bg-muted/30 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowNewTaskModal(false)}>Cancel</Button>
              <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>Create Task</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}