import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { SeverityBadge, StatusBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { ShieldAlert, CheckCircle, TrendingUp, Users, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Misinformation() {
  const { isLoading, misinformationClaims, allPosts, fetchedAt, search, query } = useSocialData();
  const [selectedClaim, setSelectedClaim] = useState<typeof misinformationClaims[0] | null>(null);
  const { toast } = useToast();

  const flaggedCount = misinformationClaims.length;
  const cleanCount = allPosts.length - flaggedCount;
  const detectionRate = allPosts.length > 0 ? Math.round((flaggedCount / allPosts.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Scanning live data for misinformation...</span>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Misinformation Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Scanning {allPosts.length} live posts for misinformation signals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" />
            {flaggedCount} flagged
          </span>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => search(query)}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel title="Flagged Posts" subtitle="Posts containing misinformation keywords">
            {misinformationClaims.length > 0 ? (
              <div className="space-y-3">
                {misinformationClaims.map((claim) => (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedClaim?.id === claim.id ? 'border-primary bg-muted/50' : 'border-border bg-muted/30 hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={claim.severity} />
                      <StatusBadge status={claim.status} />
                    </div>
                    <p className="text-sm text-foreground">{claim.claim}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{claim.spreadVelocity} posts/hr</span>
                      <span>Sources: {claim.sources.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <CheckCircle className="w-12 h-12 text-success mb-3" />
                <p className="text-lg font-semibold text-foreground">No misinformation detected</p>
                <p className="text-sm text-muted-foreground">None of the {allPosts.length} live posts contain known misinformation indicators.</p>
              </div>
            )}
          </Panel>
        </div>

        <div>
          <Panel title="Analysis" subtitle={selectedClaim ? 'Claim details' : 'Select a post'}>
            {selectedClaim ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase mb-2">Claim</h4>
                  <p className="text-sm text-foreground">{selectedClaim.claim}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Velocity</p>
                    <p className="text-lg font-semibold">{selectedClaim.spreadVelocity}/hr</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selectedClaim.status} className="mt-1" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase mb-2">Rebuttal Points</h4>
                  <ul className="space-y-2">
                    {selectedClaim.rebuttalPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-success shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button size="sm" className="w-full gap-2" onClick={() => toast({ title: 'Assigned to Media Cell' })}>
                  <Users className="w-4 h-4" />
                  Assign to Team
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">Select a flagged post to see analysis</p>
            )}
          </Panel>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Posts Scanned</p>
          <p className="text-2xl font-bold text-foreground">{allPosts.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Flagged</p>
          <p className="text-2xl font-bold text-warning">{flaggedCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Clean</p>
          <p className="text-2xl font-bold text-success">{cleanCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Detection Rate</p>
          <p className="text-2xl font-bold text-destructive">{detectionRate}%</p>
        </div>
      </div>
    </div>
  );
}
