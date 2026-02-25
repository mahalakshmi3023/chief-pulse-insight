import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useSocialData } from '@/contexts/SocialDataContext';
import { TrendBadge } from './Badges';
import { MessageSquare, Share2, ThumbsUp, ExternalLink, Hash, TrendingUp, BarChart3, MapPin, Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HashtagDrawerProps {
  open: boolean;
  onClose: () => void;
  hashtag: {
    tag: string;
    volume: number;
    growth: number;
    sources: { twitter: number; facebook: number; instagram: number; news: number };
    sentiment: 'positive' | 'negative' | 'neutral';
    districts: string[];
  } | null;
}

export function HashtagDrawer({ open, onClose, hashtag }: HashtagDrawerProps) {
  const { allPosts, constituencies } = useSocialData();

  // Filter live posts matching this hashtag
  const posts = useMemo(() => {
    if (!hashtag) return [];
    const tagLower = hashtag.tag.toLowerCase();
    return allPosts.filter(p => p.text.toLowerCase().includes(tagLower)).slice(0, 10);
  }, [hashtag, allPosts]);

  // Build timeline from live post timestamps
  const timelineData = useMemo(() => {
    if (posts.length === 0) return [];
    const buckets: Record<string, number> = {};
    const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
    hours.forEach(h => { buckets[h] = 0; });
    for (const post of posts) {
      const hour = new Date(post.created_at).getHours();
      if (hour < 9) buckets['6AM'] += post.likes + post.shares + 1;
      else if (hour < 12) buckets['9AM'] += post.likes + post.shares + 1;
      else if (hour < 15) buckets['12PM'] += post.likes + post.shares + 1;
      else if (hour < 18) buckets['3PM'] += post.likes + post.shares + 1;
      else if (hour < 21) buckets['6PM'] += post.likes + post.shares + 1;
      else buckets['9PM'] += post.likes + post.shares + 1;
    }
    return hours.map(h => ({ hour: h, volume: buckets[h] }));
  }, [posts]);

  if (!hashtag) return null;

  const relatedConstituencies = hashtag.districts
    .map(id => constituencies.find(c => c.id === id))
    .filter(Boolean);

  const sentimentColor = {
    positive: 'bg-success/10 text-success border-success/20',
    negative: 'bg-destructive/10 text-destructive border-destructive/20',
    neutral: 'bg-muted text-muted-foreground border-border'
  };

  const sourceColors: Record<string, string> = {
    twitter: 'bg-primary',
    facebook: 'bg-blue-600',
    instagram: 'bg-pink-500',
    news: 'bg-muted-foreground'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card/95 backdrop-blur-xl border-l border-border/50">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            {hashtag.tag}
          </SheetTitle>
          <SheetDescription>
            Detailed analytics from live data
          </SheetDescription>
        </SheetHeader>

        <motion.div 
          className="py-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Quick Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Volume</p>
              </div>
              <p className="text-xl font-bold">{(hashtag.volume / 1000).toFixed(1)}K</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <p className="text-xs text-muted-foreground">Growth</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xl font-bold">{hashtag.growth > 0 ? '+' : ''}{hashtag.growth}%</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <p className="text-xl font-bold">{posts.length}</p>
            </div>
          </motion.div>

          {/* Sentiment & Trend */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <Badge variant="outline" className={`${sentimentColor[hashtag.sentiment]} capitalize px-3 py-1`}>
              {hashtag.sentiment}
            </Badge>
            <TrendBadge 
              trend={hashtag.growth > 0 ? 'rising' : hashtag.growth < 0 ? 'falling' : 'stable'}
              value={`${hashtag.growth > 0 ? '+' : ''}${hashtag.growth}%`}
            />
          </motion.div>

          {/* Tabs for detailed view */}
          <Tabs defaultValue="sources" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="districts">Regions</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="mt-4 space-y-4">
              <motion.div variants={itemVariants} className="space-y-3">
                {Object.entries(hashtag.sources).map(([source, value], index) => (
                  <motion.div 
                    key={source} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-sm capitalize w-20 text-muted-foreground">{source}</span>
                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${sourceColors[source]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right">{value}%</span>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              {timelineData.length > 0 ? (
                <>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData}>
                        <defs>
                          <linearGradient id="hashtagGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }} 
                        />
                        <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" fill="url(#hashtagGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">Volume from live posts</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No timeline data available</p>
              )}
            </TabsContent>

            <TabsContent value="districts" className="mt-4">
              {relatedConstituencies.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {relatedConstituencies.map((c, index) => (
                    <motion.div 
                      key={c?.id} 
                      className="p-3 rounded-xl bg-muted/30 border border-border/50"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-sm font-medium">{c?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={c?.sentiment} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">{c?.sentiment}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No region data available</p>
              )}
            </TabsContent>
          </Tabs>

          {/* Live Posts */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase font-medium">Live Posts</p>
              <Badge variant="secondary" className="text-xs">{posts.length} posts</Badge>
            </div>
            <div className="space-y-3">
              {posts.length > 0 ? posts.map((post, index) => (
                <motion.div 
                  key={post.id} 
                  className="p-4 rounded-xl bg-gradient-to-br from-muted/30 to-transparent border border-border/50 group hover:border-primary/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-sm text-foreground mb-3 line-clamp-3">{post.text}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-primary">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {post.likes}
                      </span>
                      <Badge variant="outline" className="h-5 text-[10px] capitalize">{post.platform}</Badge>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="p-6 text-center rounded-xl bg-muted/20">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No live posts found for this hashtag</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
