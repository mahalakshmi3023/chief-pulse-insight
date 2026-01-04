import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { SeverityBadge } from '@/components/dashboard/Badges';
import { breakingNews, districts } from '@/data/mockData';
import { AlertTriangle, Clock, MapPin, ExternalLink, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function BreakingNews() {
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});

  // Watchlist topics for crisis escalation
  const watchlistTopics = [
    { id: 1, topic: 'Water Supply Disruption', districts: ['Chennai', 'Coimbatore'], riskLevel: 'high', mentions: 12400 },
    { id: 2, topic: 'Fuel Price Protest', districts: ['Chennai', 'Madurai', 'Salem'], riskLevel: 'medium', mentions: 8900 },
    { id: 3, topic: 'Power Outage Reports', districts: ['Erode', 'Salem'], riskLevel: 'low', mentions: 3200 },
  ];

  const handleActionNoteChange = (newsId: string, note: string) => {
    setActionNotes(prev => ({ ...prev, [newsId]: note }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Breaking News & Crisis</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time news monitoring and crisis detection</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="w-4 h-4" />
          Alert Settings
        </Button>
      </div>

      {/* Breaking News Feed */}
      <Panel title="Breaking News Feed" subtitle="Latest updates requiring attention">
        <div className="space-y-4">
          {breakingNews.map((news) => {
            const relatedDistricts = news.districts.map(id => districts.find(d => d.id === id)?.name).filter(Boolean);
            
            return (
              <div 
                key={news.id} 
                className="p-4 rounded-xl bg-muted/30 border border-border hover:border-muted-foreground/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={news.severity} />
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                        {news.category}
                      </span>
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
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {relatedDistricts.join(', ')}
                    </span>
                  </div>
                  <span>Source: {news.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Crisis Escalation Detector */}
      <Panel 
        title="Crisis Escalation Detector" 
        subtitle="Topics with potential to escalate"
        action={
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse-subtle" />
            <span className="text-xs text-muted-foreground">Monitoring active</span>
          </div>
        }
      >
        <div className="space-y-4">
          {watchlistTopics.map((topic) => (
            <div key={topic.id} className="p-4 rounded-xl bg-muted/30">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`w-4 h-4 ${
                      topic.riskLevel === 'high' ? 'text-destructive' : 
                      topic.riskLevel === 'medium' ? 'text-warning' : 'text-muted-foreground'
                    }`} />
                    <h3 className="font-semibold text-foreground">{topic.topic}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{topic.mentions.toLocaleString()} mentions</span>
                    <span>Districts: {topic.districts.join(', ')}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                  topic.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' :
                  topic.riskLevel === 'medium' ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {topic.riskLevel} risk
                </span>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Recommended Action Notes</label>
                <Textarea 
                  placeholder="Add action notes or recommendations..."
                  className="min-h-[60px] text-sm"
                  value={actionNotes[topic.id] || ''}
                  onChange={(e) => handleActionNoteChange(String(topic.id), e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <span>Escalate to CM Office</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>Notify District Collectors</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <Bell className="w-5 h-5" />
          <span>Configure Alert Rules</span>
        </Button>
      </div>
    </div>
  );
}
