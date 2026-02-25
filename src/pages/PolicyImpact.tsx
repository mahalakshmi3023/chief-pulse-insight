import { Panel } from '@/components/dashboard/Panel';
import { useSocialData } from '@/contexts/SocialDataContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const pos = ['good', 'great', 'success', 'benefit', 'improve', 'growth', 'happy', 'excellent'].filter(w => lower.includes(w)).length;
  const neg = ['bad', 'fail', 'crisis', 'protest', 'scam', 'corruption', 'poor', 'flood'].filter(w => lower.includes(w)).length;
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

export default function PolicyImpact() {
  const { isLoading, topics, allPosts, fetchedAt, search, query } = useSocialData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading policy impact data...</span>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const total = allPosts.length || 1;
  const pos = allPosts.filter(p => detectSentiment(p.text) === 'positive').length;
  const neg = allPosts.filter(p => detectSentiment(p.text) === 'negative').length;
  const posPercent = Math.round((pos / total) * 100);
  const negPercent = Math.round((neg / total) * 100);
  const neuPercent = 100 - posPercent - negPercent;

  const pieData = [
    { name: 'Positive', value: posPercent, color: 'hsl(var(--success))' },
    { name: 'Neutral', value: neuPercent, color: 'hsl(var(--muted-foreground))' },
    { name: 'Negative', value: negPercent, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Policy Impact</h1>
          <p className="text-sm text-muted-foreground mt-1">Topic analysis from live social data</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => search(query)}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <Panel title="Topic Impact Analysis" subtitle="Topics derived from live social media data">
        <div className="space-y-3">
          {topics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div>
                <p className="font-medium text-foreground">{topic.name}</p>
                <p className="text-xs text-muted-foreground">{topic.category} · {topic.volume.toLocaleString()} mentions</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{(topic.volume / 1000).toFixed(1)}K</span>
                <TrendingUp className={`w-4 h-4 ${topic.trend === 'rising' ? 'text-success' : topic.trend === 'falling' ? 'text-destructive' : 'text-muted-foreground'}`} />
              </div>
            </div>
          ))}
          {topics.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No topics detected. Try refreshing with a different query.</p>
          )}
        </div>
      </Panel>

      <Panel title="Overall Sentiment Impact" subtitle="Sentiment distribution from live data">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-border">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
