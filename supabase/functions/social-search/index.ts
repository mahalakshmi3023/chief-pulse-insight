const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PlatformResult {
  count: number;
  data: Array<{
    id: string;
    text: string;
    author: string;
    created_at: string;
    likes: number;
    shares: number;
    platform: string;
    url?: string;
  }>;
}

const EMPTY: PlatformResult = { count: 0, data: [] };

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 25000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchTwitter(query: string, apiKey: string): Promise<PlatformResult> {
  try {
    const res = await fetchWithTimeout(
      `https://twitter-api45.p.rapidapi.com/search.php?query=${encodeURIComponent(query)}&search_type=Top`,
      { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'twitter-api45.p.rapidapi.com' } }
    );
    const json = await res.json();
    const timeline = json?.timeline || [];
    return {
      count: timeline.length,
      data: timeline.slice(0, 20).map((t: any) => ({
        id: t.tweet_id || t.id || crypto.randomUUID(),
        text: t.text || '',
        author: t.screen_name || t.author?.name || 'Unknown',
        created_at: t.created_at || new Date().toISOString(),
        likes: Number(t.favorites || t.likes || 0),
        shares: Number(t.retweets || 0),
        platform: 'twitter',
        url: t.tweet_id ? `https://x.com/i/status/${t.tweet_id}` : undefined,
      })),
    };
  } catch (e) {
    console.error('Twitter error:', e);
    return EMPTY;
  }
}

async function fetchInstagram(query: string, apiKey: string): Promise<PlatformResult> {
  try {
    const res = await fetchWithTimeout(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/hashtag?hashtag=${encodeURIComponent(query.replace('#', ''))}`,
      { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com' } }
    );
    const json = await res.json();
    const items = json?.data?.medias || json?.data?.items || [];
    return {
      count: items.length,
      data: items.slice(0, 20).map((p: any) => ({
        id: p.id || crypto.randomUUID(),
        text: p.caption?.text || p.text || '',
        author: p.user?.username || p.owner?.username || 'Unknown',
        created_at: p.taken_at ? new Date(p.taken_at * 1000).toISOString() : new Date().toISOString(),
        likes: Number(p.like_count || 0),
        shares: Number(p.comment_count || 0),
        platform: 'instagram',
      })),
    };
  } catch (e) {
    console.error('Instagram error:', e);
    return EMPTY;
  }
}

async function fetchFacebook(query: string, apiKey: string): Promise<PlatformResult> {
  try {
    const res = await fetchWithTimeout(
      `https://facebook-scraper3.p.rapidapi.com/search/posts?query=${encodeURIComponent(query)}&pages=1`,
      { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com' } }
    );
    const json = await res.json();
    const results = json?.results || json?.data || [];
    return {
      count: results.length,
      data: results.slice(0, 20).map((p: any) => ({
        id: p.post_id || crypto.randomUUID(),
        text: p.text || p.message || '',
        author: p.author || p.name || 'Unknown',
        created_at: p.timestamp || new Date().toISOString(),
        likes: Number(p.likes || p.reactions_count || 0),
        shares: Number(p.shares || 0),
        platform: 'facebook',
        url: p.url || undefined,
      })),
    };
  } catch (e) {
    console.error('Facebook error:', e);
    return EMPTY;
  }
}

async function fetchNews(query: string, apiKey: string): Promise<PlatformResult> {
  try {
    const res = await fetchWithTimeout(
      `https://real-time-news-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&country=IN&lang=en&time_published=1d`,
      { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com' } }
    );
    const json = await res.json();
    const articles = json?.data || [];
    return {
      count: articles.length,
      data: articles.slice(0, 20).map((a: any) => ({
        id: crypto.randomUUID(),
        text: a.title || '',
        author: a.source_name || a.source || 'News',
        created_at: a.published_datetime_utc || new Date().toISOString(),
        likes: 0,
        shares: 0,
        platform: 'news',
        url: a.link || undefined,
      })),
    };
  } catch (e) {
    console.error('News error:', e);
    return EMPTY;
  }
}

async function fetchFirecrawl(query: string, apiKey: string): Promise<PlatformResult> {
  try {
    const res = await fetchWithTimeout(
      'https://api.firecrawl.dev/v1/search',
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 10, lang: 'en', country: 'IN' }),
      }
    );
    const json = await res.json();
    const results = json?.data || [];
    return {
      count: results.length,
      data: results.slice(0, 10).map((r: any) => ({
        id: crypto.randomUUID(),
        text: r.title || r.description || '',
        author: r.url ? new URL(r.url).hostname : 'Web',
        created_at: new Date().toISOString(),
        likes: 0,
        shares: 0,
        platform: 'firecrawl',
        url: r.url || undefined,
      })),
    };
  } catch (e) {
    console.error('Firecrawl error:', e);
    return EMPTY;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query = 'Puducherry', limit = 20 } = await req.json();
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY') || '';
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY') || '';

    console.log(`Social search for: "${query}"`);

    const results = await Promise.allSettled([
      fetchTwitter(query, rapidApiKey),
      fetchInstagram(query, rapidApiKey),
      fetchFacebook(query, rapidApiKey),
      fetchNews(query, rapidApiKey),
      firecrawlKey ? fetchFirecrawl(query, firecrawlKey) : Promise.resolve(EMPTY),
    ]);

    const extract = (r: PromiseSettledResult<PlatformResult>) =>
      r.status === 'fulfilled' ? r.value : EMPTY;

    const data = {
      twitter: extract(results[0]),
      instagram: extract(results[1]),
      facebook: extract(results[2]),
      news: extract(results[3]),
      firecrawl: extract(results[4]),
    };

    const total = data.twitter.count + data.instagram.count + data.facebook.count + data.news.count + data.firecrawl.count;
    console.log(`Total results: ${total}`);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Social search error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
