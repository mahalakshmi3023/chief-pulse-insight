import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { sentimentSeries, emotionsSeries, districts } from '@/data/mockData';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';

export default function Sentiment() {
  const [selectedDistrict, setSelectedDistrict] = useState<typeof districts[0] | null>(null);

  // Calculate average sentiment
  const latestSentiment = sentimentSeries[sentimentSeries.length - 1];
  const pieData = [
    { name: 'Positive', value: latestSentiment.positive, color: 'hsl(var(--success))' },
    { name: 'Neutral', value: latestSentiment.neutral, color: 'hsl(var(--muted-foreground))' },
    { name: 'Negative', value: latestSentiment.negative, color: 'hsl(var(--destructive))' },
  ];

  // Prepare sentiment timeline data
  const sentimentTimelineData = sentimentSeries.map(d => ({
    time: d.timestamp.split(' ')[1],
    Positive: d.positive,
    Neutral: d.neutral,
    Negative: d.negative,
  }));

  // Prepare emotion timeline data
  const emotionTimelineData = emotionsSeries.map(d => ({
    time: d.timestamp.split(' ')[1],
    Anger: d.anger,
    Fear: d.fear,
    Hope: d.hope,
    Trust: d.trust,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Sentiment & Emotion</h1>
        <p className="text-sm text-muted-foreground mt-1">Statewide public mood analysis</p>
      </div>

      {/* Top Row: Pie + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Donut */}
        <Panel title="Current Sentiment" subtitle="Overall public mood">
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            {pieData.map((item) => (
              <div key={item.name} className="text-center">
                <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</p>
                <p className="text-xs text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </Panel>

        {/* Sentiment Timeline */}
        <Panel title="Sentiment Timeline" subtitle="24-hour trend" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTimelineData}>
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Line type="monotone" dataKey="Positive" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Neutral" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Negative" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Negative</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* District Sentiment Map */}
      <Panel title="District Sentiment Map" subtitle="Click a district to see details">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {districts.map((district) => {
            const sentiment = district.sentiment;
            const bgColor = sentiment > 50 ? 'bg-success/20 hover:bg-success/30' : sentiment > 30 ? 'bg-warning/20 hover:bg-warning/30' : 'bg-destructive/20 hover:bg-destructive/30';
            const textColor = sentiment > 50 ? 'text-success' : sentiment > 30 ? 'text-warning' : 'text-destructive';
            const isSelected = selectedDistrict?.id === district.id;
            
            return (
              <button
                key={district.id}
                onClick={() => setSelectedDistrict(district)}
                className={`p-4 rounded-xl ${bgColor} transition-all text-left ${isSelected ? 'ring-2 ring-primary' : ''}`}
              >
                <p className="text-sm font-medium text-foreground truncate">{district.name}</p>
                <p className={`text-2xl font-bold ${textColor}`}>{sentiment}%</p>
                <p className="text-xs text-muted-foreground">positive</p>
              </button>
            );
          })}
        </div>
      </Panel>

      {/* District Detail Panel */}
      {selectedDistrict && (
        <Panel title={`${selectedDistrict.name} District`} subtitle="Detailed sentiment breakdown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase mb-1">Population</p>
              <p className="text-xl font-semibold">{selectedDistrict.population.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase mb-1">Positive Sentiment</p>
              <p className="text-xl font-semibold text-success">{selectedDistrict.sentiment}%</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase mb-1">Top Issue</p>
              <p className="text-xl font-semibold">Water Supply</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4"
            onClick={() => setSelectedDistrict(null)}
          >
            Close
          </Button>
        </Panel>
      )}

      {/* Emotion Timeline */}
      <Panel title="Emotion Timeline" subtitle="Public emotional state over time">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emotionTimelineData}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="Anger" stroke="hsl(var(--emotion-anger))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Fear" stroke="hsl(var(--emotion-fear))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Hope" stroke="hsl(var(--emotion-hope))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Trust" stroke="hsl(var(--emotion-trust))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-anger" />
            <span className="text-xs text-muted-foreground">Anger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-fear" />
            <span className="text-xs text-muted-foreground">Fear</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-hope" />
            <span className="text-xs text-muted-foreground">Hope</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emotion-trust" />
            <span className="text-xs text-muted-foreground">Trust</span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
