import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Filter, X, MapPin, Hash, Clock, Radio, ThumbsUp, 
  ThumbsDown, Minus, RotateCcw, Save, Check
} from 'lucide-react';
import { useFilters } from '@/contexts/FilterContext';
import { useSocialData } from '@/contexts/SocialDataContext';

interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, any>;
}

const presets: FilterPreset[] = [
  { id: 'p1', name: 'Crisis Mode', filters: { timeRange: '1h', severity: ['critical', 'high'] } },
  { id: 'p2', name: 'Chennai Focus', filters: { district: 'che', timeRange: '24h' } },
  { id: 'p3', name: 'Social Media Only', filters: { source: ['Twitter/X', 'Facebook', 'Instagram'] } },
];

const timeRanges = [
  { value: '1h', label: 'Last Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];

const sentimentOptions = [
  { value: 'positive', label: 'Positive', icon: ThumbsUp, color: 'text-success' },
  { value: 'neutral', label: 'Neutral', icon: Minus, color: 'text-muted-foreground' },
  { value: 'negative', label: 'Negative', icon: ThumbsDown, color: 'text-destructive' },
];

export function FilterPanel() {
  const { filters, updateFilter, resetFilters } = useFilters();
  const { constituencies, topics } = useSocialData();
  const districts = constituencies;
  // Static sources list (these are platform categories, not data-derived)
  const sources = [
    { id: 's1', name: 'Twitter/X', type: 'social' as const },
    { id: 's2', name: 'Facebook', type: 'social' as const },
    { id: 's3', name: 'Instagram', type: 'social' as const },
    { id: 's4', name: 'News', type: 'news' as const },
    { id: 's5', name: 'Firecrawl', type: 'social' as const },
  ];
  const [open, setOpen] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const activeFilterCount = [
    filters.timeRange !== '24h' ? 1 : 0,
    filters.district !== 'all' ? 1 : 0,
    filters.topic !== 'all' ? 1 : 0,
    filters.source !== 'all' ? 1 : 0,
    selectedSentiments.length,
  ].reduce((a, b) => a + b, 0);

  const handleDistrictToggle = (districtId: string) => {
    setSelectedDistricts(prev => 
      prev.includes(districtId) 
        ? prev.filter(d => d !== districtId)
        : [...prev, districtId]
    );
  };

  const handleSourceToggle = (sourceName: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceName)
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const handleSentimentToggle = (sentiment: string) => {
    setSelectedSentiments(prev =>
      prev.includes(sentiment)
        ? prev.filter(s => s !== sentiment)
        : [...prev, sentiment]
    );
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  const applyFilters = () => {
    // Apply the multi-select filters
    if (selectedDistricts.length === 1) {
      updateFilter('district', selectedDistricts[0]);
    } else if (selectedDistricts.length === 0) {
      updateFilter('district', 'all');
    }
    
    if (selectedTopics.length === 1) {
      updateFilter('topic', selectedTopics[0]);
    } else if (selectedTopics.length === 0) {
      updateFilter('topic', 'all');
    }

    setOpen(false);
  };

  const handleReset = () => {
    resetFilters();
    setSelectedDistricts([]);
    setSelectedSources([]);
    setSelectedSentiments([]);
    setSelectedTopics([]);
  };

  const applyPreset = (preset: FilterPreset) => {
    if (preset.filters.timeRange) {
      updateFilter('timeRange', preset.filters.timeRange);
    }
    if (preset.filters.district) {
      updateFilter('district', preset.filters.district);
      setSelectedDistricts([preset.filters.district]);
    }
    if (preset.filters.source) {
      setSelectedSources(preset.filters.source);
    }
    if (preset.filters.severity) {
      setSelectedSentiments(preset.filters.severity);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 relative border-border/50 bg-muted/30 hover:bg-muted/50"
        >
          <Filter className="w-4 h-4" />
          Advanced Filters
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground"
              >
                {activeFilterCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-card/95 backdrop-blur-xl border-l border-border/50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Advanced Filters
          </SheetTitle>
          <SheetDescription>
            Apply multiple filters to narrow down your data view
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Filter Presets */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="text-xs border-border/50 hover:border-primary/50 hover:bg-primary/10"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Time Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Range
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={filters.timeRange === range.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('timeRange', range.value as any)}
                    className="text-xs"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Accordion Filters */}
            <Accordion type="multiple" className="space-y-2">
              {/* Districts */}
              <AccordionItem value="districts" className="border border-border/50 rounded-xl px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Districts</span>
                    {selectedDistricts.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedDistricts.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {districts.map((district) => (
                      <div 
                        key={district.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={district.id}
                          checked={selectedDistricts.includes(district.id)}
                          onCheckedChange={() => handleDistrictToggle(district.id)}
                        />
                        <Label 
                          htmlFor={district.id}
                          className="text-sm cursor-pointer"
                        >
                          {district.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Sources */}
              <AccordionItem value="sources" className="border border-border/50 rounded-xl px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    <span>Sources</span>
                    {selectedSources.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedSources.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {sources.map((source) => (
                      <div 
                        key={source.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={source.id}
                          checked={selectedSources.includes(source.name)}
                          onCheckedChange={() => handleSourceToggle(source.name)}
                        />
                        <Label 
                          htmlFor={source.id}
                          className="text-sm cursor-pointer flex items-center gap-2"
                        >
                          {source.name}
                          <Badge variant="outline" className="text-[10px]">
                            {source.type}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Topics */}
              <AccordionItem value="topics" className="border border-border/50 rounded-xl px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span>Topics</span>
                    {selectedTopics.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedTopics.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-2 mt-2">
                    {topics.map((topic) => (
                      <div 
                        key={topic.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={topic.id}
                          checked={selectedTopics.includes(topic.id)}
                          onCheckedChange={() => handleTopicToggle(topic.id)}
                        />
                        <Label 
                          htmlFor={topic.id}
                          className="text-sm cursor-pointer flex items-center gap-2 flex-1"
                        >
                          {topic.name}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {topic.volume.toLocaleString()}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Sentiment */}
              <AccordionItem value="sentiment" className="border border-border/50 rounded-xl px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Sentiment</span>
                    {selectedSentiments.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedSentiments.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="flex gap-2 mt-2">
                    {sentimentOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedSentiments.includes(option.value) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSentimentToggle(option.value)}
                        className="flex-1 gap-2"
                      >
                        <option.icon className={`w-4 h-4 ${
                          selectedSentiments.includes(option.value) ? '' : option.color
                        }`} />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <Label className="text-xs text-muted-foreground mb-2 block">Active Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {filters.timeRange !== '24h' && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {timeRanges.find(t => t.value === filters.timeRange)?.label}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilter('timeRange', '24h')} />
                    </Badge>
                  )}
                  {selectedDistricts.map(d => (
                    <Badge key={d} variant="secondary" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {districts.find(dist => dist.id === d)?.name}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleDistrictToggle(d)} />
                    </Badge>
                  ))}
                  {selectedSentiments.map(s => (
                    <Badge key={s} variant="secondary" className="gap-1 capitalize">
                      {s}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleSentimentToggle(s)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-card/95 backdrop-blur-xl">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={applyFilters}
            >
              <Check className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
