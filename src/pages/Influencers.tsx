import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { AlignmentBadge } from '@/components/dashboard/Badges';
import { useSocialSearch } from '@/hooks/useSocialSearch';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, MessageSquare, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Influencers() {
  const { isLoading, influencers, mediaChannels, fetchedAt } = useSocialSearch();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading influencer data from live APIs...</span>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const biasChartData = mediaChannels.map(ch => ({
    name: ch.name,
    tilt: ch.sentimentTilt,
    fill: ch.sentimentTilt > 0 ? 'hsl(var(--success))' : ch.sentimentTilt < 0 ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Influencers & Media Coverage
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs ml-3">Live API</Badge>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">From live social media APIs · {fetchedAt?.toLocaleTimeString()}</p>
      </div>

      <Panel title="Influencer Impact Tracker" subtitle={`${influencers.length} influencers from live data`}>
        {influencers.length > 0 ? (
          <DataTable
            data={influencers}
            columns={[
              { key: 'name', header: 'Name', render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.handle}</p>
                </div>
              )},
              { key: 'platform', header: 'Platform', render: (item) => <span className="capitalize text-sm">{item.platform}</span> },
              { key: 'followers', header: 'Followers', className: 'hidden md:table-cell', render: (item) => <span>{(item.followers / 1000).toFixed(0)}K</span> },
              { key: 'reach', header: 'Reach', render: (item) => <span className="font-medium">{(item.reach / 1000).toFixed(0)}K</span> },
              { key: 'engagement', header: 'Engagement', className: 'hidden lg:table-cell', render: (item) => <span>{item.engagement}%</span> },
              { key: 'alignment', header: 'Alignment', render: (item) => <AlignmentBadge alignment={item.alignment} /> },
              { key: 'topics', header: 'Recent Topics', className: 'hidden xl:table-cell', render: (item) => (
                <div className="flex gap-1">
                  {item.recentTopics.slice(0, 2).map((topic, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-muted text-xs text-muted-foreground">{topic}</span>
                  ))}
                </div>
              )},
            ]}
          />
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">No influencers detected from live data</p>
        )}
      </Panel>

      {/* Media Bias */}
      <Panel title="Platform Sentiment Analysis" subtitle="From live API data">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={biasChartData} layout="vertical">
              <XAxis type="number" domain={[-100, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Sentiment Tilt']} />
              <Bar dataKey="tilt" radius={[0, 4, 4, 0]}>
                {biasChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground uppercase">Total Influencers</span></div>
          <p className="text-2xl font-bold text-foreground">{influencers.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-success" /><span className="text-xs text-muted-foreground uppercase">Pro-Leader</span></div>
          <p className="text-2xl font-bold text-success">{influencers.filter(i => i.alignment === 'pro').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-muted border border-border">
          <div className="flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground uppercase">Neutral</span></div>
          <p className="text-2xl font-bold text-muted-foreground">{influencers.filter(i => i.alignment === 'neutral').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-destructive rotate-180" /><span className="text-xs text-muted-foreground uppercase">Anti-Leader</span></div>
          <p className="text-2xl font-bold text-destructive">{influencers.filter(i => i.alignment === 'anti').length}</p>
        </div>
      </div>
    </div>
  );
}
