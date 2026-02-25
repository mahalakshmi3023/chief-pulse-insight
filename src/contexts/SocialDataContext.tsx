import React, { createContext, useContext, ReactNode } from 'react';
import { useSocialSearch, SocialSearchData } from '@/hooks/useSocialSearch';
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

interface SocialDataContextType {
  data: SocialSearchData;
  isLoading: boolean;
  error: string | null;
  query: string;
  fetchedAt: Date | null;
  search: (query: string) => Promise<void>;
  allPosts: PostData[];
  hashtags: Hashtag[];
  topics: Topic[];
  breakingNews: BreakingNews[];
  sentimentSeries: SentimentDataPoint[];
  emotionsSeries: EmotionDataPoint[];
  influencers: Influencer[];
  misinformationClaims: MisinformationClaim[];
  schemes: Scheme[];
  reports: Report[];
  mediaChannels: MediaChannel[];
  constituencies: Constituency[];
  kpiData: ReturnType<typeof import('@/hooks/useSocialSearch').useSocialSearch>['kpiData'];
}

const SocialDataContext = createContext<SocialDataContextType | undefined>(undefined);

export function SocialDataProvider({ children }: { children: ReactNode }) {
  const socialData = useSocialSearch(true);

  return (
    <SocialDataContext.Provider value={socialData}>
      {children}
    </SocialDataContext.Provider>
  );
}

export function useSocialData() {
  const context = useContext(SocialDataContext);
  if (context === undefined) {
    throw new Error('useSocialData must be used within a SocialDataProvider');
  }
  return context;
}
