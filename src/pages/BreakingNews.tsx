import { Panel } from '@/components/dashboard/Panel';
import { useSocialData } from '@/contexts/SocialDataContext';
import { Clock, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function BreakingNews() {
  const { isLoading, data, breakingNews, fetchedAt, search, query } = useSocialData();

  const newsArticles = [...data.news.data, ...data.firecrawl.data];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading breaking news...</span>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Breaking Alerts & News</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live news from APIs · {newsArticles.length} articles
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => search(query)}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <Panel title="Live News Feed" subtitle="From News API & Firecrawl web scraping">
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {newsArticles.map((article, i) => (
            <div key={article.id || i} className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-muted-foreground/30 transition-colors">
              <p className="text-sm font-medium text-foreground mb-2">{article.text}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(article.created_at).toLocaleTimeString()}
                  </span>
                  <span>{article.author}</span>
                </div>
                {article.url && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
          {newsArticles.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">No news articles found. Try refreshing.</p>
          )}
        </div>
      </Panel>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">News API Articles</p>
          <p className="text-2xl font-bold text-foreground">{data.news.count}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Firecrawl Articles</p>
          <p className="text-2xl font-bold text-foreground">{data.firecrawl.count}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-primary">{data.news.count + data.firecrawl.count}</p>
        </div>
      </div>
    </div>
  );
}
