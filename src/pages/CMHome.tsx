import { useState } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { HashtagDrawer } from '@/components/dashboard/HashtagDrawer';
import { TrendBadge, AlignmentBadge } from '@/components/dashboard/Badges';
import { kpiData, hashtags, districts, topics, influencers, schemes, emotionsSeries } from '@/data/mockData';
import { Activity, AlertTriangle, ShieldAlert, TrendingUp, Users, MapPin, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function CMHome() {
  const [selectedHashtag, setSelectedHashtag] = useState<typeof hashtags[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleHashtagClick = (hashtag: typeof hashtags[0]) => {
    setSelectedHashtag(hashtag);
    setDrawerOpen(true);
  };

  // Prepare emotion chart data
  const emotionChartData = emotionsSeries.slice(-6).map(d => ({
    time: d.timestamp.split(' ')[1],
    Anger: d.anger,
    Fear: d.fear,
    Hope: d.hope,
    Trust: d.trust
  }));

  // Top issues
  const topIssues = topics.slice(0, 5);

  // Top influencers
  const topInfluencers = influencers.slice(0, 5);

  // Top scheme
  const topScheme = schemes[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Good Morning, Chief Minister</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's your daily intelligence briefing for {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Activity className="w-4 h-4" />
          View Full Report
        </Button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Public Sentiment"
          value={`${kpiData.publicSentiment.positive}%`}
          subtitle="Positive"
          trend={kpiData.publicSentiment.trend}
          trendValue={`${kpiData.publicSentiment.change > 0 ? '+' : ''}${kpiData.publicSentiment.change}%`}
          trendLabel="vs yesterday"
          variant="positive"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KPICard
          title="Opposition Momentum"
          value={kpiData.oppositionMomentum.score}
          subtitle="/ 100"
          trend={kpiData.oppositionMomentum.trend}
          trendValue={`${kpiData.oppositionMomentum.change}%`}
          trendLabel="declining"
          icon={<Users className="w-4 h-4" />}
        />
        <KPICard
          title="Misinfo Risk"
          value={kpiData.misinformationRisk.activeCount}
          subtitle="Active Claims"
          variant={kpiData.misinformationRisk.criticalCount > 0 ? 'warning' : 'default'}
          icon={<ShieldAlert className="w-4 h-4" />}
        />
        <KPICard
          title="Crisis Level"
          value={kpiData.crisisEscalation.level.toUpperCase()}
          subtitle={`${kpiData.crisisEscalation.watchlistCount} on watchlist`}
          variant={kpiData.crisisEscalation.level !== 'low' ? 'negative' : 'default'}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>

      {/* Two Large Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Hashtags */}
        <Panel title="Trending Hashtags" subtitle="Real-time social media tracking">
          <div className="space-y-3">
            {hashtags.slice(0, 6).map((tag, idx) => (
              <div 
                key={tag.id}
                onClick={() => handleHashtagClick(tag)}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-muted-foreground w-6">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-foreground">{tag.tag}</p>
                    <p className="text-xs text-muted-foreground">{tag.volume.toLocaleString()} mentions</p>
                  </div>
                </div>
                <TrendBadge 
                  trend={tag.growth > 0 ? 'rising' : tag.growth < 0 ? 'falling' : 'stable'} 
                  value={`${tag.growth > 0 ? '+' : ''}${tag.growth}%`}
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* District Mood Map */}
        <Panel title="District Mood Map" subtitle="Sentiment across Tamil Nadu">
          <div className="grid grid-cols-3 gap-2">
            {districts.slice(0, 12).map((district) => {
              const sentiment = district.sentiment;
              const bgColor = sentiment > 50 ? 'bg-success/20' : sentiment > 30 ? 'bg-warning/20' : 'bg-destructive/20';
              const textColor = sentiment > 50 ? 'text-success' : sentiment > 30 ? 'text-warning' : 'text-destructive';
              
              return (
                <div key={district.id} className={`p-3 rounded-xl ${bgColor}`}>
                  <p className="text-xs font-medium text-foreground truncate">{district.name}</p>
                  <p className={`text-lg font-bold ${textColor}`}>{sentiment}%</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success/40" />
              <span className="text-xs text-muted-foreground">Positive (&gt;50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-warning/40" />
              <span className="text-xs text-muted-foreground">Neutral (30-50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-destructive/40" />
              <span className="text-xs text-muted-foreground">Negative (&lt;30%)</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Three Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Clusters */}
        <Panel title="Issue Clusters" subtitle="Top rising concerns">
          <div className="space-y-3">
            {topIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{issue.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {issue.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{(issue.volume / 1000).toFixed(1)}K</span>
                  <TrendBadge trend={issue.trend} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Top Influencers */}
        <Panel title="Top Influencers" subtitle="Key amplifiers today">
          <div className="space-y-3">
            {topInfluencers.map((inf) => (
              <div key={inf.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{inf.name}</p>
                  <p className="text-xs text-muted-foreground">{(inf.reach / 1000000).toFixed(1)}M reach</p>
                </div>
                <AlignmentBadge alignment={inf.alignment} />
              </div>
            ))}
          </div>
        </Panel>

        {/* Policy Impact Snapshot */}
        <Panel title="Policy Impact" subtitle="Scheme performance">
          {topScheme && (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-foreground">{topScheme.name}</p>
                <p className="text-xs text-muted-foreground">{topScheme.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Impact Score</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success rounded-full transition-all"
                      style={{ width: `${topScheme.impactScore}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-success">{topScheme.impactScore}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Before</p>
                  <p className="text-lg font-semibold text-foreground">{topScheme.sentimentBefore}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">After</p>
                  <p className="text-lg font-semibold text-success">{topScheme.sentimentAfter}%</p>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Emotion Timeline Panel */}
      <Panel title="Emotion Timeline" subtitle="Public emotional trends over time">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emotionChartData}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="Anger" stroke="hsl(var(--emotion-anger))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Fear" stroke="hsl(var(--emotion-fear))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Hope" stroke="hsl(var(--emotion-hope))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Trust" stroke="hsl(var(--emotion-trust))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-anger" />
            <span className="text-xs text-muted-foreground">Anger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-fear" />
            <span className="text-xs text-muted-foreground">Fear</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-hope" />
            <span className="text-xs text-muted-foreground">Hope</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-trust" />
            <span className="text-xs text-muted-foreground">Trust</span>
          </div>
        </div>
      </Panel>

      {/* Hashtag Drawer */}
      <HashtagDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        hashtag={selectedHashtag}
      />
    </div>
  );
}
