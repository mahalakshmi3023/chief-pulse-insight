import { useState, useMemo } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { HashtagDrawer } from '@/components/dashboard/HashtagDrawer';
import { TrendBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, Hash, Target, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CountUp } from '@/components/AnimatedNumber';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function Trends() {
  const { isLoading, hashtags, topics, data, search: doSearch, query, fetchedAt, allPosts } = useSocialData();

  const [selectedHashtag, setSelectedHashtag] = useState<typeof hashtags[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<'volume' | 'growth'>('volume');
  const [activeTab, setActiveTab] = useState('twitter');

  const handleHashtagClick = (hashtag: typeof hashtags[0]) => {
    setSelectedHashtag(hashtag);
    setDrawerOpen(true);
  };

  const handleFetch = () => {
    if (searchInput.trim()) doSearch(searchInput.trim());
    else doSearch(query);
  };

  const filteredHashtags = useMemo(() => {
    return hashtags
      .filter(h => h.tag.toLowerCase().includes(searchInput.toLowerCase()))
      .sort((a, b) => sortBy === 'volume' ? b.volume - a.volume : b.growth - a.growth);
  }, [hashtags, searchInput, sortBy]);

  const totalVolume = hashtags.reduce((sum, h) => sum + h.volume, 0);
  const topHashtag = hashtags.length > 0 ? hashtags.reduce((max, h) => h.volume > max.volume ? h : max, hashtags[0]) : null;

  const platformPosts: Record<string, typeof allPosts> = {
    twitter: data.twitter.data,
    instagram: data.instagram.data,
    facebook: data.facebook.data,
    news: data.news.data,
    firecrawl: data.firecrawl.data,
  };

  const platformData = [
    { name: 'Twitter', value: data.twitter.count, color: 'hsl(var(--primary))' },
    { name: 'Instagram', value: data.instagram.count, color: 'hsl(330 100% 60%)' },
    { name: 'Facebook', value: data.facebook.count, color: 'hsl(210 100% 50%)' },
    { name: 'News', value: data.news.count, color: 'hsl(var(--muted-foreground))' },
    { name: 'Firecrawl', value: data.firecrawl.count, color: 'hsl(40 100% 50%)' },
  ].filter(p => p.value > 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Fetching live trends...</span>
        </div>
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Trends
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time data from social media & news APIs</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
            Live API Data · {allPosts.length} posts
          </Badge>
          <span className="text-sm text-muted-foreground">{query}</span>
          <Button size="sm" variant="outline" className="gap-2" onClick={handleFetch}>
            <RefreshCw className="w-4 h-4" />
            Fetch
          </Button>
          <div className="px-4 py-2 rounded-xl bg-card/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="text-lg font-bold text-foreground"><CountUp end={totalVolume} duration={1.5} /></p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-card/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Top Hashtag</p>
            <p className="text-sm font-bold text-foreground">{topHashtag?.tag || '-'}</p>
          </div>
        </div>
      </div>

      {/* Social Media Feed with Tabs */}
      <Panel title="Social Media Feed" subtitle={`Live data from ${Object.values(data).filter(d => d.count > 0).length} platforms`}
        action={
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>🐦 {data.twitter.count}</span>
            <span>📷 {data.instagram.count}</span>
            <span>👤 {data.facebook.count}</span>
            <span>🌐 {data.firecrawl.count}</span>
          </div>
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="twitter" className="gap-1">🐦 Twitter</TabsTrigger>
            <TabsTrigger value="instagram" className="gap-1">📷 Instagram</TabsTrigger>
            <TabsTrigger value="facebook" className="gap-1">👤 Facebook</TabsTrigger>
            <TabsTrigger value="news" className="gap-1">📰 News</TabsTrigger>
            <TabsTrigger value="firecrawl" className="gap-1">🌐 Firecrawl</TabsTrigger>
          </TabsList>
          {Object.entries(platformPosts).map(([platform, posts]) => (
            <TabsContent key={platform} value={platform}>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {posts.slice(0, 15).map((post, i) => (
                  <div key={post.id || i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">@{post.author}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{new Date(post.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{post.text}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>❤️ {post.likes}</span>
                      <span>🔄 {post.shares}</span>
                      {post.url && <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View →</a>}
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No {platform} data found</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Panel>

      {/* Trending Hashtags */}
      <Panel
        title="Trending Hashtags"
        subtitle="Derived from live social media APIs"
        action={
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(v: 'volume' | 'growth') => setSortBy(v)}>
              <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">By Volume</SelectItem>
                <SelectItem value="growth">By Growth</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                placeholder="Search hashtags..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-7 h-8 w-40 text-xs"
              />
            </div>
          </div>
        }
      >
        {filteredHashtags.length > 0 ? (
          <DataTable
            data={filteredHashtags}
            onRowClick={handleHashtagClick}
            columns={[
              { key: 'tag', header: 'Hashtag', render: (item) => (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{item.tag}</span>
                </div>
              )},
              { key: 'volume', header: 'Volume', render: (item) => (
                <span className="font-semibold">{item.volume.toLocaleString()}</span>
              )},
              { key: 'growth', header: 'Growth', render: (item) => (
                <TrendBadge trend={item.growth > 0 ? 'rising' : item.growth < 0 ? 'falling' : 'stable'} value={`${item.growth > 0 ? '+' : ''}${item.growth}%`} />
              )},
              { key: 'sentiment', header: 'Sentiment', render: (item) => {
                const colors = {
                  positive: 'bg-success/10 text-success border-success/20',
                  negative: 'bg-destructive/10 text-destructive border-destructive/20',
                  neutral: 'bg-muted text-muted-foreground border-border'
                };
                return <Badge variant="outline" className={`capitalize ${colors[item.sentiment]}`}>{item.sentiment}</Badge>;
              }},
            ]}
          />
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">No hashtags found. Click "Fetch" to load live data.</p>
        )}
      </Panel>

      {/* Issue Clusters + Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Issue Clusters" subtitle="Topics from live data">
          <div className="space-y-3">
            {topics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{topic.name}</p>
                    <p className="text-xs text-muted-foreground">{topic.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{(topic.volume / 1000).toFixed(1)}K</span>
                  <TrendBadge trend={topic.trend} />
                </div>
              </div>
            ))}
            {topics.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No topics detected</p>}
          </div>
        </Panel>

        <Panel title="Platform Distribution" subtitle="Content source breakdown">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48">
              {platformData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={platformData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data</div>
              )}
            </div>
            <div className="space-y-3">
              {[
                { name: 'Twitter', value: data.twitter.count, color: 'hsl(var(--primary))' },
                { name: 'Instagram', value: data.instagram.count, color: 'hsl(330 100% 60%)' },
                { name: 'Facebook', value: data.facebook.count, color: 'hsl(210 100% 50%)' },
                { name: 'News', value: data.news.count, color: 'hsl(var(--muted-foreground))' },
                { name: 'Firecrawl', value: data.firecrawl.count, color: 'hsl(40 100% 50%)' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-sm text-foreground">{p.name}</span>
                  <span className="text-sm font-semibold ml-auto">{p.value} posts</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <HashtagDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} hashtag={selectedHashtag} />
    </div>
  );
}
