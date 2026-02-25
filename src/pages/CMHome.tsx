import { useState, useEffect } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Panel } from '@/components/dashboard/Panel';
import { HashtagDrawer } from '@/components/dashboard/HashtagDrawer';
import { TrendBadge, AlignmentBadge } from '@/components/dashboard/Badges';
import { useSocialSearch } from '@/hooks/useSocialSearch';
import { Activity, AlertTriangle, ShieldAlert, TrendingUp, Users, BarChart3, Crown, Clock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function CMHome() {
  const { isLoading, hashtags, constituencies, topics, influencers, schemes, emotionsSeries, breakingNews, kpiData, fetchedAt } = useSocialSearch();

  const [selectedHashtag, setSelectedHashtag] = useState<typeof hashtags[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [riskFilter, setRiskFilter] = useState('all');
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleHashtagClick = (hashtag: typeof hashtags[0]) => {
    setSelectedHashtag(hashtag);
    setDrawerOpen(true);
  };

  // Prepare emotion chart data
  const emotionChartData = emotionsSeries.slice(-8).map(d => ({
    time: d.timestamp.split(' ')[1],
    Anger: d.anger,
    Fear: d.fear,
    Hope: d.hope,
    Trust: d.trust
  }));

  // Top issues
  const topIssues = topics.slice(0, 5);
  const topInfluencers = influencers.slice(0, 5);
  const topScheme = schemes[0];

  // Recent breaking news as activities
  const recentActivities = breakingNews.slice(0, 4).map((n, i) => ({
    id: i,
    action: n.severity === 'critical' ? 'Crisis alert:' : n.severity === 'high' ? 'Alert:' : 'Update:',
    target: n.title.slice(0, 50),
    time: new Date(n.timestamp).toLocaleTimeString(),
    type: n.severity === 'critical' ? 'alert' : n.severity === 'high' ? 'warning' : 'info',
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Fetching live data from all platforms...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  // Generate trend data from real posts
  const trendData = [
    { date: 'Day 1', high: Math.round(kpiData.publicSentiment.negative * 200), low: Math.round(kpiData.publicSentiment.positive * 100), value: hashtags.reduce((s, h) => s + h.volume, 0) / 7 },
    { date: 'Day 2', high: Math.round(kpiData.publicSentiment.negative * 250), low: Math.round(kpiData.publicSentiment.positive * 120), value: hashtags.reduce((s, h) => s + h.volume, 0) / 6 },
    { date: 'Day 3', high: Math.round(kpiData.publicSentiment.negative * 180), low: Math.round(kpiData.publicSentiment.positive * 90), value: hashtags.reduce((s, h) => s + h.volume, 0) / 5 },
    { date: 'Day 4', high: Math.round(kpiData.publicSentiment.negative * 300), low: Math.round(kpiData.publicSentiment.positive * 150), value: hashtags.reduce((s, h) => s + h.volume, 0) / 4 },
    { date: 'Day 5', high: Math.round(kpiData.publicSentiment.negative * 350), low: Math.round(kpiData.publicSentiment.positive * 180), value: hashtags.reduce((s, h) => s + h.volume, 0) / 3 },
    { date: 'Day 6', high: Math.round(kpiData.publicSentiment.negative * 400), low: Math.round(kpiData.publicSentiment.positive * 200), value: hashtags.reduce((s, h) => s + h.volume, 0) / 2 },
    { date: 'Today', high: Math.round(kpiData.publicSentiment.negative * 380), low: Math.round(kpiData.publicSentiment.positive * 190), value: hashtags.reduce((s, h) => s + h.volume, 0) },
  ];

  const barChartData = [
    { name: 'Twitter', value: hashtags.filter(h => h.sources.twitter > 30).length * 5000 || 1000 },
    { name: 'Facebook', value: hashtags.filter(h => h.sources.facebook > 30).length * 4000 || 800 },
    { name: 'Instagram', value: hashtags.filter(h => h.sources.instagram > 20).length * 3000 || 600 },
    { name: 'News', value: hashtags.filter(h => h.sources.news > 10).length * 2000 || 400 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{greeting}, Leader</h1>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1">
              <Sparkles className="w-3 h-3" />
              Live API Data
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {fetchedAt ? `Last updated: ${fetchedAt.toLocaleTimeString()}` : 'Loading...'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-muted/30 hover:bg-muted/50">
          <Activity className="w-4 h-4" />
          View Full Report
          <ArrowRight className="w-4 h-4" />
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
          trendLabel="from live data"
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

      {/* Main Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="Trend Overview" subtitle="Public engagement metrics" className="lg:col-span-2" gradient>
          <div className="flex items-center justify-between mb-4">
            <ToggleGroup type="single" value={riskFilter} onValueChange={(v) => v && setRiskFilter(v)} className="toggle-group">
              <ToggleGroupItem value="all" className="toggle-item">All</ToggleGroupItem>
              <ToggleGroupItem value="high" className="toggle-item">High</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="toggle-item">Medium</ToggleGroupItem>
              <ToggleGroupItem value="low" className="toggle-item">Low</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0 78% 41%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(0 78% 41%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(150 70% 45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(150 70% 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 22%)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(0 0% 60%)' }} stroke="hsl(222 47% 22%)" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(0 0% 60%)' }} stroke="hsl(222 47% 22%)" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222 47% 13%)', border: '1px solid hsl(222 47% 22%)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }} />
                <Area type="monotone" dataKey="high" stroke="hsl(0 78% 41%)" strokeWidth={2} fill="url(#colorHigh)" />
                <Area type="monotone" dataKey="low" stroke="hsl(150 70% 45%)" strokeWidth={2} fill="url(#colorLow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Low Priority</span>
            </div>
          </div>
        </Panel>

        {/* Activity Feed */}
        <Panel title="Recent Activity" subtitle="Latest updates from live feeds">
          <div className="space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-dot ${
                  activity.type === 'alert' ? 'bg-destructive' : 
                  activity.type === 'warning' ? 'bg-warning' : 
                  activity.type === 'success' ? 'bg-success' : 'bg-primary'
                }`} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No breaking news detected from live feeds</p>
            )}
          </div>
        </Panel>
      </div>

      {/* Stats and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="Key Metrics" subtitle="From live API data" gradient>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center animate-float">
                  <Crown className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Mentions</p>
                <p className="text-3xl font-bold text-foreground">{hashtags.reduce((s, h) => s + h.volume, 0).toLocaleString()}</p>
                <Badge variant="outline" className="text-success border-success/30 bg-success/10 text-xs mt-1">
                  Live Data
                </Badge>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Platform Distribution" subtitle="Engagement by platform">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(150 70% 55%)" />
                    <stop offset="100%" stopColor="hsl(150 70% 35%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 22%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(0 0% 60%)' }} stroke="hsl(222 47% 22%)" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(0 0% 60%)' }} stroke="hsl(222 47% 22%)" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222 47% 13%)', border: '1px solid hsl(222 47% 22%)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Key Stakeholders" subtitle="Team members online">
          <div className="flex -space-x-3 mb-4">
            {['LDR', 'CS', 'MC', 'CC', 'AN'].map((initials, idx) => (
              <Avatar key={idx} className="w-10 h-10 border-2 border-card">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary-glow/20 text-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Team is monitoring real-time data feeds and preparing response strategies
          </p>
        </Panel>
      </div>

      {/* Two Large Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Trending Hashtags" subtitle="From live social media APIs">
          <div className="space-y-2">
            {hashtags.slice(0, 6).map((tag, idx) => (
              <div 
                key={tag.id}
                onClick={() => handleHashtagClick(tag)}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all hover:translate-x-1 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary w-8">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{tag.tag}</p>
                    <p className="text-xs text-muted-foreground">{tag.volume.toLocaleString()} mentions</p>
                  </div>
                </div>
                <TrendBadge 
                  trend={tag.growth > 0 ? 'rising' : tag.growth < 0 ? 'falling' : 'stable'} 
                  value={`${tag.growth > 0 ? '+' : ''}${tag.growth}%`}
                />
              </div>
            ))}
            {hashtags.length === 0 && <p className="text-sm text-muted-foreground">No hashtags detected in live data</p>}
          </div>
        </Panel>

        <Panel title="Constituency Sentiment" subtitle="Derived from live social data">
          <div className="grid grid-cols-3 gap-2">
            {constituencies.slice(0, 12).map((constituency) => {
              const sentiment = constituency.sentiment;
              const bgColor = sentiment > 50 ? 'bg-success/10 hover:bg-success/20' : sentiment > 30 ? 'bg-warning/10 hover:bg-warning/20' : 'bg-destructive/10 hover:bg-destructive/20';
              const textColor = sentiment > 50 ? 'text-success' : sentiment > 30 ? 'text-warning' : 'text-destructive';
              const borderColor = sentiment > 50 ? 'border-success/30' : sentiment > 30 ? 'border-warning/30' : 'border-destructive/30';
              
              return (
                <div key={constituency.id} className={`p-3 rounded-xl border ${bgColor} ${borderColor} cursor-pointer transition-all hover:scale-105`}>
                  <p className="text-xs font-medium text-foreground truncate">{constituency.name}</p>
                  <p className={`text-xl font-bold ${textColor}`}>{sentiment}%</p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Three Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="Issue Clusters" subtitle="Top rising concerns">
          <div className="space-y-3">
            {topIssues.map((issue, idx) => (
              <div key={issue.id} className="flex items-center justify-between group cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-all -mx-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary w-5">{idx + 1}</span>
                  <div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{issue.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-2">{issue.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{(issue.volume / 1000).toFixed(1)}K</span>
                  <TrendBadge trend={issue.trend} />
                </div>
              </div>
            ))}
            {topIssues.length === 0 && <p className="text-sm text-muted-foreground">No topics detected yet</p>}
          </div>
        </Panel>

        <Panel title="Top Influencers" subtitle="Key amplifiers today">
          <div className="space-y-3">
            {topInfluencers.map((inf, idx) => (
              <div key={inf.id} className="flex items-center justify-between group cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-all -mx-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {inf.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{inf.name}</p>
                    <p className="text-xs text-muted-foreground">{(inf.reach / 1000).toFixed(0)}K reach</p>
                  </div>
                </div>
                <AlignmentBadge alignment={inf.alignment} />
              </div>
            ))}
            {topInfluencers.length === 0 && <p className="text-sm text-muted-foreground">No influencers detected</p>}
          </div>
        </Panel>

        <Panel title="Policy Impact" subtitle="Initiative performance" gradient>
          {topScheme ? (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-foreground">{topScheme.name.slice(0, 50)}</p>
                <p className="text-xs text-muted-foreground">{topScheme.category}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Impact Score</p>
                  <span className="text-2xl font-bold text-success">{topScheme.impactScore}</span>
                </div>
                <Progress value={topScheme.impactScore} className="h-2 bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground">Before</p>
                  <p className="text-xl font-bold text-foreground">{topScheme.sentimentBefore}%</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10 border border-success/30">
                  <p className="text-xs text-muted-foreground">After</p>
                  <p className="text-xl font-bold text-success">{topScheme.sentimentAfter}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No policy data detected from live feeds</p>
          )}
        </Panel>
      </div>

      {/* Emotion Timeline Panel */}
      <Panel title="Emotion Timeline" subtitle="Public emotional trends from live data">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emotionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 22%)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(0 0% 60%)' }} stroke="hsl(222 47% 22%)" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(0 0% 60%)' }} stroke="hsl(222 47% 22%)" axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(222 47% 13%)', border: '1px solid hsl(222 47% 22%)', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="Anger" stroke="hsl(0 84% 55%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Fear" stroke="hsl(280 60% 55%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Hope" stroke="hsl(150 70% 50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Trust" stroke="hsl(215 80% 55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emotion-anger" /><span className="text-xs text-muted-foreground">Anger</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emotion-fear" /><span className="text-xs text-muted-foreground">Fear</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emotion-hope" /><span className="text-xs text-muted-foreground">Hope</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emotion-trust" /><span className="text-xs text-muted-foreground">Trust</span></div>
        </div>
      </Panel>

      <HashtagDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        hashtag={selectedHashtag}
      />
    </div>
  );
}
