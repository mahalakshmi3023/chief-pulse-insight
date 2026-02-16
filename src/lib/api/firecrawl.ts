import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};

type SearchOptions = {
  limit?: number;
  lang?: string;
  country?: string;
  tbs?: string; // 'qdr:h' (hour), 'qdr:d' (day), 'qdr:w' (week), 'qdr:m' (month)
  scrapeOptions?: { formats?: ('markdown' | 'html')[] };
};

type ScrapeOptions = {
  formats?: ('markdown' | 'html' | 'links' | 'screenshot')[];
  onlyMainContent?: boolean;
  waitFor?: number;
};

export interface FirecrawlSearchResult {
  url: string;
  title: string;
  description: string;
  markdown?: string;
}

export const firecrawlApi = {
  async search(query: string, options?: SearchOptions): Promise<FirecrawlResponse<FirecrawlSearchResult[]>> {
    const { data, error } = await supabase.functions.invoke('firecrawl-search', {
      body: { query, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async scrape(url: string, options?: ScrapeOptions): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
      body: { url, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};
