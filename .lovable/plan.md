
# Fix: Firecrawl Scraping Gets Stuck in Loading State

## Problem Found

After clicking "Fetch Live Data", the UI gets permanently stuck showing "Scraping..." with a loading skeleton. The root cause: one of the 4 parallel Firecrawl API search requests hangs indefinitely without completing or erroring.

The edge function logs confirm that 4 searches were initiated but only 3 returned "Search successful". The 4th request to the Firecrawl API never resolved, which means `Promise.allSettled` in the hook never completes, leaving `isLoading` stuck at `true`.

## Fix Details

### 1. Add timeout to the edge function fetch call (`supabase/functions/firecrawl-search/index.ts`)

Add `AbortController` with a 25-second timeout on the `fetch` call to the Firecrawl API. If Firecrawl takes longer than 25s, the request is aborted and returns an error response instead of hanging forever.

### 2. Add timeout wrapper in the hook (`src/hooks/useFirecrawlTrends.ts`)

Wrap each `firecrawlApi.search()` call with a `Promise.race` against a 30-second timeout. This provides a second safety net -- even if the edge function somehow hangs, the frontend will stop waiting and proceed with whatever results it has.

### 3. Process partial results gracefully

Currently the hook already handles partial results (it collects from all fulfilled promises). No changes needed there -- once the timeout causes the hanging request to reject, `Promise.allSettled` will complete and the 3 successful results will display normally.

## Files to Modify

| File | Change |
|------|--------|
| `supabase/functions/firecrawl-search/index.ts` | Add `AbortController` with 25s timeout on the Firecrawl API fetch |
| `src/hooks/useFirecrawlTrends.ts` | Wrap each search call with a 30s `Promise.race` timeout |

## Expected Result

- "Fetch Live Data" completes within 30 seconds maximum
- Successfully scraped articles appear in the "Live News Feed" panel
- Data source badge switches from "Simulated" to "Live Web Data"
- If some queries fail/timeout, partial results still display correctly
