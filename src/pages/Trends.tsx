import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { HashtagDrawer } from '@/components/dashboard/HashtagDrawer';
import { TrendBadge } from '@/components/dashboard/Badges';
import { hashtags, topics, districts } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Search, TrendingUp, Image, ArrowUp, ArrowDown, Hash, Eye, Sparkles, Filter, Play, ExternalLink, Zap, Target, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CountUp } from '@/components/AnimatedNumber';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Trends() {
  const [selectedHashtag, setSelectedHashtag] = useState<typeof hashtags[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'volume' | 'growth'>('volume');
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [selectedViral, setSelectedViral] = useState<number | null>(null);
  const [viralDialogOpen, setViralDialogOpen] = useState(false);

  const handleHashtagClick = (hashtag: typeof hashtags[0]) => {
    setSelectedHashtag(hashtag);
    setDrawerOpen(true);
  };

  const filteredHashtags = useMemo(() => {
    return hashtags
      .filter(h => h.tag.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sortBy === 'volume' ? b.volume - a.volume : b.growth - a.growth);
  }, [search, sortBy]);

  // Calculate overview stats
  const totalVolume = hashtags.reduce((sum, h) => sum + h.volume, 0);
  const avgGrowth = Math.round(hashtags.reduce((sum, h) => sum + h.growth, 0) / hashtags.length);
  const topHashtag = hashtags.reduce((max, h) => h.volume > max.volume ? h : max, hashtags[0]);

  // Enhanced trend data with more detail
  const trendData = [
    { hour: '6AM', volume: 12400, positive: 45, negative: 28, neutral: 27 },
    { hour: '8AM', volume: 28900, positive: 52, negative: 22, neutral: 26 },
    { hour: '10AM', volume: 45600, positive: 48, negative: 25, neutral: 27 },
    { hour: '12PM', volume: 52300, positive: 55, negative: 20, neutral: 25 },
    { hour: '2PM', volume: 48100, positive: 50, negative: 24, neutral: 26 },
    { hour: '4PM', volume: 61200, positive: 58, negative: 18, neutral: 24 },
    { hour: '6PM', volume: 58700, positive: 54, negative: 22, neutral: 24 },
    { hour: '8PM', volume: 42300, positive: 51, negative: 25, neutral: 24 },
  ];

  // Enhanced viral content
  const viralContent = [
    { id: 1, type: 'meme', caption: 'Water tanker reaching Kolathur be like...', engagement: '45K', platform: 'Twitter', thumbnail: '/placeholder.svg', views: 234500, shares: 12400, sentiment: 'neutral' },
    { id: 2, type: 'video', caption: 'CM inaugurating new hospital in Madurai', engagement: '120K', platform: 'YouTube', thumbnail: '/placeholder.svg', views: 890000, shares: 45200, sentiment: 'positive' },
    { id: 3, type: 'image', caption: 'Students enjoying breakfast scheme', engagement: '32K', platform: 'Instagram', thumbnail: '/placeholder.svg', views: 156000, shares: 8900, sentiment: 'positive' },
    { id: 4, type: 'meme', caption: 'Opposition press conference reaction', engagement: '28K', platform: 'Twitter', thumbnail: '/placeholder.svg', views: 189000, shares: 15600, sentiment: 'negative' },
    { id: 5, type: 'video', caption: 'Free bus travel impact story', engagement: '89K', platform: 'Facebook', thumbnail: '/placeholder.svg', views: 456000, shares: 28900, sentiment: 'positive' },
    { id: 6, type: 'image', caption: 'New metro line announcement', engagement: '18K', platform: 'Twitter', thumbnail: '/placeholder.svg', views: 98000, shares: 5600, sentiment: 'neutral' },
  ];

  // Platform distribution for pie chart
  const platformData = [
    { name: 'Twitter', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Facebook', value: 25, color: 'hsl(210 100% 50%)' },
    { name: 'Instagram', value: 20, color: 'hsl(330 100% 60%)' },
    { name: 'News', value: 10, color: 'hsl(var(--muted-foreground))' },
  ];

  // Google Trends correlation
  const googleTrends = [
    { topic: 'Water supply Chennai', interest: 92, change: 45, category: 'Infrastructure' },
    { topic: 'TN government schemes', interest: 78, change: 12, category: 'Policy' },
    { topic: 'CM MK Stalin', interest: 65, change: -5, category: 'Politics' },
    { topic: 'AIADMK protest', interest: 54, change: 23, category: 'Politics' },
    { topic: 'Tamil Nadu jobs', interest: 48, change: 8, category: 'Economy' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header with Stats */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Trends
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time hashtag tracking and issue monitoring</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <p className="text-xs text-muted-foreground">Total Volume</p>
              <p className="text-lg font-bold text-foreground">
                <CountUp end={totalVolume} duration={1.5} suffix="" />
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <p className="text-xs text-muted-foreground">Avg Growth</p>
              <p className="text-lg font-bold text-success flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                <CountUp end={avgGrowth} duration={1.5} suffix="%" />
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 backdrop-blur border border-primary/20">
              <p className="text-xs text-muted-foreground">Top Hashtag</p>
              <p className="text-sm font-bold text-primary">{topHashtag.tag}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hashtag Table with Enhanced Filters */}
      <motion.div variants={cardVariants}>
        <Panel 
          title="Trending Hashtags" 
          subtitle="Live social media tracking"
          action={
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={(v: 'volume' | 'growth') => setSortBy(v)}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">By Volume</SelectItem>
                  <SelectItem value="growth">By Growth</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search hashtags..." 
                  className="pl-9 h-8 w-48"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          }
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div layout>
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
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.volume / topHashtag.volume) * 100}%` }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    )},
                    { key: 'growth', header: 'Growth', render: (item) => (
                      <TrendBadge 
                        trend={item.growth > 0 ? 'rising' : item.growth < 0 ? 'falling' : 'stable'}
                        value={`${item.growth > 0 ? '+' : ''}${item.growth}%`}
                      />
                    )},
                    { key: 'sources', header: 'Sources', className: 'hidden md:table-cell', render: (item) => (
                      <div className="flex items-center gap-1">
                        <div className="h-2.5 w-20 bg-muted rounded-full overflow-hidden flex">
                          <motion.div 
                            className="bg-primary h-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.sources.twitter}%` }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                          />
                          <motion.div 
                            className="bg-blue-600 h-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.sources.facebook}%` }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                          />
                          <motion.div 
                            className="bg-pink-500 h-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.sources.instagram}%` }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                          />
                          <motion.div 
                            className="bg-muted-foreground h-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.sources.news}%` }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    )},
                    { key: 'sentiment', header: 'Sentiment', render: (item) => {
                      const colors = {
                        positive: 'bg-success/10 text-success border-success/20',
                        negative: 'bg-destructive/10 text-destructive border-destructive/20',
                        neutral: 'bg-muted text-muted-foreground border-border'
                      };
                      return (
                        <Badge variant="outline" className={`capitalize ${colors[item.sentiment]}`}>
                          {item.sentiment}
                        </Badge>
                      );
                    }},
                  ]}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </Panel>
      </motion.div>

      {/* Two Column Layout - Issue Clusters + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Clustering */}
        <motion.div variants={cardVariants}>
          <Panel title="Issue Clusters" subtitle="Top topics by volume">
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <motion.div 
                  key={topic.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-primary/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setTopicDialogOpen(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      topic.trend === 'rising' ? 'bg-success/10' : 
                      topic.trend === 'falling' ? 'bg-destructive/10' : 'bg-muted'
                    }`}>
                      <Target className={`w-5 h-5 ${
                        topic.trend === 'rising' ? 'text-success' : 
                        topic.trend === 'falling' ? 'text-destructive' : 'text-muted-foreground'
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
            </div>
          </Panel>
        </motion.div>

        {/* Volume Timeline Chart */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Panel title="Volume Timeline" subtitle="Hashtag activity with sentiment overlay">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Volume']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#volumeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Sentiment Distribution */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Sentiment at Peak (4PM)</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-xs">58% Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    <span className="text-xs">24% Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-xs">18% Negative</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* Viral Content Monitor with Interactive Cards */}
      <motion.div variants={cardVariants}>
        <Panel 
          title="Viral Content Monitor" 
          subtitle="Trending memes, videos & images"
          action={
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {viralContent.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => {
                  setSelectedViral(item.id);
                  setViralDialogOpen(true);
                }}
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center mb-2 relative overflow-hidden border border-border/50 group-hover:border-primary/30 transition-all">
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-4 h-4 text-primary ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  <Image className="w-8 h-8 text-muted-foreground" />
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                    item.sentiment === 'positive' ? 'bg-success' :
                    item.sentiment === 'negative' ? 'bg-destructive' : 'bg-muted-foreground'
                  }`} />
                  <Badge 
                    variant="secondary" 
                    className="absolute bottom-2 left-2 text-[10px] py-0 h-5 bg-background/80 backdrop-blur"
                  >
                    {item.type}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">{item.caption}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-primary">{item.engagement}</span>
                  <span className="text-xs text-muted-foreground">• {item.platform}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </motion.div>

      {/* Platform Distribution + Google Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Distribution Pie */}
        <motion.div variants={cardVariants}>
          <Panel title="Platform Distribution" subtitle="Content source breakdown">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {platformData.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                  <span className="text-xs text-muted-foreground">{platform.name}</span>
                  <span className="text-xs font-semibold ml-auto">{platform.value}%</span>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>

        {/* Google Trends Correlation */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Panel title="Google Trends Correlation" subtitle="Search interest in Tamil Nadu">
            <div className="space-y-3">
              {googleTrends.map((item, index) => (
                <motion.div 
                  key={item.topic}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{item.topic}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.interest}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8">{item.interest}</span>
                    </div>
                  </div>
                  <TrendBadge 
                    trend={item.change > 0 ? 'rising' : item.change < 0 ? 'falling' : 'stable'}
                    value={`${item.change > 0 ? '+' : ''}${item.change}%`}
                  />
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* Hashtag Drawer */}
      <HashtagDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        hashtag={selectedHashtag}
      />

      {/* Topic Drill-Down Dialog */}
      <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {selectedTopic?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown for {selectedTopic?.category}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="districts">Districts</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Volume</p>
                  <p className="text-2xl font-bold">{((selectedTopic?.volume || 0) / 1000).toFixed(1)}K</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Trend</p>
                  <TrendBadge trend={selectedTopic?.trend || 'stable'} />
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="font-semibold">{selectedTopic?.category}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  This topic has been {selectedTopic?.trend === 'rising' ? 'gaining' : 
                  selectedTopic?.trend === 'falling' ? 'losing' : 'maintaining'} momentum over the past 24 hours.
                  Related hashtags are showing {selectedTopic?.trend === 'rising' ? 'increased' : 
                  selectedTopic?.trend === 'falling' ? 'decreased' : 'stable'} engagement.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="districts" className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {districts.slice(0, 9).map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 5000 + 1000)} mentions</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="timeline" className="mt-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData.slice(0, 6)}>
                    <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                    <Tooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Viral Content Dialog */}
      <Dialog open={viralDialogOpen} onOpenChange={setViralDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedViral && (() => {
            const item = viralContent.find(v => v.id === selectedViral);
            if (!item) return null;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Viral Content
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                    <Image className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="font-medium">{item.caption}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Eye className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-semibold">{(item.views / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <ExternalLink className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-semibold">{(item.shares / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-muted-foreground">Shares</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <BarChart3 className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-semibold">{item.engagement}</p>
                      <p className="text-xs text-muted-foreground">Engagements</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Badge variant="outline">{item.platform}</Badge>
                    <Badge className={
                      item.sentiment === 'positive' ? 'bg-success/10 text-success' :
                      item.sentiment === 'negative' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }>
                      {item.sentiment}
                    </Badge>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
