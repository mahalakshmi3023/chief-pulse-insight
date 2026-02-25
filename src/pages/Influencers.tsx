import { Panel } from '@/components/dashboard/Panel';
import { DataTable } from '@/components/dashboard/DataTable';
import { AlignmentBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { Users, TrendingUp, MessageSquare, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Influencers() {
  const { isLoading, influencers, fetchedAt, search, query } = useSocialData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading influencer data...</span>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Influencers & Voices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Top voices from live Twitter data · {influencers.length} found
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => search(query)}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <Panel title="Influencer Impact Tracker" subtitle="Top voices from live social data">
        {influencers.length > 0 ? (
          <DataTable
            data={influencers}
            columns={[
              { key: 'name', header: 'Name', render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.handle}</p>
                </div>
              )},
              { key: 'platform', header: 'Platform', render: (item) => <span className="capitalize text-sm">{item.platform}</span> },
              { key: 'followers', header: 'Followers', className: 'hidden md:table-cell', render: (item) => <span>{(item.followers / 1000).toFixed(0)}K</span> },
              { key: 'reach', header: 'Reach', render: (item) => <span className="font-medium">{(item.reach / 1000).toFixed(0)}K</span> },
              { key: 'engagement', header: 'Engagement', className: 'hidden lg:table-cell', render: (item) => <span>{item.engagement}%</span> },
              { key: 'alignment', header: 'Alignment', render: (item) => <AlignmentBadge alignment={item.alignment} /> },
            ]}
          />
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">No influencer data available. Try refreshing.</p>
        )}
      </Panel>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground uppercase">Total Found</span></div>
          <p className="text-2xl font-bold text-foreground">{influencers.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-success" /><span className="text-xs text-muted-foreground uppercase">Pro-Leader</span></div>
          <p className="text-2xl font-bold text-success">{influencers.filter(i => i.alignment === 'pro').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-muted border border-border">
          <div className="flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground uppercase">Neutral</span></div>
          <p className="text-2xl font-bold text-muted-foreground">{influencers.filter(i => i.alignment === 'neutral').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-destructive rotate-180" /><span className="text-xs text-muted-foreground uppercase">Anti-Leader</span></div>
          <p className="text-2xl font-bold text-destructive">{influencers.filter(i => i.alignment === 'anti').length}</p>
        </div>
      </div>
    </div>
  );
}
