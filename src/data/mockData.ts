// Puducherry Leader Intelligence Dashboard - Type Definitions
// All data is fetched from live APIs via the social-search edge function.
// This file only exports TypeScript interfaces used across the app.

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
