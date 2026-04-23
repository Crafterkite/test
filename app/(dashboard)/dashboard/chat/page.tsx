'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Paperclip, Smile, MoreHorizontal, Users, Hash,
  Pin, Search, Phone, Video, ChevronDown, Plus, AtSign,
  Bold, Italic, Link2, List, Minus, Maximize2, X,
  MessageSquare,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  context?: string;
  reactions?: { emoji: string; count: number }[];
}

interface Channel {
  id: string;
  name: string;
  unread?: number;
}

interface FloatingTab {
  channelId: string;
  expanded: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHANNELS: Channel[] = [
  { id: 'general',        name: 'general'                },
  { id: 'brand-reviews',  name: 'brand-reviews',  unread: 3 },
  { id: 'asset-delivery', name: 'asset-delivery'         },
  { id: 'client-bloom',   name: 'client-bloom',   unread: 1 },
  { id: 'design-ops',     name: 'design-ops'             },
];

const ONLINE_MEMBERS = [
  { name: 'Sarah Chen',    id: 'sarah'  },
  { name: 'Marcus Rivera', id: 'marcus' },
  { name: 'Aria Johnson',  id: 'aria'   },
];

const SEED_MESSAGES: Message[] = [
  {
    id: '1', sender: 'Sarah Chen',
    content: "Hey team, can we review the new logo variants for Bloom Studio? I think we're close but want a second opinion on the color palette.",
    time: '11:32 AM', isMe: false,
    context: 'Brand Profile · Bloom Studio',
    reactions: [{ emoji: '👍', count: 2 }],
  },
  {
    id: '2', sender: 'You',
    content: "Sure, I just uploaded them to the asset library. Thoughts on the color variations? The blue feels more on-brand to me.",
    time: '11:34 AM', isMe: true,
  },
  {
    id: '3', sender: 'Marcus Rivera',
    content: "The orange one feels too aggressive. I'd go with the softer blue — it aligns much better with their positioning.",
    time: '11:35 AM', isMe: false,
    reactions: [{ emoji: '✅', count: 3 }, { emoji: '💯', count: 1 }],
  },
  {
    id: '4', sender: 'You',
    content: "Agreed. I'll finalize the blue and create a task to get client sign-off by EOD.",
    time: '11:36 AM', isMe: true,
    context: 'Task created → Logo Finalization · Bloom Studio',
  },
  {
    id: '5', sender: 'Aria Johnson',
    content: "Can someone share the brand guidelines doc too? Want to make sure the new logo passes the contrast check.",
    time: '11:40 AM', isMe: false,
  },
];

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg, showAvatar }: { msg: Message; showAvatar: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group relative flex gap-3 px-4 py-1 hover:bg-accent/20 rounded-lg transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-8 flex-shrink-0 pt-0.5">
        {showAvatar && (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px] font-bold text-white" style={{ backgroundColor: stringToColor(msg.sender) }}>
              {getInitials(msg.sender)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[13px] font-semibold text-foreground">{msg.isMe ? 'You' : msg.sender}</span>
            <span className="text-[11px] text-muted-foreground">{msg.time}</span>
          </div>
        )}
        <p className="text-[13.5px] leading-relaxed text-foreground/90">{msg.content}</p>
        {msg.context && (
          <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1">
            <Link2 className="h-3 w-3 text-primary/70" />
            <span className="text-[11px] text-primary/80 font-medium">{msg.context}</span>
          </div>
        )}
        {msg.reactions && (
          <div className="mt-1.5 flex items-center gap-1.5">
            {msg.reactions.map((r, i) => (
              <button key={i} className="flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <span>{r.emoji}</span>
                <span className="text-muted-foreground font-medium">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {hovered && (
        <div className="absolute right-4 -top-4 flex items-center gap-0.5 rounded-lg border border-border bg-card px-1 py-0.5 shadow-md z-10">
          {['👍', '✅', '😄'].map((e) => (
            <button key={e} className="rounded px-1.5 py-1 text-[13px] hover:bg-accent transition-colors">{e}</button>
          ))}
          <div className="mx-0.5 h-4 w-px bg-border" />
          <button className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ComposeBox ───────────────────────────────────────────────────────────────

function ComposeBox({ channelName, onSend, compact = false }: { channelName: string; onSend: (t: string) => void; compact?: boolean }) {
  const [value, setValue] = useState('');
  const [showFmt, setShowFmt] = useState(false);
  const send = () => { if (!value.trim()) return; onSend(value.trim()); setValue(''); };
  return (
    <div className={cn('flex-shrink-0 border-t border-border', compact ? 'p-2' : 'p-4')}>
      <div className="rounded-xl border border-border bg-muted/50 transition-colors focus-within:border-primary/40 focus-within:bg-card">
        {showFmt && !compact && (
          <div className="flex items-center gap-0.5 border-b border-border px-3 py-1.5">
            {[Bold, Italic, Link2, List].map((Icon, i) => (
              <button key={i} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}
        <div className={cn('px-3', compact ? 'py-2' : 'py-2.5')}>
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Message #${channelName}`}
            className="w-full resize-none bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
            style={{ minHeight: '20px', maxHeight: compact ? '60px' : '120px' }}
          />
        </div>
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-0.5">
            {[Paperclip, Smile, AtSign].map((Icon, i) => (
              <button key={i} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
            {!compact && (
              <button
                onClick={() => setShowFmt(v => !v)}
                className={cn('rounded-md px-2 py-1 text-[11px] font-bold transition-colors', showFmt ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}
              >A</button>
            )}
          </div>
          <button
            onClick={send}
            disabled={!value.trim()}
            className={cn('flex h-7 w-7 items-center justify-center rounded-lg transition-all', value.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground/40 cursor-not-allowed')}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {!compact && (
        <p className="mt-2 text-center text-[10.5px] text-muted-foreground/60">
          Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">Enter</kbd> to send ·{' '}
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">Shift+Enter</kbd> for new line
        </p>
      )}
    </div>
  );
}

// ─── FloatingChat popup ───────────────────────────────────────────────────────

function FloatingChat({ channel, messages, onSend, onToggle, onClose }: {
  channel: Channel;
  messages: Message[];
  onSend: (t: string) => void;
  onToggle: () => void;
  onClose: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  return (
    <div className="flex flex-col w-72 h-[380px] rounded-t-xl border border-border border-b-0 bg-card shadow-xl overflow-hidden">
      <div
        className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-border bg-card/90 px-3 cursor-pointer select-none"
        onClick={onToggle}
      >
        <Hash className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="flex-1 text-[13px] font-semibold text-foreground truncate">{channel.name}</span>
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Minus className="h-3 w-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
        {messages.map((msg, i) => {
          const showAvatar = !messages[i - 1] || messages[i - 1].sender !== msg.sender;
          return <MessageBubble key={msg.id} msg={msg} showAvatar={showAvatar} />;
        })}
        <div ref={bottomRef} />
      </div>
      <ComposeBox channelName={channel.name} onSend={onSend} compact />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [msgMap, setMsgMap] = useState<Record<string, Message[]>>(
    Object.fromEntries(CHANNELS.map((c) => [c.id, SEED_MESSAGES.map((m) => ({ ...m }))]))
  );
  const [floatingTabs, setFloatingTabs] = useState<FloatingTab[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentMsgs = msgMap[activeChannel] ?? [];
  const currentCh   = CHANNELS.find((c) => c.id === activeChannel)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMsgs]);

  const sendMsg = useCallback((channelId: string, text: string) => {
    setMsgMap((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] ?? []), {
        id: Date.now().toString(), sender: 'You', content: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      }],
    }));
  }, []);

  const openTab = (channelId: string) => {
    setFloatingTabs((prev) =>
      prev.find((t) => t.channelId === channelId)
        ? prev.map((t) => t.channelId === channelId ? { ...t, expanded: !t.expanded } : t)
        : [...prev, { channelId, expanded: true }]
    );
  };
  const toggleTab  = (id: string) => setFloatingTabs((p) => p.map((t) => t.channelId === id ? { ...t, expanded: !t.expanded } : t));
  const closeTab   = (id: string) => setFloatingTabs((p) => p.filter((t) => t.channelId !== id));

  return (
    <>
      {/* ════ Page view ════ */}
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-border bg-card transition-all">

        {/* Channel rail */}
        <aside className="hidden w-52 flex-shrink-0 flex-col border-r border-border bg-card/60 lg:flex">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Channels</span>
            <button className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Scrollable channel list */}
          <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                  activeChannel === ch.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="flex-1 truncate text-[13px] font-medium">{ch.name}</span>
                {ch.unread ? (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{ch.unread}</span>
                ) : null}
              </button>
            ))}
          </nav>

          {/* Online members — fixed at bottom */}
          <div className="border-t border-border px-4 py-3 flex-shrink-0">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Online · {ONLINE_MEMBERS.length}</p>
            <div className="space-y-1.5">
              {ONLINE_MEMBERS.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[8px] font-bold text-white" style={{ backgroundColor: stringToColor(m.id) }}>
                        {getInitials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card bg-emerald-500" />
                  </div>
                  <span className="truncate text-[12px] text-muted-foreground">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main chat — fixed header + scrollable messages + fixed compose */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

          {/* Fixed channel header */}
          <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border px-5">
            <div className="flex items-center gap-2.5">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-[15px] font-semibold text-foreground">{currentCh?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              {([Pin, Users, Search, Phone, Video] as React.ComponentType<{ className?: string }>[]).map((Icon, i) => (
                <button key={i} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
              <div className="mx-1 h-5 w-px bg-border" />
              {/* Pop out current channel as floating tab - minimizes main chat logic removed */}
              <button
                title="Pop out as floating chat"
                onClick={() => { openTab(activeChannel); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable messages — only this div scrolls */}
          <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
            <div className="flex items-center gap-3 py-1 px-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] font-medium text-muted-foreground px-2">Today</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            {currentMsgs.map((msg, i) => {
              const showAvatar = !currentMsgs[i - 1] || currentMsgs[i - 1].sender !== msg.sender;
              return <MessageBubble key={msg.id} msg={msg} showAvatar={showAvatar} />;
            })}
            <div ref={bottomRef} />
          </div>

          {/* Fixed compose box */}
          <ComposeBox channelName={currentCh?.name ?? ''} onSend={(t) => sendMsg(activeChannel, t)} />
        </div>
      </div>

      {/* ════ Bottom-right floating tab bar ════ */}
      <div className="fixed bottom-0 right-6 z-50 flex items-end gap-2">

        {floatingTabs.map((tab) => {
          const ch   = CHANNELS.find((c) => c.id === tab.channelId)!;
          const msgs = msgMap[tab.channelId] ?? [];
          return (
            <div key={tab.channelId} className="flex flex-col items-stretch">
              {/* Popup — only when expanded */}
              {tab.expanded && (
                <FloatingChat
                  channel={ch}
                  messages={msgs}
                  onSend={(t) => sendMsg(tab.channelId, t)}
                  onToggle={() => toggleTab(tab.channelId)}
                  onClose={() => closeTab(tab.channelId)}
                />
              )}
              {/* Tab pill */}
              <button
                onClick={() => toggleTab(tab.channelId)}
                className={cn(
                  'flex items-center gap-2 rounded-t-lg border border-b-0 px-3 py-2 shadow-lg transition-colors',
                  tab.expanded ? 'border-primary/30 bg-primary/10' : 'border-border bg-card hover:bg-accent'
                )}
              >
                <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-[12.5px] font-medium text-foreground max-w-[90px] truncate">{ch.name}</span>
                <ChevronDown className={cn('h-3 w-3 text-muted-foreground transition-transform', tab.expanded && 'rotate-180')} />
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.channelId); }}
                  className="ml-1 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </span>
              </button>
            </div>
          );
        })}

        {/* New floating tab button — always visible */}
        <button
          onClick={() => {
            const next = CHANNELS.find((c) => !floatingTabs.find((t) => t.channelId === c.id));
            if (next) openTab(next.id);
          }}
          title="Open chat in floating tab"
          className="flex items-center gap-1.5 rounded-t-lg border border-border border-b-0 bg-card px-3 py-2 shadow-lg hover:bg-accent transition-colors mb-0"
        >
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          <Plus className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </>
  );
}