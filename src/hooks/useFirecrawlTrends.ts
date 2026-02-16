import { useState, useCallback, useRef } from 'react';
import { firecrawlApi } from '@/lib/api/firecrawl';
import {
  transformSearchToHashtags,
  transformSearchToTopics,
  transformSearchToNews,
  transformSearchToArticles,
  type ScrapedArticle,
} from '@/lib/transformers/trendTransformer';
import type { Hashtag, Topic, BreakingNews } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface FirecrawlTrendsData {
  hashtags: Hashtag[];
  topics: Topic[];
  news: BreakingNews[];
  articles: ScrapedArticle[];
  scrapedAt: Date | null;
}

interface UseFirecrawlTrendsReturn {
  data: FirecrawlTrendsData;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  fetchTrends: () => Promise<void>;
}

const SEARCH_QUERIES = [
  'Puducherry trending news today',
  'Puducherry government schemes development 2024',
  'Puducherry social media trending',
  'Puducherry water tourism infrastructure',
];

export function useFirecrawlTrends(): UseFirecrawlTrendsReturn {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // assume connected until proven otherwise
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FirecrawlTrendsData>({
    hashtags: [],
    topics: [],
    news: [],
    articles: [],
    scrapedAt: null,
  });
  const abortRef = useRef(false);

  const fetchTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    abortRef.current = false;

    try {
      // Fire all queries in parallel
      const results = await Promise.allSettled(
        SEARCH_QUERIES.map(query =>
          firecrawlApi.search(query, {
            limit: 5,
            lang: 'en',
            country: 'in',
            tbs: 'qdr:w', // past week
          })
        )
      );

      if (abortRef.current) return;

      // Collect all successful results
      const allResults: any[] = [];
      let hasError = false;

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled' && result.value.success && result.value.data) {
          allResults.push(...result.value.data);
        } else if (result.status === 'fulfilled' && !result.value.success) {
          const errMsg = result.value.error || '';
          if (errMsg.includes('connector not configured') || errMsg.includes('not configured')) {
            setIsConnected(false);
          }
          hasError = true;
        } else if (result.status === 'rejected') {
          hasError = true;
        }
      });

      if (allResults.length === 0) {
        if (!hasError) {
          setError('No results found. Try again later.');
        } else {
          setError('Failed to fetch live data. Falling back to simulated data.');
        }
        toast({
          title: 'Scraping issue',
          description: 'Could not fetch live data. Using simulated data.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Transform into dashboard data
      const hashtags = transformSearchToHashtags(allResults);
      const topics = transformSearchToTopics(allResults);
      const news = transformSearchToNews(allResults);
      const articles = transformSearchToArticles(allResults);

      setData({
        hashtags,
        topics,
        news,
        articles,
        scrapedAt: new Date(),
      });

      toast({
        title: 'Live data scraped',
        description: `Fetched ${allResults.length} results from the web.`,
      });
    } catch (err) {
      console.error('Firecrawl trends error:', err);
      setError('Failed to connect to scraping service.');
      toast({
        title: 'Error',
        description: 'Failed to scrape live trends data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    data,
    isLoading,
    isConnected,
    error,
    fetchTrends,
  };
}
