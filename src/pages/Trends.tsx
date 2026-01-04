import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { HashtagDrawer } from '@/components/dashboard/HashtagDrawer';
import { TrendBadge } from '@/components/dashboard/Badges';
import { hashtags, topics } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, TrendingUp, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Trends() {
  const [selectedHashtag, setSelectedHashtag] = useState<typeof hashtags[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleHashtagClick = (hashtag: typeof hashtags[0]) => {
    setSelectedHashtag(hashtag);
    setDrawerOpen(true);
  };

  const filteredHashtags = hashtags.filter(h => 
    h.tag.toLowerCase().includes(search.toLowerCase())
  );

  // Mock trend data for chart
  const trendData = [
    { hour: '6AM', volume: 12400 },
    { hour: '8AM', volume: 28900 },
    { hour: '10AM', volume: 45600 },
    { hour: '12PM', volume: 52300 },
    { hour: '2PM', volume: 48100 },
    { hour: '4PM', volume: 61200 },
    { hour: '6PM', volume: 58700 },
  ];

  // Mock viral content
  const viralContent = [
    { id: 1, type: 'meme', caption: 'Water tanker reaching Kolathur be like...', engagement: '45K', platform: 'Twitter' },
    { id: 2, type: 'video', caption: 'CM inaugurating new hospital in Madurai', engagement: '120K', platform: 'YouTube' },
    { id: 3, type: 'image', caption: 'Students enjoying breakfast scheme', engagement: '32K', platform: 'Instagram' },
    { id: 4, type: 'meme', caption: 'Opposition press conference reaction', engagement: '28K', platform: 'Twitter' },
    { id: 5, type: 'video', caption: 'Free bus travel impact story', engagement: '89K', platform: 'Facebook' },
    { id: 6, type: 'image', caption: 'New metro line announcement', engagement: '18K', platform: 'Twitter' },
  ];

  // Mock Google Trends correlation
  const googleTrends = [
    { topic: 'Water supply Chennai', interest: 92, change: 45 },
    { topic: 'TN government schemes', interest: 78, change: 12 },
    { topic: 'CM MK Stalin', interest: 65, change: -5 },
    { topic: 'AIADMK protest', interest: 54, change: 23 },
    { topic: 'Tamil Nadu jobs', interest: 48, change: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Trends</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time hashtag tracking and issue monitoring</p>
      </div>

      {/* Hashtag Table */}
      <Panel 
        title="Trending Hashtags" 
        subtitle="Live social media tracking"
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search hashtags..." 
              className="pl-9 h-8 w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      >
        <DataTable
          data={filteredHashtags}
          onRowClick={handleHashtagClick}
          columns={[
            { key: 'tag', header: 'Hashtag', render: (item) => (
              <span className="font-medium text-foreground">{item.tag}</span>
            )},
            { key: 'volume', header: 'Volume', render: (item) => (
              <span>{item.volume.toLocaleString()}</span>
            )},
            { key: 'growth', header: 'Growth', render: (item) => (
              <TrendBadge 
                trend={item.growth > 0 ? 'rising' : item.growth < 0 ? 'falling' : 'stable'}
                value={`${item.growth > 0 ? '+' : ''}${item.growth}%`}
              />
            )},
            { key: 'sources', header: 'Source Distribution', className: 'hidden md:table-cell', render: (item) => (
              <div className="flex items-center gap-1">
                <div className="h-2 w-16 bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: `${item.sources.twitter}%` }} />
                  <div className="bg-blue-700 h-full" style={{ width: `${item.sources.facebook}%` }} />
                  <div className="bg-pink-500 h-full" style={{ width: `${item.sources.instagram}%` }} />
                  <div className="bg-gray-500 h-full" style={{ width: `${item.sources.news}%` }} />
                </div>
              </div>
            )},
            { key: 'sentiment', header: 'Sentiment', render: (item) => {
              const colors = {
                positive: 'text-success',
                negative: 'text-destructive',
                neutral: 'text-muted-foreground'
              };
              return <span className={`capitalize ${colors[item.sentiment]}`}>{item.sentiment}</span>;
            }},
          ]}
        />
      </Panel>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Clustering */}
        <Panel title="Issue Clusters" subtitle="Top topics by volume">
          <div className="space-y-3">
            {topics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{topic.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{(topic.volume / 1000).toFixed(1)}K</span>
                  <TrendBadge trend={topic.trend} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Trend Chart */}
        <Panel title="Volume Timeline" subtitle="Hashtag activity over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Viral/Meme Monitor */}
      <Panel title="Viral Content Monitor" subtitle="Trending memes and videos">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {viralContent.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="aspect-square rounded-xl bg-muted/50 flex items-center justify-center mb-2 group-hover:bg-muted transition-colors">
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xs font-medium text-foreground line-clamp-2">{item.caption}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{item.engagement}</span>
                <span className="text-xs text-muted-foreground">• {item.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Google Trends Correlation */}
      <Panel title="Google Trends Correlation" subtitle="Search interest in Tamil Nadu">
        <DataTable
          data={googleTrends}
          columns={[
            { key: 'topic', header: 'Search Term', render: (item) => (
              <span className="font-medium">{item.topic}</span>
            )},
            { key: 'interest', header: 'Interest', render: (item) => (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.interest}%` }}
                  />
                </div>
                <span className="text-sm">{item.interest}</span>
              </div>
            )},
            { key: 'change', header: '7d Change', render: (item) => (
              <TrendBadge 
                trend={item.change > 0 ? 'rising' : item.change < 0 ? 'falling' : 'stable'}
                value={`${item.change > 0 ? '+' : ''}${item.change}%`}
              />
            )},
          ]}
        />
      </Panel>

      {/* Drawer */}
      <HashtagDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        hashtag={selectedHashtag}
      />
    </div>
  );
}
