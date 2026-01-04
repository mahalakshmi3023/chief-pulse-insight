import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { AlignmentBadge } from '@/components/dashboard/Badges';
import { influencers, mediaChannels } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Tv, TrendingUp, MessageSquare } from 'lucide-react';

export default function Influencers() {
  // Prepare media bias chart data
  const biasChartData = mediaChannels.map(ch => ({
    name: ch.name,
    tilt: ch.sentimentTilt,
    fill: ch.sentimentTilt > 0 ? 'hsl(var(--success))' : ch.sentimentTilt < 0 ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'
  }));

  // Mock debate topics data
  const debateTopics = [
    { topic: 'Water Crisis', frequency: 45 },
    { topic: 'Opposition Criticism', frequency: 38 },
    { topic: 'Government Schemes', frequency: 32 },
    { topic: 'Employment', frequency: 28 },
    { topic: 'Infrastructure', frequency: 22 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Influencers & Media Bias</h1>
        <p className="text-sm text-muted-foreground mt-1">Track key voices and media sentiment patterns</p>
      </div>

      {/* Influencer Impact Tracker */}
      <Panel title="Influencer Impact Tracker" subtitle="Top voices shaping public narrative">
        <DataTable
          data={influencers}
          columns={[
            { key: 'name', header: 'Name', render: (item) => (
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.handle}</p>
              </div>
            )},
            { key: 'platform', header: 'Platform', render: (item) => (
              <span className="capitalize text-sm">{item.platform}</span>
            )},
            { key: 'followers', header: 'Followers', className: 'hidden md:table-cell', render: (item) => (
              <span>{(item.followers / 1000000).toFixed(1)}M</span>
            )},
            { key: 'reach', header: 'Reach', render: (item) => (
              <span className="font-medium">{(item.reach / 1000000).toFixed(1)}M</span>
            )},
            { key: 'engagement', header: 'Engagement', className: 'hidden lg:table-cell', render: (item) => (
              <span>{item.engagement}%</span>
            )},
            { key: 'alignment', header: 'Alignment', render: (item) => (
              <AlignmentBadge alignment={item.alignment} />
            )},
            { key: 'topics', header: 'Recent Topics', className: 'hidden xl:table-cell', render: (item) => (
              <div className="flex gap-1">
                {item.recentTopics.slice(0, 2).map((topic, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-muted text-xs text-muted-foreground">
                    {topic}
                  </span>
                ))}
              </div>
            )},
          ]}
        />
      </Panel>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Media Bias Analysis */}
        <Panel title="Media Bias Analysis" subtitle="Sentiment tilt by channel">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={biasChartData} layout="vertical">
                <XAxis type="number" domain={[-100, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Sentiment Tilt']}
                />
                <Bar dataKey="tilt" radius={[0, 4, 4, 0]}>
                  {biasChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success" />
              <span className="text-xs text-muted-foreground">Pro-Government</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-destructive" />
              <span className="text-xs text-muted-foreground">Anti-Government</span>
            </div>
          </div>
        </Panel>

        {/* TV Debate Topics */}
        <Panel title="TV Debate Topics" subtitle="Most discussed topics this week">
          <div className="space-y-4">
            {debateTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-lg font-semibold text-muted-foreground w-6">#{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{topic.topic}</span>
                    <span className="text-sm text-muted-foreground">{topic.frequency} segments</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(topic.frequency / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Media Channels Table */}
      <Panel title="Media Channel Coverage" subtitle="Hours of coverage by channel">
        <DataTable
          data={mediaChannels}
          columns={[
            { key: 'name', header: 'Channel', render: (item) => (
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{item.name}</span>
              </div>
            )},
            { key: 'type', header: 'Type', render: (item) => (
              <span className="capitalize px-2 py-0.5 rounded bg-muted text-xs">{item.type}</span>
            )},
            { key: 'coverage', header: 'Coverage', render: (item) => (
              <span>{item.coverage} {item.type === 'tv' ? 'hrs' : 'articles'}</span>
            )},
            { key: 'sentimentTilt', header: 'Sentiment Tilt', render: (item) => {
              const color = item.sentimentTilt > 0 ? 'text-success' : item.sentimentTilt < 0 ? 'text-destructive' : 'text-muted-foreground';
              return <span className={`font-medium ${color}`}>{item.sentimentTilt > 0 ? '+' : ''}{item.sentimentTilt}</span>;
            }},
            { key: 'topTopics', header: 'Top Topics', className: 'hidden lg:table-cell', render: (item) => (
              <div className="flex gap-1 flex-wrap">
                {item.topTopics.slice(0, 3).map((topic, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-muted text-xs text-muted-foreground">
                    {topic}
                  </span>
                ))}
              </div>
            )},
          ]}
        />
      </Panel>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase">Total Influencers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{influencers.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground uppercase">Pro-Govt Voices</span>
          </div>
          <p className="text-2xl font-bold text-success">
            {influencers.filter(i => i.alignment === 'pro').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted border border-border">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase">Neutral Voices</span>
          </div>
          <p className="text-2xl font-bold text-muted-foreground">
            {influencers.filter(i => i.alignment === 'neutral').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
            <span className="text-xs text-muted-foreground uppercase">Anti-Govt Voices</span>
          </div>
          <p className="text-2xl font-bold text-destructive">
            {influencers.filter(i => i.alignment === 'anti').length}
          </p>
        </div>
      </div>
    </div>
  );
}
