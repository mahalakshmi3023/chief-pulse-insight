import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '@/components/dashboard/Panel';
import { useSocialSearch } from '@/hooks/useSocialSearch';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CountUp } from '@/components/AnimatedNumber';
import { Heart, TrendingUp, TrendingDown, MapPin, Users, AlertCircle, ThumbsUp, ThumbsDown, Minus, Smile, Frown, Meh, Activity, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function Sentiment() {
  const { isLoading, sentimentSeries, emotionsSeries, constituencies, fetchedAt } = useSocialSearch();
  const districts = constituencies;

  const [selectedDistrict, setSelectedDistrict] = useState<typeof districts[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading sentiment data from live APIs...</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  const latestSentiment = sentimentSeries[sentimentSeries.length - 1] || { positive: 50, neutral: 30, negative: 20 };
  const previousSentiment = sentimentSeries[sentimentSeries.length - 2] || latestSentiment;
  
  const sentimentChange = {
    positive: latestSentiment.positive - previousSentiment.positive,
    neutral: latestSentiment.neutral - previousSentiment.neutral,
    negative: latestSentiment.negative - previousSentiment.negative,
  };

  const pieData = [
    { name: 'Positive', value: latestSentiment.positive, color: 'hsl(var(--success))' },
    { name: 'Neutral', value: latestSentiment.neutral, color: 'hsl(var(--muted-foreground))' },
    { name: 'Negative', value: latestSentiment.negative, color: 'hsl(var(--destructive))' },
  ];

  const sentimentTimelineData = sentimentSeries.map(d => ({
    time: d.timestamp.split(' ')[1],
    Positive: d.positive,
    Neutral: d.neutral,
    Negative: d.negative,
  }));

  const latestEmotions = emotionsSeries[emotionsSeries.length - 1] || { anger: 15, fear: 10, hope: 40, trust: 35 };
  const radarData = [
    { emotion: 'Anger', value: latestEmotions.anger, fullMark: 50 },
    { emotion: 'Fear', value: latestEmotions.fear, fullMark: 50 },
    { emotion: 'Hope', value: latestEmotions.hope, fullMark: 50 },
    { emotion: 'Trust', value: latestEmotions.trust, fullMark: 50 },
  ];

  const emotionTimelineData = emotionsSeries.map(d => ({
    time: d.timestamp.split(' ')[1],
    Anger: d.anger, Fear: d.fear, Hope: d.hope, Trust: d.trust,
  }));

  const sortedDistricts = [...districts].sort((a, b) => b.sentiment - a.sentiment);
  const topDistricts = sortedDistricts.slice(0, 5);
  const bottomDistricts = sortedDistricts.slice(-5).reverse();

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const cardVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };
  const districtVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.03, duration: 0.3 } }) };

  const handleDistrictClick = (district: typeof districts[0]) => {
    setSelectedDistrict(district);
    setDialogOpen(true);
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Sentiment & Emotion
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs ml-2">Live API</Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Derived from live social media data · {fetchedAt?.toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20" whileHover={{ scale: 1.02 }}>
              <ThumbsUp className="w-4 h-4 text-success" />
              <div>
                <p className="text-xs text-success/70">Positive</p>
                <p className="text-lg font-bold text-success flex items-center gap-1">
                  <CountUp end={latestSentiment.positive} duration={1.5} suffix="%" />
                  {sentimentChange.positive > 0 && <TrendingUp className="w-3 h-3" />}
                </p>
              </div>
            </motion.div>
            <motion.div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border" whileHover={{ scale: 1.02 }}>
              <Minus className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Neutral</p>
                <p className="text-lg font-bold text-foreground"><CountUp end={latestSentiment.neutral} duration={1.5} suffix="%" /></p>
              </div>
            </motion.div>
            <motion.div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20" whileHover={{ scale: 1.02 }}>
              <ThumbsDown className="w-4 h-4 text-destructive" />
              <div>
                <p className="text-xs text-destructive/70">Negative</p>
                <p className="text-lg font-bold text-destructive flex items-center gap-1">
                  <CountUp end={latestSentiment.negative} duration={1.5} suffix="%" />
                  {sentimentChange.negative < 0 && <TrendingDown className="w-3 h-3" />}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Pie + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants}>
          <Panel title="Current Sentiment" subtitle="From live API analysis">
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" animationBegin={200} animationDuration={1000}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-foreground"><CountUp end={latestSentiment.positive} duration={1.5} />%</p>
                <p className="text-xs text-muted-foreground">Positive</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
              {pieData.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}%</p>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Panel title="Sentiment Timeline" subtitle="Derived from live data analysis">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentTimelineData}>
                  <defs>
                    <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} domain={[0, 60]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Positive" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#positiveGradient)" />
                  <Area type="monotone" dataKey="Negative" stroke="hsl(var(--destructive))" strokeWidth={2} fill="url(#negativeGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* Emotion Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants}>
          <Panel title="Emotion Radar" subtitle="From live data NLP">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar name="Emotions" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
              {radarData.map((item) => (
                <motion.button key={item.emotion} className={`p-2 rounded-lg text-left transition-all ${selectedEmotion === item.emotion ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30 border border-transparent hover:bg-muted/50'}`} onClick={() => setSelectedEmotion(selectedEmotion === item.emotion ? null : item.emotion)} whileHover={{ scale: 1.02 }}>
                  <p className="text-xs text-muted-foreground">{item.emotion}</p>
                  <p className="text-lg font-bold">{item.value}%</p>
                </motion.button>
              ))}
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Panel title="Emotion Timeline" subtitle="From live social data analysis">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emotionTimelineData}>
                  <defs>
                    <linearGradient id="hopeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--emotion-hope))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--emotion-hope))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--emotion-trust))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--emotion-trust))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Hope" stroke="hsl(var(--emotion-hope))" strokeWidth={2} fill="url(#hopeGradient)" />
                  <Area type="monotone" dataKey="Trust" stroke="hsl(var(--emotion-trust))" strokeWidth={2} fill="url(#trustGradient)" />
                  <Area type="monotone" dataKey="Fear" stroke="hsl(var(--emotion-fear))" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="Anger" stroke="hsl(var(--emotion-anger))" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* District Heatmap */}
      <motion.div variants={cardVariants}>
        <Panel title="District Sentiment Heatmap" subtitle="Click any district to see breakdown" action={<Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><Activity className="w-3 h-3 mr-1" />Live Data</Badge>}>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {districts.map((district, index) => {
              const sentiment = district.sentiment;
              const getBgClass = () => sentiment > 50 ? 'bg-gradient-to-br from-success/20 to-success/5' : sentiment > 35 ? 'bg-gradient-to-br from-warning/20 to-warning/5' : 'bg-gradient-to-br from-destructive/20 to-destructive/5';
              const getTextClass = () => sentiment > 50 ? 'text-success' : sentiment > 35 ? 'text-warning' : 'text-destructive';
              const getIcon = () => sentiment > 50 ? <Smile className="w-4 h-4 text-success" /> : sentiment > 35 ? <Meh className="w-4 h-4 text-warning" /> : <Frown className="w-4 h-4 text-destructive" />;
              
              return (
                <motion.button key={district.id} onClick={() => handleDistrictClick(district)} className={`relative p-4 rounded-xl ${getBgClass()} transition-all text-left overflow-hidden border ${selectedDistrict?.id === district.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'} hover:shadow-lg`} variants={districtVariants} custom={index} whileHover={{ scale: 1.03, y: -2 }}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground truncate">{district.name}</p>
                      {getIcon()}
                    </div>
                    <p className={`text-2xl font-bold ${getTextClass()}`}>{sentiment}%</p>
                    <div className="mt-2 h-1 bg-muted/50 rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${sentiment > 50 ? 'bg-success' : sentiment > 35 ? 'bg-warning' : 'bg-destructive'}`} initial={{ width: 0 }} animate={{ width: `${sentiment}%` }} transition={{ delay: index * 0.03 + 0.5, duration: 0.8 }} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Panel>
      </motion.div>

      {/* Top/Bottom Districts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={cardVariants}>
          <Panel title="Top Performing Districts" subtitle="Highest positive sentiment" action={<ThumbsUp className="w-4 h-4 text-success" />}>
            <div className="space-y-3">
              {topDistricts.map((district, index) => (
                <motion.div key={district.id} className="flex items-center gap-4 p-3 rounded-xl bg-success/5 hover:bg-success/10 transition-colors cursor-pointer group" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} onClick={() => handleDistrictClick(district)}>
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success font-bold text-sm">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{district.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={district.sentiment} className="h-1.5 flex-1" />
                      <span className="text-sm font-semibold text-success">{district.sentiment}%</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Panel title="Districts Needing Attention" subtitle="Lowest positive sentiment" action={<AlertCircle className="w-4 h-4 text-destructive" />}>
            <div className="space-y-3">
              {bottomDistricts.map((district, index) => (
                <motion.div key={district.id} className="flex items-center gap-4 p-3 rounded-xl bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer group" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} onClick={() => handleDistrictClick(district)}>
                  <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive font-bold text-sm">{districts.length - bottomDistricts.length + index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{district.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={district.sentiment} className="h-1.5 flex-1" />
                      <span className="text-sm font-semibold text-destructive">{district.sentiment}%</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* District Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {selectedDistrict?.name} District
            </DialogTitle>
            <DialogDescription>Sentiment derived from live social data</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">Population</p></div>
              <p className="text-xl font-bold">{selectedDistrict?.population.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-success/10">
              <div className="flex items-center gap-2 mb-2"><ThumbsUp className="w-4 h-4 text-success" /><p className="text-xs text-success/70">Positive</p></div>
              <p className="text-xl font-bold text-success">{selectedDistrict?.sentiment}%</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10">
              <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-primary" /><p className="text-xs text-primary/70">Trust Index</p></div>
              <p className="text-xl font-bold text-primary">{Math.round((selectedDistrict?.sentiment || 0) * 0.85 + 10)}%</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
