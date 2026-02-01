import { useState, useEffect, useCallback } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { 
  hashtags as baseHashtags, 
  constituencies, 
  topics as baseTopics,
  sentimentSeries as baseSentimentSeries,
  emotionsSeries as baseEmotionsSeries,
  breakingNews as baseBreakingNews,
  kpiData as baseKpiData
} from '@/data/mockData';

// Live data simulation hook for Puducherry Leader Dashboard
export function useLiveData(refreshInterval = 30000) {
  const { filters } = useFilters();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Simulated live data with random variations
  const [liveData, setLiveData] = useState({
    hashtags: baseHashtags,
    constituencies: constituencies,
    topics: baseTopics,
    sentimentSeries: baseSentimentSeries,
    emotionsSeries: baseEmotionsSeries,
    breakingNews: baseBreakingNews,
    kpiData: baseKpiData,
  });

  // Generate random variation within range
  const vary = (value: number, range: number) => {
    const variation = (Math.random() - 0.5) * 2 * range;
    return Math.max(0, Math.round(value + variation));
  };

  // Simulate data update
  const updateData = useCallback(() => {
    setLiveData(prev => ({
      ...prev,
      hashtags: prev.hashtags.map(h => ({
        ...h,
        volume: vary(h.volume, h.volume * 0.05),
        growth: vary(h.growth, 5),
      })),
      constituencies: prev.constituencies.map(c => ({
        ...c,
        sentiment: Math.max(0, Math.min(100, vary(c.sentiment, 3))),
      })),
      topics: prev.topics.map(t => ({
        ...t,
        volume: vary(t.volume, t.volume * 0.03),
      })),
      kpiData: {
        ...prev.kpiData,
        publicSentiment: {
          ...prev.kpiData.publicSentiment,
          positive: Math.max(0, Math.min(100, vary(prev.kpiData.publicSentiment.positive, 2))),
          change: vary(prev.kpiData.publicSentiment.change * 10, 5) / 10,
        },
        oppositionMomentum: {
          ...prev.kpiData.oppositionMomentum,
          score: Math.max(0, Math.min(100, vary(prev.kpiData.oppositionMomentum.score, 2))),
        },
      },
    }));
    setLastUpdate(new Date());
  }, []);

  // Auto-refresh when isLive is true
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(updateData, refreshInterval);
    return () => clearInterval(interval);
  }, [isLive, refreshInterval, updateData]);

  // Filter data based on current filters
  const filteredData = {
    hashtags: liveData.hashtags.filter(h => {
      // Filter by constituency
      if (filters.constituency !== 'all' && filters.district !== 'all') {
        const filterValue = filters.constituency !== 'all' ? filters.constituency : filters.district;
        if (!h.constituencies.includes(filterValue) && !h.districts.includes(filterValue)) {
          return false;
        }
      }
      return true;
    }),
    constituencies: liveData.constituencies.filter(c => {
      if (filters.constituency !== 'all' && c.id !== filters.constituency) {
        return false;
      }
      if (filters.district !== 'all' && c.id !== filters.district) {
        return false;
      }
      return true;
    }),
    topics: liveData.topics.filter(t => {
      if (filters.topic !== 'all' && t.id !== filters.topic) {
        return false;
      }
      return true;
    }),
    breakingNews: liveData.breakingNews.filter(n => {
      if (filters.constituency !== 'all' || filters.district !== 'all') {
        const filterValue = filters.constituency !== 'all' ? filters.constituency : filters.district;
        if (!n.constituencies.includes(filterValue) && !n.districts.includes(filterValue)) {
          return false;
        }
      }
      return true;
    }),
    sentimentSeries: liveData.sentimentSeries,
    emotionsSeries: liveData.emotionsSeries,
    kpiData: liveData.kpiData,
  };

  return {
    data: filteredData,
    rawData: liveData,
    lastUpdate,
    isLive,
    setIsLive,
    refresh: updateData,
    filters,
  };
}

// Hook for filtered hashtags specifically
export function useFilteredHashtags() {
  const { data, lastUpdate, isLive, refresh } = useLiveData();
  return { hashtags: data.hashtags, lastUpdate, isLive, refresh };
}

// Hook for filtered constituencies
export function useFilteredConstituencies() {
  const { data, lastUpdate, isLive, refresh } = useLiveData();
  return { constituencies: data.constituencies, lastUpdate, isLive, refresh };
}
