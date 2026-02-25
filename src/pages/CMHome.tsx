import { useState, useEffect } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { HashtagDrawer } from '@/components/dashboard/HashtagDrawer';
import { TrendBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { TrendingUp, TrendingDown, Newspaper, AlertTriangle, Sparkles, Loader2, RefreshCw, Hash, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CMHome() {
  const { isLoading, hashtags, topics, data, breakingNews, kpiData, fetchedAt, search, query, allPosts } = useSocialData();

  const [selectedHashtag, setSelectedHashtag] = useState<typeof hashtags[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const newsArticles = [...data.news.data, ...data.firecrawl.data];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Fetching live data...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
            {fetchedAt ? 'Fetching live data...' : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{query}</span>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => search(query)}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Public Sentiment</span>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{kpiData.publicSentiment.positive}%</span>
            <span className="text-sm text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-3 h-3 text-destructive" />
            <span className="text-xs text-destructive">{kpiData.publicSentiment.change}%</span>
            <span className="text-xs text-muted-foreground">vs baseline</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Posts</span>
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{allPosts.length}</span>
            <span className="text-sm text-muted-foreground">across platforms</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">News Articles</span>
            <Newspaper className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{data.news.count + data.firecrawl.count}</span>
            <span className="text-sm text-muted-foreground">from APIs</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Negative Sentiment</span>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{kpiData.publicSentiment.negative}%</span>
            <span className="text-sm text-muted-foreground">Negative</span>
          </div>
        </div>
      </div>

      {/* 5 Platform Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { name: 'Twitter', count: data.twitter.count, icon: '🐦', color: 'text-primary' },
          { name: 'Instagram', count: data.instagram.count, icon: '📷', color: 'text-pink-400' },
          { name: 'Facebook', count: data.facebook.count, icon: '👤', color: 'text-blue-400' },
          { name: 'News', count: data.news.count, icon: '📰', color: 'text-muted-foreground' },
          { name: 'Firecrawl', count: data.firecrawl.count, icon: '🌐', color: 'text-orange-400' },
        ].map(platform => (
          <div key={platform.name} className="p-4 rounded-xl bg-card/50 border border-border/50 flex items-center gap-3">
            <span className="text-lg">{platform.icon}</span>
            <div>
              <p className="text-xs text-muted-foreground">{platform.name}</p>
              <p className="text-xl font-bold text-foreground">{platform.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Hashtags + Live News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Trending Hashtags" subtitle="Derived from live social media data">
          <div className="space-y-2">
            {hashtags.slice(0, 8).map((tag, idx) => (
              <div
                key={tag.id}
                onClick={() => handleHashtagClick(tag)}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary w-8">#{idx + 1}</span>
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
            {hashtags.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No hashtags found. Try a different search query.</p>
            )}
          </div>
        </Panel>

        <Panel title="Live News Feed" subtitle="From News API & Firecrawl">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {newsArticles.slice(0, 10).map((article, i) => (
              <div key={article.id || i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm font-medium text-foreground line-clamp-2">{article.text}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{article.author}</span>
                  <span>{new Date(article.created_at).toLocaleTimeString()}</span>
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-auto">
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
            {newsArticles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No news articles found.</p>
            )}
          </div>
        </Panel>
      </div>

      {/* Topic Clusters */}
      <Panel title="Topic Clusters" subtitle="Extracted from live social data">
        <div className="space-y-3">
          {topics.map((topic, idx) => (
            <div key={topic.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{topic.category} · {topic.volume.toLocaleString()} mentions</p>
                </div>
              </div>
              <TrendBadge trend={topic.trend} />
            </div>
          ))}
          {topics.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No topics detected.</p>
          )}
        </div>
      </Panel>

      <HashtagDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} hashtag={selectedHashtag} />
    </div>
  );
}
