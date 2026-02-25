
Objective:
Manually recover your project without using revert by fixing the live-data implementation so the dashboard is stable, truly backend-driven, and free of mock/simulated values.

What I found:
1. The backend function is working and returning data (no function errors found), so this is mainly a frontend data-orchestration problem.
2. The app currently triggers duplicate backend calls for the same query (confirmed by repeated logs at identical timestamps). This happens because multiple components independently call the live-data hook.
3. There are still simulated/fake values in the “live” layer:
   - Randomized metrics and trends in the live hook (`Math.random` in multiple derivations).
   - Mock/sample posts and mock timeline in `HashtagDrawer`.
   - Simulated refresh behavior in `GlobalHeader` (1-second fake delay instead of real backend refresh).
4. Several UI utilities still read from mock datasets (command palette, filter options), which can reintroduce non-live values in the dashboard experience.

Implementation plan (manual recovery path):
1) Create a single shared live-data source for the whole dashboard
- Add a shared data provider (context) so all pages/layout components consume one common live dataset and one common query state.
- Move “search”, “refresh”, “isLoading”, “error”, and derived datasets into this shared source.
- Replace independent hook usage in pages/layout with the shared context consumer.
- Result: one backend fetch per query (instead of duplicate calls), consistent data across all routes/widgets.

2) Remove synthetic/random derivations from the live data engine
- Refactor the live-data hook derivation logic to be deterministic and based on real timestamps/content:
  - Hashtag growth: compute from recent vs previous time windows (not random).
  - Topic trend direction: compute from actual volume delta (not random).
  - Sentiment/emotion series: bucket real posts by time intervals (not random jitter).
  - KPI deltas: derive from observed post distributions (not random percentages).
  - Constituency fallback: deterministic neutral/no-data behavior (no random sentiment/population).
- Keep only true transformations of backend response, no randomization.

3) Remove remaining mock data from dashboard-facing components
- `HashtagDrawer`:
  - Replace `samplePosts` usage with actual live posts filtered by hashtag/topic.
  - Replace mock timeline with timeline built from live post timestamps.
  - Remove/mock-only labels like “Sample Posts”.
- `GlobalHeader`:
  - Replace simulated refresh with actual shared `refresh()` call.
  - Show real last-updated time from shared fetched timestamp.
- `CommandPalette` and filter option sources:
  - Switch dynamic lists to live-derived topics/hashtags/regions where applicable.
  - Keep only static navigation actions as static (non-data items).

4) Align inter-component behavior around one query lifecycle
- Ensure the query typed/searched in Trends updates the shared data source.
- Ensure ticker, reports, and all pages react to the same shared query dataset.
- Ensure loading/error/empty states are consistent app-wide.
- Prevent redundant toasts from duplicate fetches.

5) Harden backend-response handling (without changing product behavior)
- Keep backend fetch strategy parallel and resilient.
- Improve frontend parsing safeguards so partial platform failures show partial results cleanly (without fake fallback values).
- Preserve current API-source-only policy (Twitter, Instagram, Facebook, News, Firecrawl).

6) Validation checklist (end-to-end)
- Open dashboard and confirm one backend request per query cycle.
- Verify each page (Home, Trends, Sentiment, Breaking, Influencers, Misinformation, Policy, Reports) renders live-derived data only.
- Verify Hashtag drawer shows real live posts/timeline, not sample posts.
- Verify refresh button performs real backend refresh.
- Verify query changes propagate consistently across pages/ticker.
- Verify no random jumps in metrics when data hasn’t changed.

Files to update (planned):
- Live data engine:
  - `src/hooks/useSocialSearch.ts`
- New shared provider:
  - `src/contexts/SocialDataContext.tsx` (new)
- App wiring:
  - `src/App.tsx`
- Layout/components using live data:
  - `src/components/layout/BreakingTicker.tsx`
  - `src/components/layout/GlobalHeader.tsx`
  - `src/components/dashboard/HashtagDrawer.tsx`
  - `src/components/CommandPalette.tsx`
  - `src/components/FilterPanel.tsx` (data-option sources only)
- Pages consuming shared live data:
  - `src/pages/CMHome.tsx`
  - `src/pages/Trends.tsx`
  - `src/pages/Sentiment.tsx`
  - `src/pages/BreakingNews.tsx`
  - `src/pages/Influencers.tsx`
  - `src/pages/Misinformation.tsx`
  - `src/pages/PolicyImpact.tsx`
  - `src/pages/Reports.tsx`
- Backend function changes only if needed for minor normalization:
  - `social-search` backend function (optional, minimal).

Risk handling:
- Risk: broad refactor could temporarily break typings across many pages.
  - Mitigation: migrate consumers in one pass, preserving the existing return shape from the live hook/context.
- Risk: removing random fallback may make some panels sparse when API data is low.
  - Mitigation: implement clear “No live data yet” empty states rather than fabricated values.
- Risk: shared query state changes UX expectations.
  - Mitigation: keep default query behavior and current search affordances, only unify data consistency.

Expected outcome:
You get a recovered, stable, real-time dashboard without relying on unavailable revert history: one live data pipeline, no mock/sample injections in dashboard data surfaces, no synthetic random metrics, and consistent backend-driven behavior across all pages.
