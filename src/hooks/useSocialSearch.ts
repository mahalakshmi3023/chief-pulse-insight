import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Hashtag, Topic, BreakingNews, MisinformationClaim, Influencer, Scheme, Report, SentimentDataPoint, EmotionDataPoint, Constituency, MediaChannel } from '@/data/mockData';

interface PostData {
  id: string;
  text: string;
  author: string;
  created_at: string;
  likes: number;
  shares: number;
  platform: string;
  url?: string;
}

interface PlatformData {
  count: number;
  data: PostData[];
}

export interface SocialSearchData {
  twitter: PlatformData;
  instagram: PlatformData;
  facebook: PlatformData;
  news: PlatformData;
  firecrawl: PlatformData;
}

const EMPTY_DATA: SocialSearchData = {
  twitter: { count: 0, data: [] },
  instagram: { count: 0, data: [] },
  facebook: { count: 0, data: [] },
  news: { count: 0, data: [] },
  firecrawl: { count: 0, data: [] },
};

function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const positiveWords = ['good', 'great', 'success', 'benefit', 'improve', 'growth', 'development', 'launch', 'award', 'boost', 'progress', 'celebrate', 'inaugurate', 'new', 'happy', 'excellent', 'wonderful', 'proud', 'achieve', 'win'];
  const negativeWords = ['bad', 'fail', 'crisis', 'protest', 'scam', 'corruption', 'delay', 'poor', 'shortage', 'flood', 'damage', 'death', 'accident', 'anger', 'worst', 'terrible', 'fraud', 'fake', 'oppose'];
  const pos = positiveWords.filter(w => lower.includes(w)).length;
  const neg = negativeWords.filter(w => lower.includes(w)).length;
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

export function useSocialSearch(autoFetch = true) {
  const [data, setData] = useState<SocialSearchData>(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('Puducherry');
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const { toast } = useToast();

  const search = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('social-search', {
        body: { query: searchQuery, limit: 20 },
      });

      if (fnError) throw new Error(fnError.message);
      if (!result?.success) throw new Error(result?.error || 'Unknown error');

      const responseData: SocialSearchData = {
        ...EMPTY_DATA,
        ...result.data,
      };

      setData(responseData);
      setFetchedAt(new Date());

      const total = responseData.twitter.count + responseData.instagram.count +
                    responseData.facebook.count + responseData.news.count +
                    responseData.firecrawl.count;

      toast({
        title: 'Live data fetched',
        description: `${total} results across ${responseData.firecrawl.count > 0 ? 5 : 4} platforms`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch social data';
      setError(msg);
      toast({
        title: 'Data fetch failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (autoFetch && !fetchedAt) {
      search('Puducherry');
    }
  }, [autoFetch, fetchedAt, search]);

  // ---- Derived data models ----

  const allPosts = useMemo(() => [
    ...data.twitter.data,
    ...data.instagram.data,
    ...data.facebook.data,
    ...data.news.data,
    ...data.firecrawl.data,
  ], [data]);

  const deriveHashtags = useCallback((): Hashtag[] => {
    const tagMap: Record<string, { volume: number; growth: number; tw: number; fb: number; ig: number; news: number; sentiment: 'positive' | 'negative' | 'neutral' }> = {};
    for (const post of allPosts) {
      const tags = post.text.match(/#\w+/g) || [];
      for (const tag of tags) {
        const normalized = tag.toLowerCase();
        if (!tagMap[normalized]) {
          tagMap[normalized] = { volume: 0, growth: 0, tw: 0, fb: 0, ig: 0, news: 0, sentiment: 'neutral' };
        }
        const entry = tagMap[normalized];
        entry.volume += Math.max(1, post.likes + post.shares);
        // Deterministic growth: based on engagement relative to average
        const avgEngagement = allPosts.reduce((s, p) => s + p.likes + p.shares, 0) / (allPosts.length || 1);
        entry.growth += ((post.likes + post.shares) - avgEngagement) / (avgEngagement || 1) * 10;
        if (post.platform === 'twitter') entry.tw++;
        else if (post.platform === 'facebook') entry.fb++;
        else if (post.platform === 'instagram') entry.ig++;
        else entry.news++;
        entry.sentiment = detectSentiment(post.text);
      }
    }
    return Object.entries(tagMap)
      .sort((a, b) => b[1].volume - a[1].volume)
      .slice(0, 15)
      .map(([tag, d], i) => {
        const total = d.tw + d.fb + d.ig + d.news || 1;
        return {
          id: `h${i}`,
          tag,
          volume: d.volume,
          growth: Math.round(d.growth),
          sources: {
            twitter: Math.round((d.tw / total) * 100),
            facebook: Math.round((d.fb / total) * 100),
            instagram: Math.round((d.ig / total) * 100),
            news: Math.round((d.news / total) * 100),
          },
          sentiment: d.sentiment,
          constituencies: [],
          districts: [],
        };
      });
  }, [allPosts]);

  const deriveTopics = useCallback((): Topic[] => {
    const topicMap: Record<string, { volume: number; category: string }> = {};
    const keywords: Record<string, string> = {
      'water': 'Infrastructure', 'employment': 'Economy', 'healthcare': 'Health', 'health': 'Health',
      'road': 'Infrastructure', 'education': 'Education', 'tourism': 'Economy', 'power': 'Infrastructure',
      'transport': 'Transport', 'development': 'Development', 'election': 'Politics', 'flood': 'Disaster',
      'pollution': 'Environment', 'housing': 'Infrastructure', 'agriculture': 'Economy',
    };
    for (const post of allPosts) {
      const lower = post.text.toLowerCase();
      for (const [kw, cat] of Object.entries(keywords)) {
        if (lower.includes(kw)) {
          const name = kw.charAt(0).toUpperCase() + kw.slice(1);
          if (!topicMap[name]) topicMap[name] = { volume: 0, category: cat };
          topicMap[name].volume += Math.max(1, post.likes + post.shares);
        }
      }
    }
    return Object.entries(topicMap)
      .sort((a, b) => b[1].volume - a[1].volume)
      .slice(0, 8)
      .map(([name, d], i) => ({
        id: `t${i}`,
        name,
        volume: d.volume,
        trend: (d.volume > 500 ? 'rising' : d.volume > 100 ? 'stable' : 'falling') as Topic['trend'],
        category: d.category,
      }));
  }, [allPosts]);

  const deriveBreakingNews = useCallback((): BreakingNews[] => {
    return data.news.data.slice(0, 6).map((n, i) => ({
      id: `bn${i}`,
      title: n.text,
      summary: n.text,
      severity: (i === 0 ? 'critical' : i < 3 ? 'high' : 'medium') as BreakingNews['severity'],
      source: n.author,
      timestamp: n.created_at,
      constituencies: [],
      districts: [],
      category: 'News',
    }));
  }, [data.news.data]);

  const deriveSentimentSeries = useCallback((): SentimentDataPoint[] => {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    let pos = 0, neg = 0, neu = 0;
    for (const post of allPosts) {
      const s = detectSentiment(post.text);
      if (s === 'positive') pos++;
      else if (s === 'negative') neg++;
      else neu++;
    }
    const total = pos + neg + neu || 1;
    const pP = Math.round((pos / total) * 100);
    const nP = Math.round((neg / total) * 100);
    const uP = 100 - pP - nP;
    return hours.map((h, i) => {
      // Deterministic variation based on hour index
      const offset = (i - hours.length / 2) * 2;
      return {
        timestamp: `${new Date().toISOString().split('T')[0]} ${h}`,
        positive: Math.max(5, pP + Math.round(offset * 0.5)),
        negative: Math.max(5, nP - Math.round(offset * 0.3)),
        neutral: Math.max(5, uP + Math.round(offset * 0.2)),
      };
    });
  }, [allPosts]);

  const deriveEmotionSeries = useCallback((): EmotionDataPoint[] => {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    let anger = 0, fear = 0, hope = 0, trust = 0;
    for (const post of allPosts) {
      const lower = post.text.toLowerCase();
      if (/anger|angry|furious|outrage/.test(lower)) anger++;
      if (/fear|afraid|worry|threat|danger/.test(lower)) fear++;
      if (/hope|optimis|bright|future|progress/.test(lower)) hope++;
      if (/trust|reliable|faith|confident/.test(lower)) trust++;
    }
    const total = anger + fear + hope + trust || 1;
    return hours.map((h, i) => {
      const offset = (i - hours.length / 2) * 2;
      return {
        timestamp: `${new Date().toISOString().split('T')[0]} ${h}`,
        anger: Math.max(5, Math.round((anger / total) * 100) + Math.round(offset * 0.4)),
        fear: Math.max(5, Math.round((fear / total) * 100) - Math.round(offset * 0.3)),
        hope: Math.max(10, Math.round((hope / total) * 100) + Math.round(offset * 0.5)),
        trust: Math.max(10, Math.round((trust / total) * 100) + Math.round(offset * 0.3)),
      };
    });
  }, [allPosts]);

  const deriveInfluencers = useCallback((): Influencer[] => {
    const authorMap: Record<string, { posts: number; likes: number; shares: number; platform: string; topics: string[] }> = {};
    for (const post of allPosts) {
      if (!authorMap[post.author]) {
        authorMap[post.author] = { posts: 0, likes: 0, shares: 0, platform: post.platform, topics: [] };
      }
      const a = authorMap[post.author];
      a.posts++;
      a.likes += post.likes;
      a.shares += post.shares;
      const tags = post.text.match(/#\w+/g) || [];
      a.topics.push(...tags.slice(0, 2));
    }
    return Object.entries(authorMap)
      .sort((a, b) => (b[1].likes + b[1].shares) - (a[1].likes + a[1].shares))
      .slice(0, 10)
      .map(([name, d], i) => ({
        id: `i${i}`,
        name,
        handle: `@${name.replace(/\s/g, '').toLowerCase()}`,
        platform: (d.platform === 'twitter' ? 'twitter' : d.platform === 'instagram' ? 'instagram' : d.platform === 'facebook' ? 'facebook' : 'youtube') as Influencer['platform'],
        followers: d.likes * 10 + d.shares * 20,
        reach: d.likes * 20 + d.shares * 50,
        engagement: d.posts > 0 ? Math.round(((d.likes + d.shares) / d.posts) * 10) / 10 : 0,
        alignment: 'neutral' as const,
        recentTopics: [...new Set(d.topics)].slice(0, 3),
      }));
  }, [allPosts]);

  const deriveMisinformation = useCallback((): MisinformationClaim[] => {
    const suspicious = allPosts.filter(p => {
      const lower = p.text.toLowerCase();
      return /fake|false|hoax|scam|fraud|rumou?r|mislead|manipulat/.test(lower);
    });
    return suspicious.slice(0, 5).map((p, i) => ({
      id: `m${i}`,
      claim: p.text.slice(0, 200),
      severity: (i === 0 ? 'critical' : i < 2 ? 'high' : 'medium') as MisinformationClaim['severity'],
      spreadVelocity: Math.round(p.likes / 10 + p.shares * 2),
      sources: [p.platform],
      rebuttalPoints: ['Verification pending', 'Cross-referencing with official sources', 'Monitoring spread velocity'],
      status: 'active' as const,
      firstDetected: p.created_at,
    }));
  }, [allPosts]);

  const deriveSchemes = useCallback((): Scheme[] => {
    const schemeKeywords = ['scheme', 'initiative', 'program', 'project', 'plan', 'mission', 'policy', 'welfare'];
    const schemePosts = allPosts.filter(p => schemeKeywords.some(k => p.text.toLowerCase().includes(k)));
    if (schemePosts.length === 0) return [];
    return schemePosts.slice(0, 6).map((p, i) => {
      const sentiment = detectSentiment(p.text);
      const before = 40 + (i * 3);
      const after = sentiment === 'positive' ? before + 20 : before + 5;
      return {
        id: `sc${i}`,
        name: p.text.slice(0, 60),
        impactScore: Math.min(95, 60 + (p.likes % 30)),
        sentimentBefore: before,
        sentimentAfter: after,
        announcementDate: p.created_at,
        category: 'Policy',
      };
    });
  }, [allPosts]);

  const deriveReports = useCallback((): Report[] => {
    const total = allPosts.length;
    const pos = allPosts.filter(p => detectSentiment(p.text) === 'positive').length;
    const posPercent = total > 0 ? Math.round((pos / total) * 100) : 50;
    
    return [
      {
        id: 'r1',
        title: `Daily Intelligence Summary - ${new Date().toLocaleDateString()}`,
        type: 'daily' as const,
        generatedAt: new Date().toISOString(),
        keyPoints: [
          `Overall sentiment at ${posPercent}% positive across ${total} analyzed posts`,
          `Twitter contributed ${data.twitter.count} posts, Instagram ${data.instagram.count}`,
          `Facebook yielded ${data.facebook.count} results, News ${data.news.count} articles`,
          `Firecrawl web intelligence: ${data.firecrawl.count} sources`,
          `Top platform by volume: ${data.twitter.count >= data.facebook.count ? 'Twitter' : 'Facebook'}`,
        ],
        status: 'ready' as const,
      },
      {
        id: 'r2',
        title: `Weekly Narrative Analysis`,
        type: 'weekly' as const,
        generatedAt: new Date().toISOString(),
        keyPoints: [
          `${total} total social mentions analyzed this period`,
          `Key themes emerging from live data feeds`,
          `Sentiment trending ${posPercent > 50 ? 'positively' : 'negatively'} overall`,
          `Cross-platform analysis complete`,
        ],
        status: 'ready' as const,
      },
    ];
  }, [allPosts, data]);

  const deriveMediaChannels = useCallback((): MediaChannel[] => {
    return [
      { id: 'mc1', name: 'Twitter/X', type: 'digital' as const, sentimentTilt: 0, coverage: data.twitter.count, topTopics: [] },
      { id: 'mc2', name: 'Instagram', type: 'digital' as const, sentimentTilt: 0, coverage: data.instagram.count, topTopics: [] },
      { id: 'mc3', name: 'Facebook', type: 'digital' as const, sentimentTilt: 0, coverage: data.facebook.count, topTopics: [] },
      { id: 'mc4', name: 'News Sources', type: 'digital' as const, sentimentTilt: 0, coverage: data.news.count, topTopics: [] },
      { id: 'mc5', name: 'Web (Firecrawl)', type: 'digital' as const, sentimentTilt: 0, coverage: data.firecrawl.count, topTopics: [] },
    ].map(ch => {
      const platformPosts = allPosts.filter(p => {
        if (ch.name.includes('Twitter')) return p.platform === 'twitter';
        if (ch.name.includes('Instagram')) return p.platform === 'instagram';
        if (ch.name.includes('Facebook')) return p.platform === 'facebook';
        if (ch.name.includes('News')) return p.platform === 'news';
        return p.platform === 'firecrawl';
      });
      let posCount = 0, negCount = 0;
      const topicSet = new Set<string>();
      for (const p of platformPosts) {
        const s = detectSentiment(p.text);
        if (s === 'positive') posCount++;
        if (s === 'negative') negCount++;
        const tags = p.text.match(/#\w+/g) || [];
        tags.forEach(t => topicSet.add(t));
      }
      const total = platformPosts.length || 1;
      return {
        ...ch,
        sentimentTilt: Math.round(((posCount - negCount) / total) * 100),
        topTopics: [...topicSet].slice(0, 3),
      };
    });
  }, [allPosts, data]);

  const deriveConstituencies = useCallback((): Constituency[] => {
    // Static list since constituency data comes from geography, not API
    const names = [
      'Ozhukarai', 'Mudaliarpet', 'Lawspet', 'Mangalam', 'Raj Bhavan',
      'Kadirgamam', 'Ariyankuppam', 'Manavely', 'Nettapakkam', 'Thirunallar',
      'Karaikal North', 'Karaikal South', 'Yanam', 'Mahe', 'Indira Nagar',
      'Thattanchavady', 'Villianur', 'Embalam', 'Bahour', 'Orleanpet',
      'Kottakuppam', 'Nedungadu', 'Tirumalairayanpattinam', 'Nagore', 'Uppalam',
      'Cazanove', 'Nandivaram', 'Kuruvinatham', 'Periyaveerampatinam', 'Kottagam',
    ];
    // Derive sentiment from posts mentioning constituency names
    return names.map((name, i) => {
      const mentions = allPosts.filter(p => p.text.toLowerCase().includes(name.toLowerCase()));
      let sentiment = 50;
      if (mentions.length > 0) {
        const pos = mentions.filter(p => detectSentiment(p.text) === 'positive').length;
        sentiment = Math.round((pos / mentions.length) * 100);
      } else {
        // Deterministic neutral fallback when no mentions
        sentiment = 50;
      }
      return {
        id: `c${i}`,
        name,
        sentiment,
        population: 30000 + (i * 2000),
      };
    });
  }, [allPosts]);

  const deriveKpiData = useCallback(() => {
    const total = allPosts.length || 1;
    const pos = allPosts.filter(p => detectSentiment(p.text) === 'positive').length;
    const neg = allPosts.filter(p => detectSentiment(p.text) === 'negative').length;
    const misinfo = allPosts.filter(p => /fake|false|hoax|scam|fraud/.test(p.text.toLowerCase())).length;

    return {
      publicSentiment: {
        positive: Math.round((pos / total) * 100),
        neutral: Math.round(((total - pos - neg) / total) * 100),
        negative: Math.round((neg / total) * 100),
        trend: pos > neg ? 'up' as const : 'down' as const,
        change: Math.round(((pos - neg) / total) * 10 * 10) / 10,
      },
      oppositionMomentum: {
        score: Math.min(100, Math.round((neg / total) * 150)),
        trend: neg < total * 0.3 ? 'down' as const : 'up' as const,
        change: -Math.round(((neg - pos) / total) * 50) / 10,
      },
      misinformationRisk: {
        level: misinfo > 3 ? 'high' as const : misinfo > 0 ? 'medium' as const : 'low' as const,
        activeCount: misinfo,
        criticalCount: Math.min(misinfo, 1),
      },
      crisisEscalation: {
        level: neg > total * 0.4 ? 'high' as const : neg > total * 0.2 ? 'medium' as const : 'low' as const,
        watchlistCount: Math.min(5, Math.round(neg / 3)),
        activeCount: neg > total * 0.4 ? 1 : 0,
      },
    };
  }, [allPosts]);

  return {
    data,
    isLoading,
    error,
    query,
    fetchedAt,
    search,
    allPosts,
    // Derived
    hashtags: deriveHashtags(),
    topics: deriveTopics(),
    breakingNews: deriveBreakingNews(),
    sentimentSeries: deriveSentimentSeries(),
    emotionsSeries: deriveEmotionSeries(),
    influencers: deriveInfluencers(),
    misinformationClaims: deriveMisinformation(),
    schemes: deriveSchemes(),
    reports: deriveReports(),
    mediaChannels: deriveMediaChannels(),
    constituencies: deriveConstituencies(),
    kpiData: deriveKpiData(),
  };
}
