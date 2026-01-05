import { useFilters } from '@/contexts/FilterContext';
import { districts, topics, sources } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw, Search, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50"
      style={{
        background: 'linear-gradient(180deg, hsl(240 10% 6% / 0.95) 0%, hsl(240 10% 4% / 0.9) 100%)'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search across all data..."
              className="pl-10 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={filters.timeRange} onValueChange={(v) => updateFilter('timeRange', v as any)}>
              <SelectTrigger className="w-28 h-9 text-xs bg-muted/30 border-border/50">
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
              <SelectTrigger className="w-36 h-9 text-xs bg-muted/30 border-border/50 hidden md:flex">
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
              <SelectTrigger className="w-32 h-9 text-xs bg-muted/30 border-border/50 hidden lg:flex">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </Button>
            
            <Button 
              size="sm" 
              className="h-9 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-sm" 
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-border/50">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">Chief Minister</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/30">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}