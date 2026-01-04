import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { SeverityBadge, StatusBadge } from '@/components/dashboard/Badges';
import { misinformationClaims } from '@/data/mockData';
import { ShieldAlert, TrendingUp, Link, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Misinformation() {
  const [selectedClaim, setSelectedClaim] = useState<typeof misinformationClaims[0] | null>(null);
  const { toast } = useToast();

  const handleAssign = (claimId: string) => {
    toast({
      title: 'Task assigned',
      description: 'This claim has been assigned to the Media Cell team.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Misinformation Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and counter false claims</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ShieldAlert className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">{misinformationClaims.filter(c => c.status === 'active').length} active claims</span>
        </div>
      </div>

      {/* Claims List and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims List */}
        <div className="lg:col-span-2 space-y-4">
          <Panel title="Active Claims" subtitle="False information being monitored">
            <div className="space-y-4">
              {misinformationClaims.map((claim) => (
                <div 
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedClaim?.id === claim.id 
                      ? 'border-primary bg-muted/50' 
                      : 'border-border bg-muted/30 hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SeverityBadge severity={claim.severity} />
                        <StatusBadge status={claim.status} />
                      </div>
                      <p className="text-sm font-medium text-foreground">{claim.claim}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {claim.spreadVelocity} posts/hr
                    </span>
                    <span>Sources: {claim.sources.join(', ')}</span>
                    <span>First detected: {new Date(claim.firstDetected).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedClaim ? (
            <>
              <Panel title="Claim Details" subtitle="Analysis and rebuttal">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-muted-foreground uppercase mb-2">Claim</h4>
                    <p className="text-sm text-foreground">{selectedClaim.claim}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Spread Velocity</p>
                      <p className="text-lg font-semibold text-foreground">{selectedClaim.spreadVelocity}/hr</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <StatusBadge status={selectedClaim.status} className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs text-muted-foreground uppercase mb-2">Top Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClaim.sources.map((source, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Rebuttal Points" subtitle="Suggested counter-messaging">
                <ul className="space-y-3">
                  {selectedClaim.rebuttalPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Evidence Links">
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                    <Link className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-primary">Official Statement Link</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                    <Link className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-primary">Press Release Link</span>
                  </div>
                </div>
              </Panel>

              <Button className="w-full gap-2" onClick={() => handleAssign(selectedClaim.id)}>
                <Users className="w-4 h-4" />
                Assign to Team
              </Button>
            </>
          ) : (
            <Panel title="Select a Claim" subtitle="Click a claim to see details">
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Select a claim from the list to view details</p>
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-muted-foreground uppercase mb-1">Critical Claims</p>
          <p className="text-2xl font-bold text-destructive">
            {misinformationClaims.filter(c => c.severity === 'critical').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <p className="text-xs text-muted-foreground uppercase mb-1">High Severity</p>
          <p className="text-2xl font-bold text-warning">
            {misinformationClaims.filter(c => c.severity === 'high').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted border border-border">
          <p className="text-xs text-muted-foreground uppercase mb-1">Contained</p>
          <p className="text-2xl font-bold text-muted-foreground">
            {misinformationClaims.filter(c => c.status === 'contained').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <p className="text-xs text-muted-foreground uppercase mb-1">Debunked</p>
          <p className="text-2xl font-bold text-success">
            {misinformationClaims.filter(c => c.status === 'debunked').length}
          </p>
        </div>
      </div>
    </div>
  );
}
