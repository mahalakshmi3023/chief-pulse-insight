import { useState, useEffect } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { districts, topics } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw, Search, Command } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { NotificationCenter } from '@/components/NotificationCenter';
import { FilterPanel } from '@/components/FilterPanel';
import { motion } from 'framer-motion';

interface GlobalHeaderProps {
  onOpenCommandPalette: () => void;
}

export function GlobalHeader({ onOpenCommandPalette }: GlobalHeaderProps) {
  const { filters, updateFilter } = useFilters();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleExport = () => {
    toast({
      title: 'Export queued',
      description: 'Your brief will be ready for download shortly.',
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
    toast({
      title: 'Data refreshed',
      description: 'All metrics have been updated.',
    });
  };

  // Format time ago
  const getTimeAgo = () => {
    const diff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50"
      style={{
        background: 'linear-gradient(180deg, hsl(240 10% 6% / 0.95) 0%, hsl(240 10% 4% / 0.9) 100%)'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Search - Triggers Command Palette */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search anything..."
              className="pl-10 pr-24 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 cursor-pointer"
              onClick={onOpenCommandPalette}
              readOnly
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-2 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={filters.timeRange} onValueChange={(v) => updateFilter('timeRange', v as any)}>
              <SelectTrigger className="w-28 h-9 text-xs bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="6h">6 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.district} onValueChange={(v) => updateFilter('district', v)}>
              <SelectTrigger className="w-36 h-9 text-xs bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors hidden md:flex">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.topic} onValueChange={(v) => updateFilter('topic', v)}>
              <SelectTrigger className="w-32 h-9 text-xs bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors hidden lg:flex">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filter Panel */}
            <FilterPanel />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Data Freshness Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Updated {getTimeAgo()}</span>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
            </Button>
            
            <NotificationCenter />
            
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
                <p className="text-sm font-medium text-foreground">Leader</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/30 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-chart-4/30 text-primary text-sm font-semibold">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
