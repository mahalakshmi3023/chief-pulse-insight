import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { useSocialData } from '@/contexts/SocialDataContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function PolicyImpact() {
  const { isLoading, schemes, sentimentSeries, fetchedAt } = useSocialData();
  const [showHistorical, setShowHistorical] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading policy impact from live data...</span>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const reactionData = sentimentSeries.map((s, i) => ({
    hour: `${i * 4}h`,
    sentiment: s.positive,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Policy Impact</h1>
          <p className="text-sm text-muted-foreground mt-1">
            From live social data · {fetchedAt?.toLocaleTimeString()}
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs ml-2">Live</Badge>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Compare</span>
          <Switch checked={showHistorical} onCheckedChange={setShowHistorical} />
        </div>
      </div>

      <Panel title="Initiatives Performance" subtitle="Impact derived from live social data">
        <div className="space-y-4">
          {schemes.length > 0 ? schemes.map((scheme) => (
            <div key={scheme.id} className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{scheme.name.slice(0, 60)}</h3>
                  <p className="text-xs text-muted-foreground">{scheme.category} • {new Date(scheme.announcementDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">{scheme.impactScore}</p>
                  <p className="text-xs text-muted-foreground">Impact Score</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${scheme.impactScore}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{scheme.sentimentBefore}%</span>
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-success font-medium">{scheme.sentimentAfter}%</span>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No policy-related content detected in live data</p>
          )}
        </div>
      </Panel>

      <Panel title="Sentiment Reaction Tracker" subtitle="From live data analysis">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reactionData}>
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="sentiment" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: 'hsl(var(--success))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
