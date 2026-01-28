// Puducherry Leader Intelligence Dashboard - Mock Data

export interface Constituency {
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
  constituencies: string[];
  districts: string[]; // alias for backward compatibility
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
  constituencies: string[];
  districts: string[]; // alias for backward compatibility
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

// 30 Constituencies of Puducherry Legislative Assembly
export const constituencies: Constituency[] = [
  { id: 'oza', name: 'Ozhukarai', sentiment: 52, population: 82456 },
  { id: 'mud', name: 'Mudaliarpet', sentiment: 48, population: 75234 },
  { id: 'law', name: 'Lawspet', sentiment: 45, population: 68432 },
  { id: 'man', name: 'Mangalam', sentiment: 55, population: 52134 },
  { id: 'raj', name: 'Raj Bhavan', sentiment: 58, population: 48765 },
  { id: 'kas', name: 'Kadirgamam', sentiment: 42, population: 61234 },
  { id: 'ari', name: 'Ariyankuppam', sentiment: 38, population: 54321 },
  { id: 'mav', name: 'Manavely', sentiment: 51, population: 47892 },
  { id: 'net', name: 'Nettapakkam', sentiment: 44, population: 39876 },
  { id: 'thi', name: 'Thirunallar', sentiment: 49, population: 42567 },
  { id: 'kar', name: 'Karaikal North', sentiment: 53, population: 38945 },
  { id: 'krs', name: 'Karaikal South', sentiment: 47, population: 35678 },
  { id: 'yai', name: 'Yanam', sentiment: 56, population: 28934 },
  { id: 'mah', name: 'Mahe', sentiment: 61, population: 24567 },
  { id: 'ind', name: 'Indira Nagar', sentiment: 46, population: 58234 },
  { id: 'tha', name: 'Thattanchavady', sentiment: 39, population: 45678 },
  { id: 'vil', name: 'Villianur', sentiment: 50, population: 52341 },
  { id: 'emb', name: 'Embalam', sentiment: 43, population: 31245 },
  { id: 'bah', name: 'Bahour', sentiment: 54, population: 28976 },
  { id: 'ori', name: 'Orleanpet', sentiment: 48, population: 35421 },
  { id: 'kou', name: 'Kottakuppam', sentiment: 41, population: 29543 },
  { id: 'ned', name: 'Nedungadu', sentiment: 57, population: 27654 },
  { id: 'tir', name: 'Tirumalairayanpattinam', sentiment: 45, population: 32187 },
  { id: 'nag', name: 'Nagore', sentiment: 52, population: 34521 },
  { id: 'upp', name: 'Uppalam', sentiment: 49, population: 41234 },
  { id: 'caz', name: 'Cazanove', sentiment: 55, population: 38765 },
  { id: 'nan', name: 'Nandivaram', sentiment: 47, population: 29876 },
  { id: 'kur', name: 'Kuruvinatham', sentiment: 44, population: 26543 },
  { id: 'per', name: 'Periyaveerampatinam', sentiment: 51, population: 24321 },
  { id: 'kot', name: 'Kottagam', sentiment: 46, population: 22876 },
];

// For backward compatibility, export as districts too
export const districts = constituencies;

export const topics: Topic[] = [
  { id: 't1', name: 'Water Supply', volume: 28450, trend: 'rising', category: 'Infrastructure' },
  { id: 't2', name: 'Employment', volume: 24300, trend: 'stable', category: 'Economy' },
  { id: 't3', name: 'Healthcare Access', volume: 21800, trend: 'rising', category: 'Health' },
  { id: 't4', name: 'Road Infrastructure', volume: 18920, trend: 'falling', category: 'Infrastructure' },
  { id: 't5', name: 'Education Policy', volume: 16540, trend: 'rising', category: 'Education' },
  { id: 't6', name: 'Tourism Development', volume: 14200, trend: 'stable', category: 'Economy' },
  { id: 't7', name: 'Power Supply', volume: 12850, trend: 'falling', category: 'Infrastructure' },
  { id: 't8', name: 'Public Transport', volume: 11200, trend: 'stable', category: 'Transport' },
];

export const sources: Source[] = [
  { id: 's1', name: 'Twitter/X', type: 'social', reliability: 65 },
  { id: 's2', name: 'Facebook', type: 'social', reliability: 60 },
  { id: 's3', name: 'The Hindu', type: 'news', reliability: 92 },
  { id: 's4', name: 'The New Indian Express', type: 'news', reliability: 85 },
  { id: 's5', name: 'DD Pondicherry', type: 'tv', reliability: 80 },
  { id: 's6', name: 'Puduvai News', type: 'tv', reliability: 75 },
  { id: 's7', name: 'Le Petit Journal', type: 'print', reliability: 78 },
  { id: 's8', name: 'Puducherry Herald', type: 'print', reliability: 76 },
];

export const hashtags: Hashtag[] = [
  { id: 'h1', tag: '#PuducherryDevelopment', volume: 45200, growth: 156, sources: { twitter: 42, facebook: 32, instagram: 18, news: 8 }, sentiment: 'positive', constituencies: ['oza', 'mud', 'raj'], districts: ['oza', 'mud', 'raj'] },
  { id: 'h2', tag: '#PondyTourism', volume: 38900, growth: 89, sources: { twitter: 35, facebook: 38, instagram: 22, news: 5 }, sentiment: 'positive', constituencies: ['raj', 'ind', 'vil'], districts: ['raj', 'ind', 'vil'] },
  { id: 'h3', tag: '#PuducherryWater', volume: 32100, growth: 124, sources: { twitter: 48, facebook: 28, instagram: 12, news: 12 }, sentiment: 'negative', constituencies: ['law', 'kas', 'ari'], districts: ['law', 'kas', 'ari'] },
  { id: 'h4', tag: '#LeaderForChange', volume: 28400, growth: 67, sources: { twitter: 38, facebook: 35, instagram: 20, news: 7 }, sentiment: 'positive', constituencies: ['oza', 'man', 'raj'], districts: ['oza', 'man', 'raj'] },
  { id: 'h5', tag: '#PondyHealthcare', volume: 24200, growth: 45, sources: { twitter: 40, facebook: 32, instagram: 18, news: 10 }, sentiment: 'positive', constituencies: ['mud', 'law', 'ind'], districts: ['mud', 'law', 'ind'] },
  { id: 'h6', tag: '#PuducherryRoads', volume: 21800, growth: -8, sources: { twitter: 52, facebook: 25, instagram: 10, news: 13 }, sentiment: 'negative', constituencies: ['thi', 'kar', 'emb'], districts: ['thi', 'kar', 'emb'] },
  { id: 'h7', tag: '#SingaporePuducherry', volume: 18600, growth: 234, sources: { twitter: 30, facebook: 35, instagram: 28, news: 7 }, sentiment: 'positive', constituencies: ['oza', 'raj', 'ind'], districts: ['oza', 'raj', 'ind'] },
  { id: 'h8', tag: '#PondyEducation', volume: 15400, growth: 56, sources: { twitter: 32, facebook: 40, instagram: 18, news: 10 }, sentiment: 'positive', constituencies: ['law', 'vil', 'emb'], districts: ['law', 'vil', 'emb'] },
];

export const sentimentSeries: SentimentDataPoint[] = [
  { timestamp: '2024-01-08 00:00', positive: 44, negative: 26, neutral: 30 },
  { timestamp: '2024-01-08 04:00', positive: 42, negative: 28, neutral: 30 },
  { timestamp: '2024-01-08 08:00', positive: 40, negative: 30, neutral: 30 },
  { timestamp: '2024-01-08 12:00', positive: 47, negative: 23, neutral: 30 },
  { timestamp: '2024-01-08 16:00', positive: 50, negative: 20, neutral: 30 },
  { timestamp: '2024-01-08 20:00', positive: 48, negative: 22, neutral: 30 },
  { timestamp: '2024-01-09 00:00', positive: 46, negative: 24, neutral: 30 },
  { timestamp: '2024-01-09 04:00', positive: 45, negative: 25, neutral: 30 },
  { timestamp: '2024-01-09 08:00', positive: 43, negative: 27, neutral: 30 },
  { timestamp: '2024-01-09 12:00', positive: 49, negative: 21, neutral: 30 },
  { timestamp: '2024-01-09 16:00', positive: 52, negative: 18, neutral: 30 },
  { timestamp: '2024-01-09 20:00', positive: 50, negative: 20, neutral: 30 },
];

export const emotionsSeries: EmotionDataPoint[] = [
  { timestamp: '2024-01-08 00:00', anger: 16, fear: 10, hope: 38, trust: 36 },
  { timestamp: '2024-01-08 04:00', anger: 18, fear: 12, hope: 35, trust: 35 },
  { timestamp: '2024-01-08 08:00', anger: 22, fear: 14, hope: 32, trust: 32 },
  { timestamp: '2024-01-08 12:00', anger: 13, fear: 8, hope: 42, trust: 37 },
  { timestamp: '2024-01-08 16:00', anger: 10, fear: 6, hope: 45, trust: 39 },
  { timestamp: '2024-01-08 20:00', anger: 12, fear: 8, hope: 42, trust: 38 },
  { timestamp: '2024-01-09 00:00', anger: 14, fear: 10, hope: 40, trust: 36 },
  { timestamp: '2024-01-09 04:00', anger: 15, fear: 11, hope: 38, trust: 36 },
  { timestamp: '2024-01-09 08:00', anger: 20, fear: 13, hope: 34, trust: 33 },
  { timestamp: '2024-01-09 12:00', anger: 11, fear: 7, hope: 44, trust: 38 },
  { timestamp: '2024-01-09 16:00', anger: 8, fear: 5, hope: 48, trust: 39 },
  { timestamp: '2024-01-09 20:00', anger: 10, fear: 6, hope: 45, trust: 39 },
];

export const breakingNews: BreakingNews[] = [
  {
    id: 'bn1',
    title: 'Leader announces major tourism development project',
    summary: 'New ₹500 crore tourism development project announced for Puducherry beachfront, expected to create 5000 jobs.',
    severity: 'low',
    source: 'Government',
    timestamp: '2024-01-09T14:30:00',
    constituencies: ['raj', 'ind'],
    districts: ['raj', 'ind'],
    category: 'Development'
  },
  {
    id: 'bn2',
    title: 'Heavy rainfall alert for coastal constituencies',
    summary: 'IMD issues orange alert for Ozhukarai, Ariyankuppam, and Karaikal constituencies. Expected 8-12cm rainfall.',
    severity: 'high',
    source: 'IMD Official',
    timestamp: '2024-01-09T13:15:00',
    constituencies: ['oza', 'ari', 'kar'],
    districts: ['oza', 'ari', 'kar'],
    category: 'Weather'
  },
  {
    id: 'bn3',
    title: 'Water supply disruption in Lawspet area',
    summary: 'PWD announces 12-hour disruption due to pipeline maintenance in Lawspet, Mudaliarpet areas.',
    severity: 'medium',
    source: 'PWD',
    timestamp: '2024-01-09T11:45:00',
    constituencies: ['law', 'mud'],
    districts: ['law', 'mud'],
    category: 'Infrastructure'
  },
  {
    id: 'bn4',
    title: 'Leader to inaugurate new healthcare center',
    summary: 'Leader to inaugurate 200-bed multi-specialty hospital in Villianur tomorrow.',
    severity: 'low',
    source: 'Government',
    timestamp: '2024-01-09T10:00:00',
    constituencies: ['vil'],
    districts: ['vil'],
    category: 'Health'
  },
];

export const misinformationClaims: MisinformationClaim[] = [
  {
    id: 'm1',
    claim: 'Government to impose water ration of 15 liters per household',
    severity: 'high',
    spreadVelocity: 320,
    sources: ['WhatsApp', 'Facebook', 'Twitter'],
    rebuttalPoints: [
      'No such policy announced by PWD',
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
    spreadVelocity: 480,
    sources: ['WhatsApp', 'YouTube', 'Facebook'],
    rebuttalPoints: [
      'Electricity Department confirms scheme continues unchanged',
      'Fake news based on misinterpreted budget document',
      'Leader issued clarification on official handle'
    ],
    status: 'active',
    firstDetected: '2024-01-09T06:15:00'
  },
  {
    id: 'm3',
    claim: 'New toll gates to be set up on all UT roads',
    severity: 'medium',
    spreadVelocity: 180,
    sources: ['Facebook', 'Local News Sites'],
    rebuttalPoints: [
      'Only highway toll revision under consideration',
      'UT roads exempt from any toll collection',
      'Clarification issued by Transport Department'
    ],
    status: 'contained',
    firstDetected: '2024-01-08T14:00:00'
  },
];

export const influencers: Influencer[] = [
  { id: 'i1', name: 'Pondy Political Watch', handle: '@pondypolitics', platform: 'twitter', followers: 185000, reach: 380000, engagement: 7.2, alignment: 'neutral', recentTopics: ['Elections', 'Policy'] },
  { id: 'i2', name: 'Puducherry Updates', handle: '@puducherryupdt', platform: 'twitter', followers: 156000, reach: 320000, engagement: 5.8, alignment: 'neutral', recentTopics: ['News', 'Events'] },
  { id: 'i3', name: 'LJK Support', handle: '@ljksupport', platform: 'twitter', followers: 125000, reach: 280000, engagement: 9.1, alignment: 'pro', recentTopics: ['Leader Initiatives', 'Development'] },
  { id: 'i4', name: 'Pondy Voice', handle: '@pondyvoice', platform: 'youtube', followers: 220000, reach: 450000, engagement: 11.3, alignment: 'neutral', recentTopics: ['Local Issues', 'Analysis'] },
  { id: 'i5', name: 'Karaikal Express', handle: '@karaikalnews', platform: 'twitter', followers: 85000, reach: 180000, engagement: 6.4, alignment: 'neutral', recentTopics: ['Karaikal', 'Fishing'] },
  { id: 'i6', name: 'Pondy Speaks', handle: '@pondyspeaks', platform: 'instagram', followers: 145000, reach: 290000, engagement: 8.7, alignment: 'neutral', recentTopics: ['Local Issues', 'Culture'] },
];

export const mediaChannels: MediaChannel[] = [
  { id: 'mc1', name: 'DD Pondicherry', type: 'tv', sentimentTilt: 15, coverage: 16, topTopics: ['Government Schemes', 'Leader Events', 'Development'] },
  { id: 'mc2', name: 'Puduvai News', type: 'tv', sentimentTilt: 5, coverage: 18, topTopics: ['Politics', 'Economy', 'Social Issues'] },
  { id: 'mc3', name: 'Pondy Express', type: 'tv', sentimentTilt: -10, coverage: 14, topTopics: ['Opposition', 'Criticism', 'Local Issues'] },
  { id: 'mc4', name: 'UT Today', type: 'tv', sentimentTilt: 8, coverage: 12, topTopics: ['General News', 'Tourism', 'Culture'] },
  { id: 'mc5', name: 'The Hindu (Pondy)', type: 'print', sentimentTilt: 0, coverage: 35, topTopics: ['Policy', 'Analysis', 'National'] },
  { id: 'mc6', name: 'Le Petit Journal', type: 'print', sentimentTilt: 5, coverage: 28, topTopics: ['Local', 'French Heritage', 'Culture'] },
  { id: 'mc7', name: 'Puducherry Times', type: 'digital', sentimentTilt: -5, coverage: 42, topTopics: ['Investigation', 'Politics', 'Social'] },
];

export const schemes: Scheme[] = [
  { id: 'sc1', name: 'Singapore Puducherry Vision', impactScore: 85, sentimentBefore: 48, sentimentAfter: 74, announcementDate: '2023-06-15', category: 'Development' },
  { id: 'sc2', name: 'Free Healthcare Initiative', impactScore: 82, sentimentBefore: 45, sentimentAfter: 70, announcementDate: '2023-09-01', category: 'Health' },
  { id: 'sc3', name: 'Youth Employment Scheme', impactScore: 78, sentimentBefore: 50, sentimentAfter: 68, announcementDate: '2023-05-01', category: 'Employment' },
  { id: 'sc4', name: 'Water for All Program', impactScore: 75, sentimentBefore: 42, sentimentAfter: 64, announcementDate: '2023-08-05', category: 'Infrastructure' },
  { id: 'sc5', name: 'Tourism Excellence Plan', impactScore: 72, sentimentBefore: 38, sentimentAfter: 60, announcementDate: '2023-03-01', category: 'Tourism' },
  { id: 'sc6', name: 'Smart Education Program', impactScore: 70, sentimentBefore: 52, sentimentAfter: 66, announcementDate: '2023-06-01', category: 'Education' },
];

export const reports: Report[] = [
  {
    id: 'r1',
    title: 'Daily Leader Summary - January 9, 2024',
    type: 'daily',
    generatedAt: '2024-01-09T06:00:00',
    keyPoints: [
      'Overall sentiment stable at 50% positive (+3% from yesterday)',
      'Water supply remains top concern in Lawspet, Mudaliarpet',
      'Singapore Vision initiative continues to receive positive coverage',
      '2 new misinformation claims detected, 1 critical',
      'Opposition momentum index decreased by 4 points'
    ],
    status: 'ready'
  },
  {
    id: 'r2',
    title: 'Weekly Narrative Shift - Week 2, January 2024',
    type: 'weekly',
    generatedAt: '2024-01-07T06:00:00',
    keyPoints: [
      'Healthcare narrative improved significantly post hospital announcements',
      'Water crisis narrative intensified in western constituencies',
      'Education policy receiving balanced coverage',
      'Employment concerns rising in industrial areas',
      'Overall leadership perception stable with minor positive trend'
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
      'Social media activity spike in affected constituencies',
      'Recommended pre-positioning of relief materials',
      'Media monitoring activated for flood-related content'
    ],
    status: 'generating'
  },
];

// KPI Data
export const kpiData = {
  publicSentiment: {
    positive: 50,
    neutral: 30,
    negative: 20,
    trend: 'up' as const,
    change: 3.1
  },
  oppositionMomentum: {
    score: 32,
    trend: 'down' as const,
    change: -4.2
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
  '#PuducherryDevelopment': [
    { id: 'p1', content: 'Great to see the new infrastructure projects in Ozhukarai! #PuducherryDevelopment', source: 'Twitter', engagement: 312, timestamp: '2024-01-09T12:30:00' },
    { id: 'p2', content: 'Singapore vision for Puducherry is exactly what we need! #PuducherryDevelopment', source: 'Facebook', engagement: 245, timestamp: '2024-01-09T11:15:00' },
    { id: 'p3', content: 'Impressed by the tourism development plans #PuducherryDevelopment', source: 'Twitter', engagement: 189, timestamp: '2024-01-09T10:45:00' },
  ],
  '#PondyTourism': [
    { id: 'p4', content: 'Puducherry is becoming a world-class destination! #PondyTourism', source: 'Instagram', engagement: 445, timestamp: '2024-01-09T09:30:00' },
    { id: 'p5', content: 'New beachfront development will boost local economy #PondyTourism', source: 'Twitter', engagement: 312, timestamp: '2024-01-09T08:45:00' },
  ]
};

// Roles for Admin
export const roles = [
  { id: 'leader', name: 'Leader', description: 'Full access to all dashboards and reports' },
  { id: 'secretary', name: 'Chief Secretary', description: 'Full access with admin capabilities' },
  { id: 'mc', name: 'Media Cell', description: 'Misinformation, trends, and influencer tracking' },
  { id: 'dc', name: 'Constituency Coordinator', description: 'Constituency-specific data and local crisis management' },
  { id: 'an', name: 'Analyst', description: 'Read-only access to trends and sentiment' },
];

// Permissions matrix for Admin
export const permissionsMatrix = {
  leader: ['home', 'trends', 'sentiment', 'breaking', 'misinfo', 'influencers', 'policy', 'reports', 'admin'],
  secretary: ['home', 'trends', 'sentiment', 'breaking', 'misinfo', 'influencers', 'policy', 'reports', 'admin'],
  mc: ['home', 'trends', 'misinfo', 'influencers', 'reports'],
  dc: ['home', 'trends', 'sentiment', 'breaking', 'reports'],
  an: ['home', 'trends', 'sentiment'],
};
