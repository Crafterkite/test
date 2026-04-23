'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Calendar as CalendarIcon, List, Grid3X3, 
  Table as TableIcon, GripVertical, X, User, Tag, Paperclip, 
  MessageSquare, CheckSquare, MoreHorizontal, ArrowRight,
  Star, LayoutTemplate, Filter, Download, Send, Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

/* -------------------------------------------------- */
/* TYPES & MOCK DATA */
/* -------------------------------------------------- */

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';
type ViewMode = 'list' | 'board' | 'calendar' | 'table';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner?: string;
  assignee?: string;
  dueDate?: string;
  labels?: string[];
  description?: string;
  isStarred?: boolean;
  comments: Comment[];
  metrics?: {
    attachments: number;
    subtasks: { completed: number; total: number };
  };
}

const initialTasks: Task[] = [
  { 
    id: 't1', title: 'Finalize Q4 Campaign Assets', status: 'in-progress', priority: 'high', 
    owner: 'Jessica Wong', assignee: 'Sarah Chen', dueDate: '2026-04-28', 
    labels: ['Design', 'Marketing'], isStarred: true,
    description: 'Complete final assets for social, web, and print. Include variations and source files.',
    comments: [
      { id: 'c1', user: 'Jessica Wong', text: 'Make sure to include the wide banner format!', timestamp: '2 hours ago' }
    ],
    metrics: { attachments: 4, subtasks: { completed: 2, total: 5 } }
  },
  { 
    id: 't2', title: 'Review Brand Guidelines v2', status: 'review', priority: 'medium', 
    owner: 'Alex Foster', assignee: 'Marcus Rivera', dueDate: '2026-04-25', 
    labels: ['Brand', 'Internal'], isStarred: false,
    description: 'Check consistency across all assets and update color usage section.',
    comments: [],
    metrics: { attachments: 1, subtasks: { completed: 4, total: 4 } }
  },
  { 
    id: 't3', title: 'Update Onboarding Flow', status: 'todo', priority: 'high', 
    owner: 'Sarah Chen', assignee: 'Alex Foster', dueDate: '2026-05-02', 
    labels: ['Product', 'UX'], isStarred: true,
    description: 'Redesign the first 3 steps of the user onboarding to reduce drop-off.',
    comments: [],
    metrics: { attachments: 0, subtasks: { completed: 0, total: 3 } }
  },
];

const TEMPLATES = [
  { name: 'Bug Report', title: '[BUG] ', priority: 'high', labels: 'Bug, Triage', desc: 'Steps to reproduce:\n1.\n2.\n\nExpected:\nActual:' },
  { name: 'Feature Request', title: '[FEATURE] ', priority: 'medium', labels: 'Enhancement', desc: 'User Story:\nAs a [user], I want [feature] so that [benefit].' },
  { name: 'Design Asset', title: 'Design: ', priority: 'medium', labels: 'Design', desc: 'Asset details:\n- Dimensions:\n- Format:\n- Reference:' }
];

/* -------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------- */

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const getPriorityStyles = (priority: TaskPriority) => {
  if (priority === 'high') return 'bg-red-500/10 text-red-600 border-red-500/20';
  if (priority === 'medium') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo': return 'bg-slate-300';
    case 'in-progress': return 'bg-blue-500';
    case 'review': return 'bg-amber-500';
    case 'done': return 'bg-emerald-500';
    default: return 'bg-slate-300';
  }
};

/* -------------------------------------------------- */
/* MAIN COMPONENT */
/* -------------------------------------------------- */

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [starredFilter, setStarredFilter] = useState(false);

  // Selection & Details
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'details' | 'activity'>('details');
  const [newComment, setNewComment] = useState('');

  // Modals
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', status: 'todo' as TaskStatus, priority: 'medium' as TaskPriority,
    owner: '', assignee: '', dueDate: '', description: '', labels: ''
  });

  /* Derived Data */
  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStarred = !starredFilter || task.isStarred;
    return matchesSearch && matchesStatus && matchesPriority && matchesStarred;
  }), [tasks, searchQuery, statusFilter, priorityFilter, starredFilter]);

  const metrics = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
    starred: tasks.filter(t => t.isStarred).length,
  };

  /* Handlers */
  const handleDragStart = (e: React.DragEvent, taskId: string) => { e.dataTransfer.setData('text/plain', taskId); };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTask.title, status: newTask.status, priority: newTask.priority,
      owner: newTask.owner || 'Unassigned', assignee: newTask.assignee || undefined,
      dueDate: newTask.dueDate || undefined, description: newTask.description || undefined,
      labels: newTask.labels.split(',').map(l => l.trim()).filter(Boolean),
      comments: [], isStarred: false,
      metrics: { attachments: 0, subtasks: { completed: 0, total: 0 } }
    };
    setTasks([task, ...tasks]);
    setShowNewTaskModal(false);
    setNewTask({ title: '', status: 'todo', priority: 'medium', owner: '', assignee: '', dueDate: '', description: '', labels: '' });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  const toggleStar = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isStarred: !t.isStarred } : t));
    if (selectedTask?.id === taskId) setSelectedTask(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    const comment = { id: Date.now().toString(), user: 'Current User', text: newComment, timestamp: 'Just now' };
    const updatedTask = { ...selectedTask, comments: [...selectedTask.comments, comment] };
    updateTask(updatedTask);
    setNewComment('');
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setNewTask(prev => ({ ...prev, title: template.title, priority: template.priority as TaskPriority, description: template.desc, labels: template.labels }));
    setShowNewTaskModal(true);
  };

  const columns = [
    { status: 'todo' as const, label: 'To Do' },
    { status: 'in-progress' as const, label: 'In Progress' },
    { status: 'review' as const, label: 'Review' },
    { status: 'done' as const, label: 'Done' },
  ];

  /* Calendar Helper (Simplified Month View based on April 2026 data) */
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      const dateStr = `2026-04-${i.toString().padStart(2, '0')}`;
      const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr);
      days.push({ day: i, dateStr, tasks: dayTasks });
    }
    return days;
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* ================= HEADER & TOP BAR ================= */}
      <div className="flex-none px-6 pt-6 pb-4 border-b space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage deliverables, sprint goals, and team workflow.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" title="Export CSV"><Download className="h-4 w-4" /></Button>
            
            {/* Templates Dropdown Simulation */}
            <div className="relative group">
              <Button variant="outline"><LayoutTemplate className="mr-2 h-4 w-4" /> Templates</Button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-1">
                  {TEMPLATES.map(t => (
                    <button key={t.name} onClick={() => applyTemplate(t)} className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm">
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={() => setShowNewTaskModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>
        </div>

        {/* ================= STATUS WIDGETS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: 'Total', val: metrics.total, color: 'text-foreground' },
            { label: 'To Do', val: metrics.todo, color: 'text-slate-500' },
            { label: 'In Progress', val: metrics.inProgress, color: 'text-blue-500' },
            { label: 'Review', val: metrics.review, color: 'text-amber-500' },
            { label: 'Done', val: metrics.done, color: 'text-emerald-500' },
            { label: 'Starred', val: metrics.starred, color: 'text-yellow-500', icon: Star },
          ].map(widget => (
            <Card key={widget.label} className="bg-muted/30 border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{widget.label}</p>
                  <p className={`text-2xl font-bold ${widget.color}`}>{widget.val}</p>
                </div>
                {widget.icon && <widget.icon className={`h-5 w-5 ${widget.color} opacity-50`} />}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ================= CONTROLS & FILTERS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
            </div>
            <Button variant={showFilters ? "secondary" : "outline"} size="sm" onClick={() => setShowFilters(!showFilters)} className="h-9">
              <Filter className="h-4 w-4 mr-2" /> Filter { (statusFilter !== 'all' || priorityFilter !== 'all' || starredFilter) && '(Active)' }
            </Button>
          </div>

          <div className="flex items-center gap-1 rounded-md border p-1 bg-muted/20">
            {[ { mode: 'board', icon: Grid3X3 }, { mode: 'list', icon: List }, { mode: 'calendar', icon: CalendarIcon }, { mode: 'table', icon: TableIcon } ].map(({ mode, icon: Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode as ViewMode)} className={`p-1.5 rounded-sm transition-all ${viewMode === mode ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Bar */}
        {showFilters && (
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border text-sm animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Status:</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | 'all')}>
                <SelectTrigger className="h-7 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="todo">To Do</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="done">Done</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Priority:</Label>
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TaskPriority | 'all')}>
                <SelectTrigger className="h-7 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 ml-4 border-l pl-4">
              <button onClick={() => setStarredFilter(!starredFilter)} className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors ${starredFilter ? 'bg-yellow-500/10 text-yellow-600' : 'hover:bg-muted'}`}>
                <Star className={`h-4 w-4 ${starredFilter ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} /> Starred Only
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= VIEWS AREA ================= */}
      <div className="flex-1 overflow-auto p-6 bg-muted/10">
        
        {/* === BOARD VIEW === */}
        {viewMode === 'board' && (
          <div className="flex gap-6 h-full items-start overflow-x-auto pb-4">
            {columns.map((col) => {
              const columnTasks = filteredTasks.filter(t => t.status === col.status);
              return (
                <div key={col.status} className="flex flex-col min-w-[320px] w-[320px] bg-muted/30 rounded-xl border p-3 h-full max-h-full" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col.status)}>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(col.status)}`} />
                      <h3 className="font-semibold text-sm capitalize">{col.label}</h3>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">{columnTasks.length}</Badge>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto pb-2 flex-1 hide-scrollbar">
                    {columnTasks.length === 0 ? (
                      <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground">Drop tasks here</div>
                    ) : (
                      columnTasks.map(task => (
                        <Card key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} onClick={() => setSelectedTask(task)} className="cursor-pointer hover:border-primary/40 shadow-sm group">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex gap-1.5 flex-wrap">
                                {task.labels?.map(l => <Badge key={l} variant="secondary" className="text-[10px] px-1.5 py-0">{l}</Badge>)}
                              </div>
                              <button onClick={(e) => toggleStar(e, task.id)} className="text-muted-foreground hover:text-yellow-500 transition-colors">
                                <Star className={`h-4 w-4 ${task.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                              </button>
                            </div>
                            <p className="font-medium text-sm leading-snug">{task.title}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                              <Badge className={`text-[10px] px-2 py-0 uppercase ${getPriorityStyles(task.priority)}`} variant="outline">{task.priority}</Badge>
                              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                                {task.comments?.length > 0 && <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3"/>{task.comments.length}</span>}
                                {task.assignee && <Avatar className="h-6 w-6"><AvatarFallback className="text-[9px] bg-primary/10 text-primary">{getInitials(task.assignee)}</AvatarFallback></Avatar>}
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
          <div className="max-w-5xl mx-auto space-y-2">
            {filteredTasks.map(task => (
              <Card key={task.id} className="hover:border-primary/50 cursor-pointer group" onClick={() => setSelectedTask(task)}>
                <CardContent className="p-3 flex items-center gap-4">
                  <button onClick={(e) => toggleStar(e, task.id)} className="shrink-0 p-1">
                    <Star className={`h-4 w-4 ${task.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`} />
                  </button>
                  <div className="flex items-center gap-2 w-40 shrink-0">
                    <Badge variant="secondary" className="capitalize w-24 justify-center font-normal">{task.status.replace('-', ' ')}</Badge>
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} title={task.priority} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{task.title}</div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-muted-foreground text-xs">
                    {task.dueDate && <span className="flex items-center gap-1 w-24"><CalendarIcon className="h-3 w-3" /> {task.dueDate}</span>}
                    {task.assignee && <div className="flex items-center gap-2 w-32"><Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{getInitials(task.assignee)}</AvatarFallback></Avatar> {task.assignee.split(' ')[0]}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* === CALENDAR VIEW === */}
        {viewMode === 'calendar' && (
          <Card className="max-w-6xl mx-auto flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
              <h2 className="font-semibold text-lg">April 2026</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Today</Button>
              </div>
            </div>
            <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground py-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-muted/10">
              {/* Padding for start of month (April 2026 starts on Wed) */}
              {Array.from({ length: 3 }).map((_, i) => <div key={`pad-${i}`} className="border-r border-b p-2 bg-muted/5" />)}
              
              {generateCalendarDays().map(({ day, tasks: dayTasks }) => (
                <div key={day} className="border-r border-b p-2 min-h-[100px] hover:bg-muted/20 transition-colors">
                  <div className="font-medium text-xs text-muted-foreground mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayTasks.map(t => (
                      <div key={t.id} onClick={() => setSelectedTask(t)} className={`text-[10px] p-1 rounded truncate cursor-pointer font-medium ${t.status === 'done' ? 'bg-emerald-500/10 text-emerald-700 line-through' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* === TABLE VIEW === */}
        {viewMode === 'table' && (
          <Card className="max-w-6xl mx-auto overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-4 py-3">Task Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.map(task => (
                  <tr key={task.id} onClick={() => setSelectedTask(task)} className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); toggleStar(e, task.id); }}>
                      <Star className={`h-4 w-4 ${task.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`} />
                    </td>
                    <td className="px-4 py-3 font-medium">{task.title}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="capitalize text-xs font-normal">{task.status.replace('-', ' ')}</Badge></td>
                    <td className="px-4 py-3"><Badge className={`capitalize text-xs font-normal ${getPriorityStyles(task.priority)}`} variant="outline">{task.priority}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{task.owner || '-'}</td>
                    <td className="px-4 py-3">
                      {task.assignee ? <div className="flex items-center gap-2"><Avatar className="h-5 w-5"><AvatarFallback className="text-[8px]">{getInitials(task.assignee)}</AvatarFallback></Avatar> {task.assignee}</div> : '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{task.dueDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* ==================== TASK DETAIL SIDEBAR ==================== */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/40 backdrop-blur-sm transition-all">
          <div className="w-full max-w-lg bg-card border-l shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/10">
              <div className="flex items-center gap-3">
                <button onClick={(e) => toggleStar(e, selectedTask.id)}>
                  <Star className={`h-5 w-5 ${selectedTask.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                </button>
                <span className="text-sm text-muted-foreground font-mono uppercase">{selectedTask.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedTask(null)}><ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-4 gap-4">
              <button onClick={() => setSidebarTab('details')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${sidebarTab === 'details' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Details</button>
              <button onClick={() => setSidebarTab('activity')} className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${sidebarTab === 'activity' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                Activity <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{selectedTask.comments?.length || 0}</Badge>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {sidebarTab === 'details' ? (
                <div className="space-y-8">
                  <Textarea value={selectedTask.title} onChange={(e) => updateTask({ ...selectedTask, title: e.target.value })} className="text-2xl font-bold border-transparent px-0 focus-visible:ring-0 resize-none min-h-[50px] p-0 shadow-none bg-transparent" rows={2} />

                  <div className="grid grid-cols-[100px_1fr] gap-y-4 gap-x-2 items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2"><Activity className="h-3.5 w-3.5"/> Status</span>
                    <Select value={selectedTask.status} onValueChange={(v) => updateTask({ ...selectedTask, status: v as TaskStatus })}>
                      <SelectTrigger className="h-8 w-[180px] bg-muted/50 border-transparent capitalize font-medium"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="todo">To Do</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="done">Done</SelectItem></SelectContent>
                    </Select>

                    <span className="text-muted-foreground flex items-center gap-2"><Tag className="h-3.5 w-3.5"/> Priority</span>
                    <Select value={selectedTask.priority} onValueChange={(v) => updateTask({ ...selectedTask, priority: v as TaskPriority })}>
                      <SelectTrigger className="h-8 w-[180px] bg-muted/50 border-transparent capitalize font-medium"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
                    </Select>

                    <span className="text-muted-foreground flex items-center gap-2"><User className="h-3.5 w-3.5"/> Owner</span>
                    <Input value={selectedTask.owner || ''} onChange={(e) => updateTask({ ...selectedTask, owner: e.target.value })} placeholder="Project Owner" className="h-8 w-[180px] bg-muted/50 border-transparent shadow-none" />

                    <span className="text-muted-foreground flex items-center gap-2"><User className="h-3.5 w-3.5"/> Assignee</span>
                    <Input value={selectedTask.assignee || ''} onChange={(e) => updateTask({ ...selectedTask, assignee: e.target.value })} placeholder="Task Assignee" className="h-8 w-[180px] bg-muted/50 border-transparent shadow-none" />

                    <span className="text-muted-foreground flex items-center gap-2"><CalendarIcon className="h-3.5 w-3.5"/> Due Date</span>
                    <Input type="date" value={selectedTask.dueDate || ''} onChange={(e) => updateTask({ ...selectedTask, dueDate: e.target.value })} className="h-8 w-[180px] bg-muted/50 border-transparent shadow-none" />
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-muted-foreground text-sm font-medium">Description</Label>
                    <Textarea value={selectedTask.description || ''} onChange={(e) => updateTask({ ...selectedTask, description: e.target.value })} placeholder="Add task description..." className="min-h-[150px] bg-muted/20 border-border/50 focus-visible:border-primary resize-y" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex-1 space-y-6">
                    {selectedTask.comments?.length === 0 ? (
                      <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                        <MessageSquare className="h-8 w-8 mb-3 opacity-20" />
                        <p className="text-sm">No comments yet. Start the conversation!</p>
                      </div>
                    ) : (
                      selectedTask.comments?.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(comment.user)}</AvatarFallback></Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{comment.user}</span>
                              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                            </div>
                            <div className="text-sm bg-muted/40 p-3 rounded-lg border border-border/50">
                              {comment.text}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Comment Input Box */}
                  <div className="mt-6 pt-4 border-t sticky bottom-0 bg-card">
                    <div className="flex gap-2 items-end">
                      <Avatar className="h-8 w-8 shrink-0 mb-1"><AvatarFallback className="text-xs">CU</AvatarFallback></Avatar>
                      <div className="relative flex-1">
                        <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Ask a question or post an update..." className="min-h-[80px] resize-none pr-12 pb-10 bg-muted/20" onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(); } }} />
                        <Button size="sm" onClick={addComment} className="absolute bottom-2 right-2 h-7 rounded-sm px-3" disabled={!newComment.trim()}>
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== NEW TASK MODAL ==================== */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl shadow-2xl border-border flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b px-6 py-4 flex-none">
              <h2 className="text-lg font-semibold">Create New Task</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={() => setShowNewTaskModal(false)}><X className="h-4 w-4" /></Button>
            </div>

            <CardContent className="p-6 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title <span className="text-red-500">*</span></Label>
                <Input autoFocus id="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="What needs to be done?" className="text-lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-lg border">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newTask.status} onValueChange={(v) => setNewTask({ ...newTask, status: v as TaskStatus })}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="todo">To Do</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="done">Done</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Input value={newTask.owner} onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })} placeholder="Project Lead" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Input value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} placeholder="Executing Member" className="bg-background" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Labels (comma separated)</Label>
                  <Input value={newTask.labels} onChange={(e) => setNewTask({ ...newTask, labels: e.target.value })} placeholder="e.g. Design, Urgent" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Add detailed context, links, and criteria..." className="resize-y min-h-[120px]" />
              </div>
            </CardContent>

            <div className="border-t bg-muted/30 px-6 py-4 flex justify-between items-center rounded-b-xl flex-none">
              <span className="text-xs text-muted-foreground">* Required fields</span>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setShowNewTaskModal(false)}>Cancel</Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>Create Task</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}