import { Panel } from '@/components/dashboard/Panel';
import { useSocialData } from '@/contexts/SocialDataContext';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const pos = ['good', 'great', 'success', 'benefit', 'improve'].filter(w => lower.includes(w)).length;
  const neg = ['bad', 'fail', 'crisis', 'protest', 'scam'].filter(w => lower.includes(w)).length;
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

export default function Reports() {
  const { isLoading, allPosts, data, fetchedAt, search, query } = useSocialData();
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({ title: 'Export queued', description: `Your ${format} will be ready shortly.` });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Generating reports...</span>
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const total = allPosts.length;
  const pos = allPosts.filter(p => detectSentiment(p.text) === 'positive').length;
  const neg = allPosts.filter(p => detectSentiment(p.text) === 'negative').length;
  const neu = total - pos - neg;
  const posPercent = total > 0 ? Math.round((pos / total) * 100) : 0;
  const neuPercent = total > 0 ? Math.round((neu / total) * 100) : 0;
  const negPercent = total > 0 ? Math.round((neg / total) * 100) : 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Auto-generated from live API data</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => search(query)}>
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </Button>
      </div>

      <Panel
        title={`Intelligence Briefing — ${dateStr}`}
        subtitle={`Generated from live data at ${fetchedAt?.toLocaleTimeString() || 'N/A'}`}
        action={<Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Live Data</Badge>}
      >
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Overall sentiment: {posPercent}% positive, {neuPercent}% neutral, {negPercent}% negative</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Total posts analyzed: {total} across</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">{data.news.count} news articles found from APIs</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Data fetched at {fetchedAt?.toLocaleTimeString() || 'N/A'}</span>
          </li>
        </ul>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('DOC')}>
            <Download className="w-4 h-4 mr-1" />
            DOC
          </Button>
        </div>
      </Panel>

      {/* Platform Breakdown */}
      <Panel title="Platform Breakdown" subtitle="Data sources summary">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Twitter', count: data.twitter.count },
            { name: 'Instagram', count: data.instagram.count },
            { name: 'Facebook', count: data.facebook.count },
            { name: 'News API', count: data.news.count },
            { name: 'Firecrawl', count: data.firecrawl.count },
          ].map(p => (
            <div key={p.name} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">{p.name}</p>
              <p className="text-2xl font-bold text-foreground">{p.count}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
