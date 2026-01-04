// TN CM Media Intelligence Dashboard - Mock Data

export interface District {
  id: string;
  name: string;
  sentiment: number; // -100 to 100
  population: number;
}

export interface Topic {
  id: string;
  name: string;
  volume: number;
  trend: 'rising' | 'falling' | 'stable';
  category: string;
}

export interface Source {
  id: string;
  name: string;
  type: 'social' | 'news' | 'tv' | 'print';
  reliability: number;
}

export interface Hashtag {
  id: string;
  tag: string;
  volume: number;
  growth: number; // percentage
  sources: { twitter: number; facebook: number; instagram: number; news: number };
  sentiment: 'positive' | 'negative' | 'neutral';
  districts: string[];
}

export interface SentimentDataPoint {
  timestamp: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface EmotionDataPoint {
  timestamp: string;
  anger: number;
  fear: number;
  hope: number;
  trust: number;
}

export interface BreakingNews {
  id: string;
  title: string;
  summary: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: string;
  districts: string[];
  category: string;
}

export interface MisinformationClaim {
  id: string;
  claim: string;
  severity: 'critical' | 'high' | 'medium';
  spreadVelocity: number; // posts per hour
  sources: string[];
  rebuttalPoints: string[];
  status: 'active' | 'contained' | 'debunked';
  firstDetected: string;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube';
  followers: number;
  reach: number;
  engagement: number;
  alignment: 'neutral' | 'pro' | 'anti';
  recentTopics: string[];
}

export interface MediaChannel {
  id: string;
  name: string;
  type: 'tv' | 'print' | 'digital';
  sentimentTilt: number; // -100 to 100
  coverage: number; // hours or articles
  topTopics: string[];
}

export interface Scheme {
  id: string;
  name: string;
  impactScore: number; // 0-100
  sentimentBefore: number;
  sentimentAfter: number;
  announcementDate: string;
  category: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'crisis';
  generatedAt: string;
  keyPoints: string[];
  status: 'ready' | 'generating';
}

// Districts of Tamil Nadu
export const districts: District[] = [
  { id: 'che', name: 'Chennai', sentiment: 45, population: 4646732 },
  { id: 'coi', name: 'Coimbatore', sentiment: 52, population: 1061447 },
  { id: 'mad', name: 'Madurai', sentiment: 38, population: 1017865 },
  { id: 'tri', name: 'Tiruchirappalli', sentiment: 41, population: 847387 },
  { id: 'sal', name: 'Salem', sentiment: 35, population: 831038 },
  { id: 'tir', name: 'Tirunelveli', sentiment: 48, population: 473637 },
  { id: 'vel', name: 'Vellore', sentiment: 42, population: 185803 },
  { id: 'ero', name: 'Erode', sentiment: 55, population: 157101 },
  { id: 'tha', name: 'Thanjavur', sentiment: 44, population: 222943 },
  { id: 'kan', name: 'Kanchipuram', sentiment: 39, population: 164265 },
  { id: 'nag', name: 'Nagapattinam', sentiment: 31, population: 97936 },
  { id: 'ram', name: 'Ramanathapuram', sentiment: 28, population: 125235 },
  { id: 'kar', name: 'Karur', sentiment: 50, population: 76145 },
  { id: 'din', name: 'Dindigul', sentiment: 46, population: 207327 },
  { id: 'tut', name: 'Thoothukudi', sentiment: 33, population: 237830 },
];

export const topics: Topic[] = [
  { id: 't1', name: 'Water Supply', volume: 45230, trend: 'rising', category: 'Infrastructure' },
  { id: 't2', name: 'Employment', volume: 38900, trend: 'stable', category: 'Economy' },
  { id: 't3', name: 'Healthcare Access', volume: 32100, trend: 'rising', category: 'Health' },
  { id: 't4', name: 'Road Infrastructure', volume: 28450, trend: 'falling', category: 'Infrastructure' },
  { id: 't5', name: 'Education Policy', volume: 25800, trend: 'rising', category: 'Education' },
  { id: 't6', name: 'Agricultural Support', volume: 22100, trend: 'stable', category: 'Agriculture' },
  { id: 't7', name: 'Power Cuts', volume: 19800, trend: 'falling', category: 'Infrastructure' },
  { id: 't8', name: 'Public Transport', volume: 17500, trend: 'stable', category: 'Transport' },
];

export const sources: Source[] = [
  { id: 's1', name: 'Twitter/X', type: 'social', reliability: 65 },
  { id: 's2', name: 'Facebook', type: 'social', reliability: 60 },
  { id: 's3', name: 'The Hindu', type: 'news', reliability: 92 },
  { id: 's4', name: 'Times of India', type: 'news', reliability: 85 },
  { id: 's5', name: 'Sun TV', type: 'tv', reliability: 75 },
  { id: 's6', name: 'Puthiya Thalaimurai', type: 'tv', reliability: 78 },
  { id: 's7', name: 'Dinamalar', type: 'print', reliability: 80 },
  { id: 's8', name: 'Dinakaran', type: 'print', reliability: 78 },
];

export const hashtags: Hashtag[] = [
  { id: 'h1', tag: '#TNWaterCrisis', volume: 125400, growth: 234, sources: { twitter: 45, facebook: 30, instagram: 15, news: 10 }, sentiment: 'negative', districts: ['che', 'mad', 'coi'] },
  { id: 'h2', tag: '#BreakfastScheme', volume: 98200, growth: 156, sources: { twitter: 35, facebook: 40, instagram: 20, news: 5 }, sentiment: 'positive', districts: ['che', 'sal', 'tri'] },
  { id: 'h3', tag: '#TNRoads', volume: 76300, growth: 89, sources: { twitter: 50, facebook: 25, instagram: 10, news: 15 }, sentiment: 'negative', districts: ['mad', 'tri', 'sal'] },
  { id: 'h4', tag: '#CMRelief', volume: 65400, growth: 45, sources: { twitter: 30, facebook: 35, instagram: 25, news: 10 }, sentiment: 'positive', districts: ['che', 'coi'] },
  { id: 'h5', tag: '#FreeHealthcare', volume: 54200, growth: 67, sources: { twitter: 40, facebook: 30, instagram: 20, news: 10 }, sentiment: 'positive', districts: ['che', 'mad', 'tir'] },
  { id: 'h6', tag: '#TNPowerCut', volume: 48900, growth: -12, sources: { twitter: 55, facebook: 25, instagram: 10, news: 10 }, sentiment: 'negative', districts: ['sal', 'ero'] },
  { id: 'h7', tag: '#TamilNaduModel', volume: 42100, growth: 78, sources: { twitter: 35, facebook: 30, instagram: 25, news: 10 }, sentiment: 'positive', districts: ['che', 'coi', 'mad'] },
  { id: 'h8', tag: '#EducationForAll', volume: 38500, growth: 56, sources: { twitter: 30, facebook: 40, instagram: 20, news: 10 }, sentiment: 'positive', districts: ['che', 'tri'] },
];

export const sentimentSeries: SentimentDataPoint[] = [
  { timestamp: '2024-01-08 00:00', positive: 42, negative: 28, neutral: 30 },
  { timestamp: '2024-01-08 04:00', positive: 40, negative: 30, neutral: 30 },
  { timestamp: '2024-01-08 08:00', positive: 38, negative: 32, neutral: 30 },
  { timestamp: '2024-01-08 12:00', positive: 45, negative: 25, neutral: 30 },
  { timestamp: '2024-01-08 16:00', positive: 48, negative: 22, neutral: 30 },
  { timestamp: '2024-01-08 20:00', positive: 46, negative: 24, neutral: 30 },
  { timestamp: '2024-01-09 00:00', positive: 44, negative: 26, neutral: 30 },
  { timestamp: '2024-01-09 04:00', positive: 43, negative: 27, neutral: 30 },
  { timestamp: '2024-01-09 08:00', positive: 41, negative: 29, neutral: 30 },
  { timestamp: '2024-01-09 12:00', positive: 47, negative: 23, neutral: 30 },
  { timestamp: '2024-01-09 16:00', positive: 50, negative: 20, neutral: 30 },
  { timestamp: '2024-01-09 20:00', positive: 48, negative: 22, neutral: 30 },
];

export const emotionsSeries: EmotionDataPoint[] = [
  { timestamp: '2024-01-08 00:00', anger: 18, fear: 12, hope: 35, trust: 35 },
  { timestamp: '2024-01-08 04:00', anger: 20, fear: 14, hope: 33, trust: 33 },
  { timestamp: '2024-01-08 08:00', anger: 25, fear: 15, hope: 30, trust: 30 },
  { timestamp: '2024-01-08 12:00', anger: 15, fear: 10, hope: 40, trust: 35 },
  { timestamp: '2024-01-08 16:00', anger: 12, fear: 8, hope: 42, trust: 38 },
  { timestamp: '2024-01-08 20:00', anger: 14, fear: 10, hope: 40, trust: 36 },
  { timestamp: '2024-01-09 00:00', anger: 16, fear: 11, hope: 38, trust: 35 },
  { timestamp: '2024-01-09 04:00', anger: 17, fear: 12, hope: 36, trust: 35 },
  { timestamp: '2024-01-09 08:00', anger: 22, fear: 14, hope: 32, trust: 32 },
  { timestamp: '2024-01-09 12:00', anger: 13, fear: 9, hope: 42, trust: 36 },
  { timestamp: '2024-01-09 16:00', anger: 10, fear: 7, hope: 45, trust: 38 },
  { timestamp: '2024-01-09 20:00', anger: 12, fear: 8, hope: 43, trust: 37 },
];

export const breakingNews: BreakingNews[] = [
  {
    id: 'bn1',
    title: 'Heavy rainfall alert for coastal districts',
    summary: 'IMD issues orange alert for Chennai, Kanchipuram, and Tiruvallur districts. Expected 10-15cm rainfall in next 24 hours.',
    severity: 'high',
    source: 'IMD Official',
    timestamp: '2024-01-09T14:30:00',
    districts: ['che', 'kan'],
    category: 'Weather'
  },
  {
    id: 'bn2',
    title: 'Opposition announces statewide protest',
    summary: 'AIADMK announces peaceful protest against fuel price hike scheduled for tomorrow across all districts.',
    severity: 'medium',
    source: 'PTI',
    timestamp: '2024-01-09T13:15:00',
    districts: ['che', 'coi', 'mad'],
    category: 'Politics'
  },
  {
    id: 'bn3',
    title: 'Water supply disruption in North Chennai',
    summary: 'Metro Water announces 24-hour disruption due to pipeline maintenance in Kolathur, Villivakkam areas.',
    severity: 'medium',
    source: 'Metro Water',
    timestamp: '2024-01-09T11:45:00',
    districts: ['che'],
    category: 'Infrastructure'
  },
  {
    id: 'bn4',
    title: 'CM to inaugurate new hospital',
    summary: 'Chief Minister to inaugurate 500-bed multi-specialty hospital in Madurai tomorrow.',
    severity: 'low',
    source: 'Government',
    timestamp: '2024-01-09T10:00:00',
    districts: ['mad'],
    category: 'Health'
  },
];

export const misinformationClaims: MisinformationClaim[] = [
  {
    id: 'm1',
    claim: 'Government to impose water ration of 20 liters per household',
    severity: 'high',
    spreadVelocity: 450,
    sources: ['WhatsApp', 'Facebook', 'Twitter'],
    rebuttalPoints: [
      'No such policy announced by Metro Water',
      'Official statement clarifies normal supply continues',
      'Source is an old 2019 proposal that was never implemented'
    ],
    status: 'active',
    firstDetected: '2024-01-09T08:30:00'
  },
  {
    id: 'm2',
    claim: 'Free electricity scheme cancelled for rural areas',
    severity: 'critical',
    spreadVelocity: 680,
    sources: ['WhatsApp', 'YouTube', 'Facebook'],
    rebuttalPoints: [
      'TANGEDCO confirms scheme continues unchanged',
      'Fake news based on misinterpreted budget document',
      'Minister issued clarification on official handle'
    ],
    status: 'active',
    firstDetected: '2024-01-09T06:15:00'
  },
  {
    id: 'm3',
    claim: 'New toll gates to be set up on all city roads',
    severity: 'medium',
    spreadVelocity: 230,
    sources: ['Facebook', 'Local News Sites'],
    rebuttalPoints: [
      'Only highway toll revision under consideration',
      'City roads exempt from any toll collection',
      'Clarification issued by Transport Department'
    ],
    status: 'contained',
    firstDetected: '2024-01-08T14:00:00'
  },
];

export const influencers: Influencer[] = [
  { id: 'i1', name: 'Savukku Shankar', handle: '@savaborty', platform: 'twitter', followers: 2500000, reach: 5200000, engagement: 8.5, alignment: 'anti', recentTopics: ['Corruption', 'Government Spending'] },
  { id: 'i2', name: 'Maridhas', handle: '@Maaborty', platform: 'youtube', followers: 1800000, reach: 3500000, engagement: 12.3, alignment: 'anti', recentTopics: ['Policy Critique', 'Economy'] },
  { id: 'i3', name: 'Pradeep Kumar', handle: '@pk_political', platform: 'twitter', followers: 850000, reach: 1800000, engagement: 6.2, alignment: 'neutral', recentTopics: ['Elections', 'Policy'] },
  { id: 'i4', name: 'TN Updates', handle: '@tnupdates', platform: 'twitter', followers: 1200000, reach: 2400000, engagement: 4.8, alignment: 'neutral', recentTopics: ['News', 'Events'] },
  { id: 'i5', name: 'DMK IT Wing', handle: '@dmikitwing', platform: 'twitter', followers: 950000, reach: 2100000, engagement: 7.1, alignment: 'pro', recentTopics: ['Government Schemes', 'Development'] },
  { id: 'i6', name: 'Chennai Speaks', handle: '@chennaipechu', platform: 'instagram', followers: 650000, reach: 1200000, engagement: 9.4, alignment: 'neutral', recentTopics: ['Local Issues', 'Events'] },
];

export const mediaChannels: MediaChannel[] = [
  { id: 'mc1', name: 'Sun TV', type: 'tv', sentimentTilt: 35, coverage: 18, topTopics: ['Government Schemes', 'CM Events', 'Development'] },
  { id: 'mc2', name: 'Puthiya Thalaimurai', type: 'tv', sentimentTilt: 5, coverage: 20, topTopics: ['Politics', 'Economy', 'Social Issues'] },
  { id: 'mc3', name: 'News7 Tamil', type: 'tv', sentimentTilt: -15, coverage: 16, topTopics: ['Opposition', 'Criticism', 'Local Issues'] },
  { id: 'mc4', name: 'Polimer News', type: 'tv', sentimentTilt: 10, coverage: 14, topTopics: ['General News', 'Entertainment', 'Sports'] },
  { id: 'mc5', name: 'The Hindu', type: 'print', sentimentTilt: 0, coverage: 45, topTopics: ['Policy', 'Analysis', 'National'] },
  { id: 'mc6', name: 'Dinamalar', type: 'print', sentimentTilt: -10, coverage: 52, topTopics: ['Local', 'Politics', 'Agriculture'] },
  { id: 'mc7', name: 'The News Minute', type: 'digital', sentimentTilt: -5, coverage: 38, topTopics: ['Investigation', 'Politics', 'Social'] },
];

export const schemes: Scheme[] = [
  { id: 'sc1', name: 'Breakfast Scheme', impactScore: 87, sentimentBefore: 45, sentimentAfter: 72, announcementDate: '2022-09-15', category: 'Education' },
  { id: 'sc2', name: 'Kalaignar Magalir Urimai Thogai', impactScore: 82, sentimentBefore: 48, sentimentAfter: 68, announcementDate: '2023-09-01', category: 'Welfare' },
  { id: 'sc3', name: 'Free Bus Travel for Women', impactScore: 79, sentimentBefore: 52, sentimentAfter: 71, announcementDate: '2021-05-01', category: 'Transport' },
  { id: 'sc4', name: 'Makkalai Thedi Maruthuvam', impactScore: 75, sentimentBefore: 40, sentimentAfter: 62, announcementDate: '2021-08-05', category: 'Health' },
  { id: 'sc5', name: 'Naan Mudhalvan', impactScore: 71, sentimentBefore: 35, sentimentAfter: 58, announcementDate: '2022-03-01', category: 'Education' },
  { id: 'sc6', name: 'Free Electricity for Farmers', impactScore: 68, sentimentBefore: 55, sentimentAfter: 65, announcementDate: '2021-06-01', category: 'Agriculture' },
];

export const reports: Report[] = [
  {
    id: 'r1',
    title: 'Daily CM Summary - January 9, 2024',
    type: 'daily',
    generatedAt: '2024-01-09T06:00:00',
    keyPoints: [
      'Overall sentiment stable at 48% positive (+2% from yesterday)',
      'Water supply remains top concern in Chennai, Coimbatore',
      'Breakfast Scheme continues to receive positive coverage',
      '2 new misinformation claims detected, 1 critical',
      'Opposition momentum index decreased by 3 points'
    ],
    status: 'ready'
  },
  {
    id: 'r2',
    title: 'Weekly Narrative Shift - Week 2, January 2024',
    type: 'weekly',
    generatedAt: '2024-01-07T06:00:00',
    keyPoints: [
      'Healthcare narrative improved significantly post hospital inaugurations',
      'Water crisis narrative intensified in western districts',
      'Education policy receiving balanced coverage',
      'Employment concerns rising in industrial districts',
      'Overall government perception stable with minor positive trend'
    ],
    status: 'ready'
  },
  {
    id: 'r3',
    title: 'Crisis Report - Rainfall Alert',
    type: 'crisis',
    generatedAt: '2024-01-09T14:45:00',
    keyPoints: [
      'IMD orange alert triggered monitoring protocol',
      'Social media activity spike in affected districts',
      'Recommended pre-positioning of relief materials',
      'Media monitoring activated for flood-related content'
    ],
    status: 'generating'
  },
];

// KPI Data
export const kpiData = {
  publicSentiment: {
    positive: 48,
    neutral: 30,
    negative: 22,
    trend: 'up' as const,
    change: 2.3
  },
  oppositionMomentum: {
    score: 35,
    trend: 'down' as const,
    change: -3.1
  },
  misinformationRisk: {
    level: 'medium' as const,
    activeCount: 3,
    criticalCount: 1
  },
  crisisEscalation: {
    level: 'low' as const,
    watchlistCount: 2,
    activeCount: 0
  }
};

// Last updated timestamp
export const lastUpdated = new Date().toISOString();

// Sample posts for hashtag drill-down
export const samplePosts = {
  '#TNWaterCrisis': [
    { id: 'p1', content: 'No water in Kolathur for 3 days now. When will this end? #TNWaterCrisis', source: 'Twitter', engagement: 234, timestamp: '2024-01-09T12:30:00' },
    { id: 'p2', content: 'Metro Water tankers not arriving on time. Residents struggling #TNWaterCrisis', source: 'Facebook', engagement: 156, timestamp: '2024-01-09T11:15:00' },
    { id: 'p3', content: 'Good to see quick response from authorities in Velachery #TNWaterCrisis resolved for us', source: 'Twitter', engagement: 89, timestamp: '2024-01-09T10:45:00' },
  ],
  '#BreakfastScheme': [
    { id: 'p4', content: 'My child loves the breakfast at school. Thank you TN Government! #BreakfastScheme', source: 'Facebook', engagement: 445, timestamp: '2024-01-09T09:30:00' },
    { id: 'p5', content: 'Great initiative seeing real impact on school attendance #BreakfastScheme', source: 'Twitter', engagement: 312, timestamp: '2024-01-09T08:45:00' },
  ]
};

// Roles for Admin
export const roles = [
  { id: 'cm', name: 'Chief Minister', description: 'Full access to all dashboards and reports' },
  { id: 'cs', name: 'Chief Secretary', description: 'Full access with admin capabilities' },
  { id: 'mc', name: 'Media Cell', description: 'Misinformation, trends, and influencer tracking' },
  { id: 'dc', name: 'District Collector', description: 'District-specific data and local crisis management' },
  { id: 'an', name: 'Analyst', description: 'Read-only access to trends and sentiment' },
];

export const permissionsMatrix = {
  cm: ['home', 'trends', 'sentiment', 'breaking', 'misinfo', 'influencers', 'policy', 'reports', 'admin'],
  cs: ['home', 'trends', 'sentiment', 'breaking', 'misinfo', 'influencers', 'policy', 'reports', 'admin'],
  mc: ['home', 'trends', 'sentiment', 'breaking', 'misinfo', 'influencers'],
  dc: ['home', 'sentiment', 'breaking', 'reports'],
  an: ['home', 'trends', 'sentiment'],
};
