import { useState, useEffect } from 'react';
import { useSocialSearch } from '@/hooks/useSocialSearch';
import { AlertTriangle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BreakingTicker() {
  const { breakingNews, isLoading } = useSocialSearch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const criticalNews = breakingNews.filter(n => n.severity === 'critical' || n.severity === 'high');
  const displayNews = criticalNews.length > 0 ? criticalNews : breakingNews.slice(0, 2);

  useEffect(() => {
    if (displayNews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayNews.length]);

  if (isLoading || displayNews.length === 0) return null;

  const currentNews = displayNews[currentIndex];
  if (!currentNews) return null;

  return (
    <div 
      className="relative overflow-hidden border-b border-border/50"
      style={{ background: 'linear-gradient(90deg, hsl(0 60% 12%) 0%, hsl(222 47% 11%) 50%, hsl(0 60% 12%) 100%)' }}
    >
      <div className="max-w-[1600px] mx-auto flex items-center gap-4 py-2.5 px-4">
        <div className="shrink-0 flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
          <Radio className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Live</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-3 fade-in" key={currentNews.id}>
            {(currentNews.severity === 'critical' || currentNews.severity === 'high') && (
              <AlertTriangle className={cn(
                "w-4 h-4 shrink-0",
                currentNews.severity === 'critical' ? "text-destructive animate-pulse" : "text-warning"
              )} />
            )}
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium uppercase border",
              currentNews.severity === 'critical' ? "bg-destructive/20 text-destructive border-destructive/30" 
              : currentNews.severity === 'high' ? "bg-warning/20 text-warning border-warning/30"
              : "bg-muted text-muted-foreground border-border"
            )}>
              {currentNews.severity}
            </span>
            <span className={cn(
              "text-sm font-medium truncate",
              currentNews.severity === 'critical' ? "text-destructive" 
              : currentNews.severity === 'high' ? "text-warning"
              : "text-foreground"
            )}>
              {currentNews.title}
            </span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted/30 shrink-0">
              {currentNews.source}
            </span>
          </div>
        </div>

        {displayNews.length > 1 && (
          <div className="flex gap-1.5 shrink-0">
            {displayNews.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentIndex(idx)} className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentIndex ? 'bg-primary shadow-glow-sm scale-110' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
