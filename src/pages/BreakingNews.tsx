import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { SeverityBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { AlertTriangle, Clock, MapPin, ExternalLink, Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function BreakingNews() {
  const { isLoading, breakingNews, fetchedAt } = useSocialData();
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading breaking news from live APIs...</span>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Breaking Alerts & Crisis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live news from APIs · {fetchedAt?.toLocaleTimeString()}
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs ml-2">Live</Badge>
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="w-4 h-4" />
          Alert Settings
        </Button>
      </div>

      <Panel title="Breaking News Feed" subtitle={`${breakingNews.length} live stories from news APIs`}>
        <div className="space-y-4">
          {breakingNews.map((news) => (
            <div key={news.id} className="p-4 rounded-xl bg-muted/30 border border-border hover:border-muted-foreground/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <SeverityBadge severity={news.severity} />
                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">{news.category}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{news.title}</h3>
                  <p className="text-sm text-muted-foreground">{news.summary}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(news.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span>Source: {news.source}</span>
              </div>
            </div>
          ))}
          {breakingNews.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">No breaking news detected from live news APIs</p>
          )}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <span>Escalate to Leader Office</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>Notify Constituency Coordinators</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <Bell className="w-5 h-5" />
          <span>Configure Alert Rules</span>
        </Button>
      </div>
    </div>
  );
}
