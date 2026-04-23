'use client';

import React, { useState } from 'react';
import { Bot, Zap, Search, Users, FileText, Palette, ArrowRight, Play, Pause, Brain, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const agents = [
  {
    id: 'brief',
    name: 'Brief Agent',
    icon: FileText,
    color: 'bg-blue-500',
    description: 'Helps craft clear, comprehensive creative briefs',
    status: 'online',
    expertise: ['Briefing', 'Requirements Analysis', 'Stakeholder Alignment'],
    usage: 'Helped with 12 briefs this week',
    lastActive: '2 minutes ago',
  },
  {
    id: 'research',
    name: 'Research Agent',
    icon: Search,
    color: 'bg-purple-500',
    description: 'Finds brand assets, past work & guidelines instantly',
    status: 'online',
    expertise: ['Asset Discovery', 'Brand Compliance', 'Reference Search'],
    usage: 'Found 47 assets today',
    lastActive: 'now',
  },
  {
    id: 'task',
    name: 'Task Agent',
    icon: Zap,
    color: 'bg-emerald-500',
    description: 'Creates, assigns & tracks tasks intelligently',
    status: 'thinking',
    expertise: ['Task Breakdown', 'Prioritization', 'Dependencies'],
    usage: 'Created 31 tasks this week',
    lastActive: '5 minutes ago',
  },
  {
    id: 'review',
    name: 'Review Agent',
    icon: Palette,
    color: 'bg-amber-500',
    description: 'Provides structured feedback on designs & assets',
    status: 'online',
    expertise: ['Design Critique', 'Brand Alignment', 'Improvement Suggestions'],
    usage: 'Reviewed 19 assets',
    lastActive: '1 hour ago',
  },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [messages, setMessages] = useState([
    { id: 1, content: "Hi! I'm your Brief Agent. How can I help you write a strong creative brief today?", isAgent: true, time: "just now" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), content: input, isAgent: false, time: "just now" };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate agent thinking + response
    setTimeout(() => {
      const responses = [
        "Got it. Let me help you structure a clear brief for this request.",
        "Based on your brand guidelines, I recommend focusing on these key deliverables...",
        "I've analyzed similar past projects. Here's a suggested timeline and scope.",
      ];
      const agentReply = {
        id: Date.now() + 1,
        content: responses[Math.floor(Math.random() * responses.length)],
        isAgent: true,
        time: "just now"
      };
      setMessages(prev => [...prev, agentReply]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <Bot className="h-5 w-5" />
          <span className="uppercase text-xs tracking-[2px] font-medium">INTELLIGENT TEAMMATES</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Agents</h1>
        <p className="text-[15px] text-muted-foreground mt-1">
          Your creative co-pilots that understand your brand and workflow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Library */}
        <div className="lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Agents</h2>
            <Badge variant="secondary">4 Agents</Badge>
          </div>

          <div className="space-y-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isSelected = selectedAgent.id === agent.id;

              return (
                <Card
                  key={agent.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    isSelected && "border-primary ring-1 ring-primary/30"
                  )}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${agent.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-semibold">{agent.name}</h5>
                          <div className={`px-2 py-0.5 text-[10px] rounded-full ${agent.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {agent.status}
                          </div>
                        </div>
                        <p className="text-[13px] text-muted-foreground line-clamp-2 mt-1">{agent.description}</p>
                        <div className="mt-3 text-[11px] text-muted-foreground">
                          Last active: {agent.lastActive}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Agent Interaction Area */}
        <div className="lg:col-span-8">
          <Card className="h-[640px] flex flex-col overflow-hidden">
            {/* Agent Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${selectedAgent.color}`}>
                  <selectedAgent.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedAgent.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedAgent.expertise[0]}
                </Badge>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isAgent ? '' : 'justify-end'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${msg.isAgent ? 'bg-card border border-border' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-[14.5px] leading-relaxed">{msg.content}</p>
                    <p className="text-right text-[10px] mt-2 opacity-70">{msg.time}</p>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-pulse">●●●</div>
                  <span className="text-sm">{selectedAgent.name} is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-5 bg-card">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${selectedAgent.name}...`}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!input.trim()}>
                  Send
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-center text-[11px] text-muted-foreground mt-3">
                This agent has full context of your brand guidelines and recent work
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}