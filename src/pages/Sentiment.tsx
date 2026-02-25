import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { useSocialData } from '@/contexts/SocialDataContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CountUp } from '@/components/AnimatedNumber';
import { Heart, ThumbsUp, ThumbsDown, Minus, RefreshCw, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const pos = ['good', 'great', 'success', 'benefit', 'improve', 'growth', 'happy', 'excellent', 'proud', 'win'].filter(w => lower.includes(w)).length;
  const neg = ['bad', 'fail', 'crisis', 'protest', 'scam', 'corruption', 'poor', 'flood', 'death', 'worst'].filter(w => lower.includes(w)).length;
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

export default function Sentiment() {
  const { isLoading, allPosts, sentimentSeries, emotionsSeries, fetchedAt, search, query } = useSocialData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading sentiment data...</span>
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const posPosts = allPosts.filter(p => detectSentiment(p.text) === 'positive');
  const negPosts = allPosts.filter(p => detectSentiment(p.text) === 'negative');
  const neuPosts = allPosts.filter(p => detectSentiment(p.text) === 'neutral');
  const total = allPosts.length || 1;
  const posPercent = Math.round((posPosts.length / total) * 100);
  const negPercent = Math.round((negPosts.length / total) * 100);
  const neuPercent = 100 - posPercent - negPercent;

  const pieData = [
    { name: 'Positive', value: posPercent, color: 'hsl(var(--success))' },
    { name: 'Neutral', value: neuPercent, color: 'hsl(var(--muted-foreground))' },
    { name: 'Negative', value: negPercent, color: 'hsl(var(--destructive))' },
  ];

  const latestEmotions = emotionsSeries[emotionsSeries.length - 1] || { anger: 0, fear: 0, hope: 0, trust: 0 };
  const radarData = [
    { emotion: 'Anger', value: latestEmotions.anger },
    { emotion: 'Fear', value: latestEmotions.fear },
    { emotion: 'Hope', value: latestEmotions.hope },
    { emotion: 'Trust', value: latestEmotions.trust },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            Sentiment & Emotion
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Derived from {allPosts.length} live social media posts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => search(query)}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20">
            <ThumbsUp className="w-4 h-4 text-success" />
            <div>
              <p className="text-xs text-success/70">Positive</p>
              <p className="text-lg font-bold text-success">{posPercent}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border">
            <Minus className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Neutral</p>
              <p className="text-lg font-bold text-foreground">{neuPercent}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
            <ThumbsDown className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-xs text-destructive/70">Negative</p>
              <p className="text-lg font-bold text-destructive">{negPercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Sentiment + Emotion Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Current Sentiment" subtitle="From live social data analysis">
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-bold text-foreground">{posPercent}%</p>
              <p className="text-xs text-muted-foreground">Positive</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            {pieData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}%</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Emotion Radar" subtitle="Emotional state from posts">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Radar name="Emotions" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
            {radarData.map((item) => (
              <div key={item.emotion} className="p-2 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">{item.emotion}</p>
                <p className="text-lg font-bold text-foreground">{item.value}%</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Sample Posts by Sentiment */}
      <Panel title="Sample Posts by Sentiment" subtitle="Recent posts analyzed for sentiment">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-success mb-3">Positive ({posPosts.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {posPosts.slice(0, 5).map((p, i) => (
                <div key={i} className="p-2 rounded-lg bg-success/5 border border-success/10 text-xs text-foreground line-clamp-2">{p.text}</div>
              ))}
              {posPosts.length === 0 && <p className="text-xs text-muted-foreground">No positive posts</p>}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-destructive mb-3">Negative ({negPosts.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {negPosts.slice(0, 5).map((p, i) => (
                <div key={i} className="p-2 rounded-lg bg-destructive/5 border border-destructive/10 text-xs text-foreground line-clamp-2">{p.text}</div>
              ))}
              {negPosts.length === 0 && <p className="text-xs text-muted-foreground">No negative posts</p>}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Neutral ({neuPosts.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {neuPosts.slice(0, 5).map((p, i) => (
                <div key={i} className="p-2 rounded-lg bg-muted/30 border border-border/50 text-xs text-foreground line-clamp-2">{p.text}</div>
              ))}
              {neuPosts.length === 0 && <p className="text-xs text-muted-foreground">No neutral posts</p>}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
