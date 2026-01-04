import { useState, useEffect } from 'react';
import { breakingNews } from '@/data/mockData';
import { AlertTriangle, Radio } from 'lucide-react';

export function BreakingTicker() {
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

  const currentNews = displayNews[currentIndex];
  if (!currentNews) return null;

  const severityColor = {
    critical: 'bg-destructive',
    high: 'bg-warning',
    medium: 'bg-muted-foreground',
    low: 'bg-muted-foreground',
  };

  return (
    <div className="bg-ticker text-ticker-foreground py-2 px-4">
      <div className="max-w-[1600px] mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Radio className="w-4 h-4 animate-pulse-subtle text-destructive" />
          <span className="text-xs font-medium uppercase tracking-wider opacity-70">Live</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-3 fade-in" key={currentNews.id}>
            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${severityColor[currentNews.severity]} text-primary-foreground`}>
              {currentNews.severity}
            </span>
            <span className="text-sm font-medium truncate">{currentNews.title}</span>
            <span className="text-xs opacity-60 shrink-0">{currentNews.source}</span>
          </div>
        </div>

        {displayNews.length > 1 && (
          <div className="flex gap-1 shrink-0">
            {displayNews.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-ticker-foreground' : 'bg-ticker-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
