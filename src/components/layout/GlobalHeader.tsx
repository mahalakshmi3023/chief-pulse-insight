import { useFilters } from '@/contexts/FilterContext';
import { districts, topics, sources } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GlobalHeader() {
  const { filters, updateFilter } = useFilters();
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: 'Export queued',
      description: 'Your brief will be ready for download shortly.',
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-foreground">CM Media Intelligence</h1>
              <p className="text-xs text-muted-foreground">Decision Cockpit</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-1 max-w-3xl">
            <Select value={filters.timeRange} onValueChange={(v) => updateFilter('timeRange', v as any)}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="6h">6 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.district} onValueChange={(v) => updateFilter('district', v)}>
              <SelectTrigger className="w-32 h-8 text-xs hidden md:flex">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.topic} onValueChange={(v) => updateFilter('topic', v)}>
              <SelectTrigger className="w-32 h-8 text-xs hidden lg:flex">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.source} onValueChange={(v) => updateFilter('source', v)}>
              <SelectTrigger className="w-28 h-8 text-xs hidden lg:flex">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.language} onValueChange={(v) => updateFilter('language', v as any)}>
              <SelectTrigger className="w-24 h-8 text-xs hidden xl:flex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lang</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Brief</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
