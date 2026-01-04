import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { schemes } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function PolicyImpact() {
  const [showHistorical, setShowHistorical] = useState(false);

  // Mock reaction data for chart
  const reactionData = [
    { hour: '0h', sentiment: 45 },
    { hour: '6h', sentiment: 52 },
    { hour: '12h', sentiment: 58 },
    { hour: '24h', sentiment: 65 },
    { hour: '48h', sentiment: 68 },
    { hour: '72h', sentiment: 72 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Policy Impact</h1>
          <p className="text-sm text-muted-foreground mt-1">Measure scheme effectiveness</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Compare to last year</span>
          <Switch checked={showHistorical} onCheckedChange={setShowHistorical} />
        </div>
      </div>

      <Panel title="Schemes Performance" subtitle="Impact scores and sentiment changes">
        <div className="space-y-4">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{scheme.name}</h3>
                  <p className="text-xs text-muted-foreground">{scheme.category} • Announced {new Date(scheme.announcementDate).toLocaleDateString()}</p>
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
          ))}
        </div>
      </Panel>

      <Panel title="Announcement Reaction Tracker" subtitle="First 72-hour sentiment trend">
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