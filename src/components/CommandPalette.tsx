import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Home, TrendingUp, Heart, Newspaper, ShieldAlert, Users, Target, 
  FileText, Settings, Search, Hash, MapPin, Zap, Clock, ArrowRight
} from 'lucide-react';
import { useSocialData } from '@/contexts/SocialDataContext';
import { useFilters } from '@/contexts/FilterContext';
import { Badge } from '@/components/ui/badge';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pages = [
  { name: 'CM Home', path: '/', icon: Home, description: 'Morning briefing dashboard' },
  { name: 'Trends', path: '/trends', icon: TrendingUp, description: 'Real-time hashtag tracking' },
  { name: 'Sentiment', path: '/sentiment', icon: Heart, description: 'Emotion analysis' },
  { name: 'Breaking News', path: '/breaking', icon: Newspaper, description: 'Crisis monitoring' },
  { name: 'Misinformation', path: '/misinfo', icon: ShieldAlert, description: 'False claims tracker' },
  { name: 'Influencers', path: '/influencers', icon: Users, description: 'Key voices & media bias' },
  { name: 'Policy Impact', path: '/policy', icon: Target, description: 'Scheme effectiveness' },
  { name: 'Reports', path: '/reports', icon: FileText, description: 'Auto-generated summaries' },
  { name: 'Admin', path: '/admin', icon: Settings, description: 'Role management' },
];

// No hardcoded searches - all data comes from live APIs

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { updateFilter } = useFilters();
  const { hashtags, constituencies, topics, influencers } = useSocialData();
  const [search, setSearch] = useState('');

  const runCommand = useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  // Filter data based on search
  const filteredHashtags = hashtags.filter(h => 
    h.tag.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  const filteredDistricts = constituencies.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  const filteredInfluencers = influencers.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.handle.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search pages, hashtags, districts, influencers..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => navigate('/reports'))}>
            <Zap className="w-4 h-4 mr-2 text-primary" />
            <span>Generate Report</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>G
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => updateFilter('timeRange', '1h'))}>
            <Clock className="w-4 h-4 mr-2 text-warning" />
            <span>View Last Hour Data</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/breaking'))}>
            <Newspaper className="w-4 h-4 mr-2 text-destructive" />
            <span>Check Breaking News</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Pages */}
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              value={page.name}
              onSelect={() => runCommand(() => navigate(page.path))}
            >
              <page.icon className="w-4 h-4 mr-2" />
              <div className="flex flex-col">
                <span>{page.name}</span>
                <span className="text-xs text-muted-foreground">{page.description}</span>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Dynamic Results */}
        {search && (
          <>
            {filteredHashtags.length > 0 && (
              <CommandGroup heading="Hashtags">
                {filteredHashtags.map((hashtag) => (
                  <CommandItem
                    key={hashtag.id}
                    value={hashtag.tag}
                    onSelect={() => runCommand(() => navigate('/trends'))}
                  >
                    <Hash className="w-4 h-4 mr-2 text-primary" />
                    <span>{hashtag.tag}</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-auto ${
                        hashtag.sentiment === 'positive' ? 'text-success border-success/30' :
                        hashtag.sentiment === 'negative' ? 'text-destructive border-destructive/30' :
                        'text-muted-foreground'
                      }`}
                    >
                      {hashtag.volume.toLocaleString()}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredDistricts.length > 0 && (
              <CommandGroup heading="Districts">
                {filteredDistricts.map((district) => (
                  <CommandItem
                    key={district.id}
                    value={district.name}
                    onSelect={() => runCommand(() => updateFilter('district', district.id))}
                  >
                    <MapPin className="w-4 h-4 mr-2 text-chart-4" />
                    <span>{district.name}</span>
                    <Badge 
                      variant="outline"
                      className={`ml-auto ${
                        district.sentiment > 50 ? 'text-success border-success/30' :
                        district.sentiment > 30 ? 'text-warning border-warning/30' :
                        'text-destructive border-destructive/30'
                      }`}
                    >
                      {district.sentiment}% sentiment
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredInfluencers.length > 0 && (
              <CommandGroup heading="Influencers">
                {filteredInfluencers.map((influencer) => (
                  <CommandItem
                    key={influencer.id}
                    value={influencer.name}
                    onSelect={() => runCommand(() => navigate('/influencers'))}
                  >
                    <Users className="w-4 h-4 mr-2 text-chart-5" />
                    <div className="flex flex-col">
                      <span>{influencer.name}</span>
                      <span className="text-xs text-muted-foreground">{influencer.handle}</span>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`ml-auto ${
                        influencer.alignment === 'pro' ? 'text-success border-success/30' :
                        influencer.alignment === 'anti' ? 'text-destructive border-destructive/30' :
                        'text-muted-foreground'
                      }`}
                    >
                      {influencer.alignment}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
