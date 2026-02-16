import type { Hashtag, Topic, BreakingNews } from '@/data/mockData';
import type { FirecrawlSearchResult } from '@/lib/api/firecrawl';

// Positive and negative word lists for simple sentiment heuristics
const positiveWords = ['good', 'great', 'success', 'benefit', 'improve', 'growth', 'development', 'launch', 'inaugurate', 'award', 'boost', 'progress', 'achieve', 'celebrate', 'new', 'smart', 'excellent', 'positive', 'welfare', 'free', 'scheme', 'tourism'];
const negativeWords = ['crisis', 'fail', 'protest', 'corrupt', 'scam', 'flood', 'shortage', 'death', 'accident', 'oppose', 'strike', 'delay', 'problem', 'issue', 'complaint', 'anger', 'outrage', 'shutdown', 'disruption', 'damage'];

function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  let posCount = 0;
  let negCount = 0;
  positiveWords.forEach(w => { if (lower.includes(w)) posCount++; });
  negativeWords.forEach(w => { if (lower.includes(w)) negCount++; });
  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'web';
  }
}

function detectSeverity(text: string): 'critical' | 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase();
  if (['crisis', 'emergency', 'death', 'flood', 'collapse'].some(w => lower.includes(w))) return 'critical';
  if (['protest', 'strike', 'shutdown', 'alert', 'warning'].some(w => lower.includes(w))) return 'high';
  if (['delay', 'issue', 'problem', 'complaint'].some(w => lower.includes(w))) return 'medium';
  return 'low';
}

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  if (['water', 'road', 'power', 'electricity', 'infrastructure'].some(w => lower.includes(w))) return 'Infrastructure';
  if (['health', 'hospital', 'doctor', 'medical'].some(w => lower.includes(w))) return 'Health';
  if (['school', 'education', 'student', 'college'].some(w => lower.includes(w))) return 'Education';
  if (['job', 'employment', 'economy', 'business'].some(w => lower.includes(w))) return 'Economy';
  if (['tourism', 'beach', 'heritage', 'french'].some(w => lower.includes(w))) return 'Tourism';
  if (['election', 'government', 'policy', 'scheme', 'leader'].some(w => lower.includes(w))) return 'Policy';
  return 'General';
}

// Extract hashtag-like keywords from text
function extractKeywords(text: string): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 4);
  const unique = [...new Set(words.map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 4))];
  return unique.slice(0, 3);
}

export function transformSearchToHashtags(results: FirecrawlSearchResult[]): Hashtag[] {
  return results.slice(0, 8).map((result, idx) => {
    const keywords = extractKeywords(result.title || result.description || '');
    const tag = keywords.length > 0
      ? `#${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)}${keywords[1] ? keywords[1].charAt(0).toUpperCase() + keywords[1].slice(1) : ''}`
      : `#Puducherry${idx + 1}`;

    const sentiment = detectSentiment(`${result.title} ${result.description}`);
    const volume = Math.floor(Math.random() * 40000) + 5000;
    const growth = Math.floor(Math.random() * 200) - 20;

    return {
      id: `fc-h-${idx}`,
      tag,
      volume,
      growth,
      sources: {
        twitter: Math.floor(Math.random() * 40) + 20,
        facebook: Math.floor(Math.random() * 30) + 15,
        instagram: Math.floor(Math.random() * 20) + 5,
        news: Math.floor(Math.random() * 15) + 5,
      },
      sentiment,
      constituencies: ['oza', 'mud', 'raj'].slice(0, Math.floor(Math.random() * 3) + 1),
      districts: ['oza', 'mud', 'raj'].slice(0, Math.floor(Math.random() * 3) + 1),
      _source: result.url,
      _title: result.title,
    } as Hashtag & { _source: string; _title: string };
  });
}

export function transformSearchToTopics(results: FirecrawlSearchResult[]): Topic[] {
  return results.slice(0, 8).map((result, idx) => {
    const title = result.title || `Topic ${idx + 1}`;
    const category = detectCategory(`${title} ${result.description}`);
    const volume = Math.floor(Math.random() * 30000) + 5000;
    const trendOptions: ('rising' | 'falling' | 'stable')[] = ['rising', 'falling', 'stable'];

    return {
      id: `fc-t-${idx}`,
      name: title.length > 40 ? title.substring(0, 40) + '...' : title,
      volume,
      trend: trendOptions[Math.floor(Math.random() * 3)],
      category,
    };
  });
}

export function transformSearchToNews(results: FirecrawlSearchResult[]): BreakingNews[] {
  return results.slice(0, 6).map((result, idx) => {
    const title = result.title || 'Untitled';
    const fullText = `${title} ${result.description || ''}`;

    return {
      id: `fc-n-${idx}`,
      title: title.length > 80 ? title.substring(0, 80) + '...' : title,
      summary: result.description || 'No description available.',
      severity: detectSeverity(fullText),
      source: extractDomain(result.url),
      timestamp: new Date().toISOString(),
      constituencies: ['oza', 'raj'],
      districts: ['oza', 'raj'],
      category: detectCategory(fullText),
    };
  });
}

export interface ScrapedArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
}

export function transformSearchToArticles(results: FirecrawlSearchResult[]): ScrapedArticle[] {
  return results.map((result) => ({
    title: result.title || 'Untitled',
    description: result.description || '',
    url: result.url,
    source: extractDomain(result.url),
    sentiment: detectSentiment(`${result.title} ${result.description}`),
    category: detectCategory(`${result.title} ${result.description}`),
  }));
}
