import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '@/components/dashboard/Panel';
import { sentimentSeries, emotionsSeries, districts } from '@/data/mockData';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CountUp } from '@/components/AnimatedNumber';
import { Heart, TrendingUp, TrendingDown, MapPin, Users, AlertCircle, ThumbsUp, ThumbsDown, Minus, Smile, Frown, Meh, Zap, Activity, Target, ChevronRight, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Sentiment() {
  const [selectedDistrict, setSelectedDistrict] = useState<typeof districts[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Calculate average sentiment
  const latestSentiment = sentimentSeries[sentimentSeries.length - 1];
  const previousSentiment = sentimentSeries[sentimentSeries.length - 2];
  
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

  // Prepare sentiment timeline data
  const sentimentTimelineData = sentimentSeries.map(d => ({
    time: d.timestamp.split(' ')[1],
    Positive: d.positive,
    Neutral: d.neutral,
    Negative: d.negative,
  }));

  // Prepare emotion data for radar chart
  const latestEmotions = emotionsSeries[emotionsSeries.length - 1];
  const radarData = [
    { emotion: 'Anger', value: latestEmotions.anger, fullMark: 50 },
    { emotion: 'Fear', value: latestEmotions.fear, fullMark: 50 },
    { emotion: 'Hope', value: latestEmotions.hope, fullMark: 50 },
    { emotion: 'Trust', value: latestEmotions.trust, fullMark: 50 },
  ];

  // Prepare emotion timeline data
  const emotionTimelineData = emotionsSeries.map(d => ({
    time: d.timestamp.split(' ')[1],
    Anger: d.anger,
    Fear: d.fear,
    Hope: d.hope,
    Trust: d.trust,
  }));

  // District data sorted by sentiment
  const sortedDistricts = [...districts].sort((a, b) => b.sentiment - a.sentiment);
  const topDistricts = sortedDistricts.slice(0, 5);
  const bottomDistricts = sortedDistricts.slice(-5).reverse();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  const districtVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.03, duration: 0.3 }
    })
  };

  const handleDistrictClick = (district: typeof districts[0]) => {
    setSelectedDistrict(district);
    setDialogOpen(true);
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header with Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Sentiment & Emotion
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Statewide public mood analysis</p>
          </div>
          
          {/* Quick Sentiment Stats */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20"
              whileHover={{ scale: 1.02 }}
            >
              <ThumbsUp className="w-4 h-4 text-success" />
              <div>
                <p className="text-xs text-success/70">Positive</p>
                <p className="text-lg font-bold text-success flex items-center gap-1">
                  <CountUp end={latestSentiment.positive} duration={1.5} suffix="%" />
                  {sentimentChange.positive > 0 && <TrendingUp className="w-3 h-3" />}
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border"
              whileHover={{ scale: 1.02 }}
            >
              <Minus className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Neutral</p>
                <p className="text-lg font-bold text-foreground">
                  <CountUp end={latestSentiment.neutral} duration={1.5} suffix="%" />
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20"
              whileHover={{ scale: 1.02 }}
            >
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

      {/* Top Row: Pie + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Donut with Animation */}
        <motion.div variants={cardVariants}>
          <Panel title="Current Sentiment" subtitle="Overall public mood distribution">
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-foreground">
                  <CountUp end={latestSentiment.positive} duration={1.5} />%
                </p>
                <p className="text-xs text-muted-foreground">Positive</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
              {pieData.map((item) => (
                <motion.div 
                  key={item.name} 
                  className="text-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}%</p>
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>

        {/* Sentiment Timeline with Area Chart */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Panel title="Sentiment Timeline" subtitle="24-hour trend analysis">
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
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    domain={[0, 60]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Positive" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    fill="url(#positiveGradient)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Negative" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    fill="url(#negativeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">Negative</span>
              </div>
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* Emotion Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emotion Radar */}
        <motion.div variants={cardVariants}>
          <Panel title="Emotion Radar" subtitle="Current emotional state">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="emotion" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Radar
                    name="Emotions"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    animationDuration={1000}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Emotion Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
              {radarData.map((item, i) => (
                <motion.button
                  key={item.emotion}
                  className={`p-2 rounded-lg text-left transition-all ${
                    selectedEmotion === item.emotion 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'bg-muted/30 border border-transparent hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedEmotion(selectedEmotion === item.emotion ? null : item.emotion)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-xs text-muted-foreground">{item.emotion}</p>
                  <p className="text-lg font-bold">{item.value}%</p>
                </motion.button>
              ))}
            </div>
          </Panel>
        </motion.div>

        {/* Emotion Timeline */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Panel title="Emotion Timeline" subtitle="Public emotional state over time">
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
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
                    }} 
                  />
                  <Area type="monotone" dataKey="Hope" stroke="hsl(var(--emotion-hope))" strokeWidth={2} fill="url(#hopeGradient)" />
                  <Area type="monotone" dataKey="Trust" stroke="hsl(var(--emotion-trust))" strokeWidth={2} fill="url(#trustGradient)" />
                  <Area type="monotone" dataKey="Fear" stroke="hsl(var(--emotion-fear))" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="Anger" stroke="hsl(var(--emotion-anger))" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emotion-hope" />
                <span className="text-xs text-muted-foreground">Hope</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emotion-trust" />
                <span className="text-xs text-muted-foreground">Trust</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emotion-fear" />
                <span className="text-xs text-muted-foreground">Fear</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emotion-anger" />
                <span className="text-xs text-muted-foreground">Anger</span>
              </div>
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* Interactive District Sentiment Map */}
      <motion.div variants={cardVariants}>
        <Panel 
          title="District Sentiment Heatmap" 
          subtitle="Click any district to see detailed breakdown"
          action={
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          }
        >
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {districts.map((district, index) => {
              const sentiment = district.sentiment;
              const isHovered = hoveredDistrict === district.id;
              const isSelected = selectedDistrict?.id === district.id;
              
              const getBgClass = () => {
                if (sentiment > 50) return 'bg-gradient-to-br from-success/20 to-success/5';
                if (sentiment > 35) return 'bg-gradient-to-br from-warning/20 to-warning/5';
                return 'bg-gradient-to-br from-destructive/20 to-destructive/5';
              };
              
              const getTextClass = () => {
                if (sentiment > 50) return 'text-success';
                if (sentiment > 35) return 'text-warning';
                return 'text-destructive';
              };

              const getIcon = () => {
                if (sentiment > 50) return <Smile className="w-4 h-4 text-success" />;
                if (sentiment > 35) return <Meh className="w-4 h-4 text-warning" />;
                return <Frown className="w-4 h-4 text-destructive" />;
              };
              
              return (
                <motion.button
                  key={district.id}
                  onClick={() => handleDistrictClick(district)}
                  onMouseEnter={() => setHoveredDistrict(district.id)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  className={`
                    relative p-4 rounded-xl ${getBgClass()} transition-all text-left overflow-hidden
                    border ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}
                    hover:shadow-lg hover:shadow-primary/5
                  `}
                  variants={districtVariants}
                  custom={index}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background glow on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground truncate">{district.name}</p>
                      {getIcon()}
                    </div>
                    <p className={`text-2xl font-bold ${getTextClass()}`}>
                      {sentiment}%
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">positive</p>
                    </div>
                    
                    {/* Mini progress bar */}
                    <div className="mt-2 h-1 bg-muted/50 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${
                          sentiment > 50 ? 'bg-success' : sentiment > 35 ? 'bg-warning' : 'bg-destructive'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${sentiment}%` }}
                        transition={{ delay: index * 0.03 + 0.5, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Panel>
      </motion.div>

      {/* Top/Bottom Districts Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing */}
        <motion.div variants={cardVariants}>
          <Panel 
            title="Top Performing Districts" 
            subtitle="Highest positive sentiment"
            action={<ThumbsUp className="w-4 h-4 text-success" />}
          >
            <div className="space-y-3">
              {topDistricts.map((district, index) => (
                <motion.div 
                  key={district.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-success/5 hover:bg-success/10 transition-colors cursor-pointer group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleDistrictClick(district)}
                >
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{district.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={district.sentiment} className="h-1.5 flex-1" />
                      <span className="text-sm font-semibold text-success">{district.sentiment}%</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>

        {/* Bottom Performing */}
        <motion.div variants={cardVariants}>
          <Panel 
            title="Districts Needing Attention" 
            subtitle="Lowest positive sentiment"
            action={<AlertCircle className="w-4 h-4 text-destructive" />}
          >
            <div className="space-y-3">
              {bottomDistricts.map((district, index) => (
                <motion.div 
                  key={district.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleDistrictClick(district)}
                >
                  <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive font-bold text-sm">
                    {districts.length - bottomDistricts.length + index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{district.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={district.sentiment} className="h-1.5 flex-1" />
                      <span className="text-sm font-semibold text-destructive">{district.sentiment}%</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* District Drill-Down Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {selectedDistrict?.name} District
            </DialogTitle>
            <DialogDescription>
              Detailed sentiment and demographic breakdown
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="p-4 rounded-xl bg-muted/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Population</p>
                  </div>
                  <p className="text-xl font-bold">{selectedDistrict?.population.toLocaleString()}</p>
                </motion.div>
                <motion.div 
                  className="p-4 rounded-xl bg-success/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-success" />
                    <p className="text-xs text-success/70">Positive Sentiment</p>
                  </div>
                  <p className="text-xl font-bold text-success">{selectedDistrict?.sentiment}%</p>
                </motion.div>
                <motion.div 
                  className="p-4 rounded-xl bg-primary/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <p className="text-xs text-primary/70">Trust Index</p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {Math.round((selectedDistrict?.sentiment || 0) * 0.85 + 10)}%
                  </p>
                </motion.div>
              </div>
              
              <motion.div 
                className="p-4 rounded-xl bg-muted/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-medium mb-2">Key Insights</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    Top concern: Water supply availability
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                    Positive trend in healthcare satisfaction
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
                    Employment concerns rising
                  </li>
                </ul>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentTimelineData.slice(-6)}>
                    <defs>
                      <linearGradient id="districtGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Positive" stroke="hsl(var(--primary))" fill="url(#districtGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="topics" className="mt-4">
              <div className="space-y-3">
                {['Water Supply', 'Healthcare', 'Employment', 'Education', 'Roads'].map((topic, i) => (
                  <div key={topic} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">{topic}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85 - i * 12} className="w-24 h-1.5" />
                      <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 5000 + 1000)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="demographics" className="mt-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { age: '18-24', positive: 52 },
                    { age: '25-34', positive: 48 },
                    { age: '35-44', positive: 45 },
                    { age: '45-54', positive: 41 },
                    { age: '55+', positive: 38 },
                  ]}>
                    <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="positive" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">Positive sentiment by age group</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
