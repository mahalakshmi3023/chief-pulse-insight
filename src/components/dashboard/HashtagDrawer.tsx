import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { samplePosts, districts } from '@/data/mockData';
import { TrendBadge } from './Badges';
import { MessageSquare, Share2, ThumbsUp } from 'lucide-react';

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
  if (!hashtag) return null;

  const posts = samplePosts[hashtag.tag as keyof typeof samplePosts] || [];
  const relatedDistricts = hashtag.districts.map(id => districts.find(d => d.id === id)?.name).filter(Boolean);

  const sentimentColor = {
    positive: 'bg-success/10 text-success',
    negative: 'bg-destructive/10 text-destructive',
    neutral: 'bg-muted text-muted-foreground'
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl">{hashtag.tag}</SheetTitle>
          <SheetDescription>
            Detailed analytics and sample posts
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase mb-1">Volume</p>
              <p className="text-lg font-semibold">{hashtag.volume.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase mb-1">Growth</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{hashtag.growth > 0 ? '+' : ''}{hashtag.growth}%</p>
                <TrendBadge trend={hashtag.growth > 0 ? 'rising' : hashtag.growth < 0 ? 'falling' : 'stable'} />
              </div>
            </div>
          </div>

          {/* Sentiment */}
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-2">Sentiment</p>
            <Badge className={sentimentColor[hashtag.sentiment]}>{hashtag.sentiment}</Badge>
          </div>

          {/* Source Distribution */}
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-3">Source Distribution</p>
            <div className="space-y-2">
              {Object.entries(hashtag.sources).map(([source, value]) => (
                <div key={source} className="flex items-center gap-3">
                  <span className="text-sm capitalize w-20">{source}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/60 rounded-full" 
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Districts */}
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-2">Top Districts</p>
            <div className="flex flex-wrap gap-2">
              {relatedDistricts.map((district) => (
                <Badge key={district} variant="secondary">{district}</Badge>
              ))}
            </div>
          </div>

          {/* Sample Posts */}
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-3">Sample Posts</p>
            <div className="space-y-3">
              {posts.length > 0 ? posts.map((post) => (
                <div key={post.id} className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-sm text-foreground mb-3">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {post.engagement}
                      </span>
                      <span>{post.source}</span>
                    </div>
                    <span>{new Date(post.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No sample posts available</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
