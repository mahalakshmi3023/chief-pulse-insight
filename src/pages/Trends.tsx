import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { HashtagDrawer } from '@/components/dashboard/HashtagDrawer';
import { TrendBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, TrendingUp, ArrowUp, Hash, Sparkles, Target, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CountUp } from '@/components/AnimatedNumber';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function Trends() {
  const { isLoading, hashtags, topics, data, search: doSearch, query, fetchedAt, allPosts, constituencies } = useSocialData();

  const [selectedHashtag, setSelectedHashtag] = useState<typeof hashtags[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<'volume' | 'growth'>('volume');

  const handleHashtagClick = (hashtag: typeof hashtags[0]) => {
    setSelectedHashtag(hashtag);
    setDrawerOpen(true);
  };

  const handleSearch = () => {
    if (searchInput.trim()) doSearch(searchInput.trim());
  };

  const filteredHashtags = useMemo(() => {
    return hashtags
      .filter(h => h.tag.toLowerCase().includes(searchInput.toLowerCase()))
      .sort((a, b) => sortBy === 'volume' ? b.volume - a.volume : b.growth - a.growth);
  }, [hashtags, searchInput, sortBy]);

  const totalVolume = hashtags.reduce((sum, h) => sum + h.volume, 0);
  const avgGrowth = hashtags.length > 0 ? Math.round(hashtags.reduce((sum, h) => sum + h.growth, 0) / hashtags.length) : 0;
  const topHashtag = hashtags.length > 0 ? hashtags.reduce((max, h) => h.volume > max.volume ? h : max, hashtags[0]) : null;

  // Platform distribution from real data
  const platformData = [
    { name: 'Twitter', value: data.twitter.count, color: 'hsl(var(--primary))' },
    { name: 'Facebook', value: data.facebook.count, color: 'hsl(210 100% 50%)' },
    { name: 'Instagram', value: data.instagram.count, color: 'hsl(330 100% 60%)' },
    { name: 'News', value: data.news.count, color: 'hsl(var(--muted-foreground))' },
    { name: 'Firecrawl', value: data.firecrawl.count, color: 'hsl(40 100% 50%)' },
  ].filter(p => p.value > 0);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const cardVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Fetching live trends from all platforms...</span>
        </div>
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Trends
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs ml-2">Live API</Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time data · Query: "{query}" · {fetchedAt?.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search social media..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-48 h-9"
              />
              <Button size="sm" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-1" />
                Search
              </Button>
            </div>
            <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <p className="text-xs text-muted-foreground">Total Volume</p>
              <p className="text-lg font-bold text-foreground"><CountUp end={totalVolume} duration={1.5} /></p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <p className="text-xs text-muted-foreground">Avg Growth</p>
              <p className="text-lg font-bold text-success flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                <CountUp end={avgGrowth} duration={1.5} suffix="%" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hashtag Table */}
      <motion.div variants={cardVariants}>
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
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.volume.toLocaleString()}</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${topHashtag ? (item.volume / topHashtag.volume) * 100 : 0}%` }} transition={{ delay: 0.3, duration: 0.8 }} />
                    </div>
                  </div>
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
            <p className="text-sm text-muted-foreground py-8 text-center">No hashtags found in live data. Try a different search query.</p>
          )}
        </Panel>
      </motion.div>

      {/* Topics + Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants}>
          <Panel title="Issue Clusters" subtitle="Topics from live data">
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <motion.div 
                  key={topic.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-primary/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      topic.trend === 'rising' ? 'bg-success/10' : topic.trend === 'falling' ? 'bg-destructive/10' : 'bg-muted'
                    }`}>
                      <Target className={`w-5 h-5 ${
                        topic.trend === 'rising' ? 'text-success' : topic.trend === 'falling' ? 'text-destructive' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{topic.name}</p>
                      <p className="text-xs text-muted-foreground">{topic.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">{(topic.volume / 1000).toFixed(1)}K</span>
                    <TrendBadge trend={topic.trend} />
                  </div>
                </motion.div>
              ))}
              {topics.length === 0 && <p className="text-sm text-muted-foreground">No topics detected yet</p>}
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Panel title="Platform Distribution" subtitle="Content source breakdown from APIs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48">
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
              </div>
              <div className="space-y-3">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                    <span className="text-sm text-foreground">{platform.name}</span>
                    <span className="text-sm font-semibold ml-auto">{platform.value} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* Live Posts Feed */}
      <motion.div variants={cardVariants}>
        <Panel 
          title="Live Social Feed" 
          subtitle={`${allPosts.length} posts from all platforms`}
          action={
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          }
        >
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allPosts.slice(0, 20).map((post, i) => (
              <div key={post.id || i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs capitalize">{post.platform}</Badge>
                  <span className="text-xs text-muted-foreground">@{post.author}</span>
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
            {allPosts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No posts found. Try searching for a different query.</p>}
          </div>
        </Panel>
      </motion.div>

      <HashtagDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} hashtag={selectedHashtag} />
    </motion.div>
  );
}
