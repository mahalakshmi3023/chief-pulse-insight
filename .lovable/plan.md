

# Integrate Firecrawl for Real-Time Trends Data

## Overview

This plan connects the Trends page to **real web data** by using the **Firecrawl connector** to scrape live news, social media trends, and public discussions about Puducherry. The scraped data will replace the static mock data with actual content from news sites and social platforms.

## Prerequisites (Setup Steps)

Before any code changes, two services need to be enabled:

1. **Enable Lovable Cloud** -- required to run edge functions that call Firecrawl securely
2. **Connect Firecrawl** -- link the Firecrawl connector so its API key is available to edge functions

## Architecture

```text
+------------------+       +----------------------+       +----------------+
|  Trends Page     | ----> | Supabase Edge         | ----> | Firecrawl API  |
|  (React)         |       | Functions             |       | (Web Scraping) |
|                  | <---- | firecrawl-search      | <---- |                |
|                  |       | firecrawl-scrape       |       |                |
+------------------+       +----------------------+       +----------------+
        |
        v
  useLiveData hook
  (merges scraped data
   with simulated data)
```

## What Gets Scraped

The Firecrawl **search** endpoint will query for Puducherry-related topics and return real results:

- **Query 1**: `"Puducherry trending news today"` -- for breaking/trending topics
- **Query 2**: `"Puducherry government schemes development"` -- for policy-related trends
- **Query 3**: `"Puducherry social media hashtags"` -- for hashtag discovery
- **Query 4**: Specific topic searches based on current issue clusters (water, tourism, etc.)

Results are parsed into the existing data models (Hashtag, Topic, BreakingNews) so the UI works without changes.

## Implementation Steps

### Step 1: Enable Lovable Cloud + Firecrawl Connector
- Enable Cloud backend on the project
- Connect the Firecrawl connector via project settings

### Step 2: Create Edge Function -- `firecrawl-search`
- New file: `supabase/functions/firecrawl-search/index.ts`
- Accepts a `query` and optional `options` (limit, lang, country, time filter)
- Calls Firecrawl Search API (`POST https://api.firecrawl.dev/v1/search`)
- Returns search results with titles, descriptions, and optionally scraped markdown

### Step 3: Create Edge Function -- `firecrawl-scrape`
- New file: `supabase/functions/firecrawl-scrape/index.ts`
- Accepts a `url` and optional scrape options
- Returns markdown content, metadata, and links from the target page

### Step 4: Create API Client Library
- New file: `src/lib/api/firecrawl.ts`
- Wrapper functions: `firecrawlApi.search(query, options)` and `firecrawlApi.scrape(url, options)`
- Calls edge functions via the Supabase client

### Step 5: Create Data Transformer
- New file: `src/lib/transformers/trendTransformer.ts`
- `transformSearchToHashtags(results)` -- converts search results into `Hashtag[]` format
- `transformSearchToTopics(results)` -- converts search results into `Topic[]` format
- `transformSearchToNews(results)` -- converts into `BreakingNews[]` format
- Uses keyword extraction, sentiment heuristics (positive/negative word lists), and URL domain mapping for source attribution

### Step 6: Create `useFirecrawlTrends` Hook
- New file: `src/hooks/useFirecrawlTrends.ts`
- Manages scraping state (loading, error, data)
- On mount, fires 3-4 parallel search queries for Puducherry topics
- Transforms results into dashboard-compatible data structures
- Caches results in state to avoid repeated API calls
- Provides a `refetch()` function for manual refresh
- Auto-refreshes every 5 minutes when live mode is on

### Step 7: Update `useLiveData` Hook
- Modify `src/hooks/useLiveData.ts` to accept optional scraped data
- When Firecrawl data is available, merge it with simulated data (scraped data takes priority)
- When Firecrawl is unavailable (no API key), fall back to existing mock data gracefully

### Step 8: Update Trends Page
- Modify `src/pages/Trends.tsx`
- Add a "Scrape Live Data" button that triggers a fresh Firecrawl search
- Show a loading skeleton while scraping is in progress
- Display a "Data Source" indicator (Live Scraped vs Simulated)
- Add a new **"Live News Feed"** section showing raw scraped articles with links
- Show scrape timestamp and source URLs for transparency

### Step 9: Add Supabase Client Integration
- New file: `src/integrations/supabase/client.ts`
- Initialize Supabase client for edge function invocation

## New UI Elements on Trends Page

1. **Data Source Badge** -- shows "Live Web Data" (green) or "Simulated" (amber) next to the Live toggle
2. **Scrape Button** -- manual "Fetch Latest" button with loading spinner
3. **Live News Cards** -- new panel showing actual scraped article titles, summaries, and source links
4. **Source Attribution** -- each hashtag/topic shows where the data was scraped from

## Fallback Strategy

- If Firecrawl is not connected or API calls fail, the dashboard continues working with the existing simulated mock data
- Error states are handled gracefully with toast notifications
- A banner suggests connecting Firecrawl when running on mock data

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `supabase/functions/firecrawl-search/index.ts` | Edge function for web search |
| `supabase/functions/firecrawl-scrape/index.ts` | Edge function for page scraping |
| `src/lib/api/firecrawl.ts` | Frontend API client |
| `src/lib/transformers/trendTransformer.ts` | Data format conversion |
| `src/hooks/useFirecrawlTrends.ts` | React hook for scraping state |
| `src/integrations/supabase/client.ts` | Supabase client setup |

### Files to Modify
| File | Changes |
|------|---------|
| `src/hooks/useLiveData.ts` | Accept and merge scraped data |
| `src/pages/Trends.tsx` | Add scrape controls and live news feed |

