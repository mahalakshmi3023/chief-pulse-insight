import { useState } from 'react';
import { Panel } from '@/components/dashboard/Panel';
import { SeverityBadge, StatusBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { ShieldAlert, TrendingUp, Link, Users, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Misinformation() {
  const { isLoading, misinformationClaims, fetchedAt } = useSocialData();
  const [selectedClaim, setSelectedClaim] = useState<typeof misinformationClaims[0] | null>(null);
  const { toast } = useToast();

  const handleAssign = () => {
    toast({ title: 'Task assigned', description: 'This claim has been assigned to the Media Cell team.' });
  };

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
            From live social data · {fetchedAt?.toLocaleTimeString()}
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs ml-2">Live</Badge>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ShieldAlert className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">{misinformationClaims.filter(c => c.status === 'active').length} active claims</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Panel title="Active Claims" subtitle="False information detected from live APIs">
            <div className="space-y-4">
              {misinformationClaims.map((claim) => (
                <div key={claim.id} onClick={() => setSelectedClaim(claim)} className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedClaim?.id === claim.id ? 'border-primary bg-muted/50' : 'border-border bg-muted/30 hover:border-muted-foreground/30'}`}>
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
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{claim.spreadVelocity} posts/hr</span>
                    <span>Sources: {claim.sources.join(', ')}</span>
                    <span>Detected: {new Date(claim.firstDetected).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              {misinformationClaims.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No misinformation detected in live data</p>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          {selectedClaim ? (
            <>
              <Panel title="Claim Details" subtitle="Analysis and rebuttal">
                <div className="space-y-4">
                  <div><h4 className="text-xs text-muted-foreground uppercase mb-2">Claim</h4><p className="text-sm text-foreground">{selectedClaim.claim}</p></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Spread Velocity</p><p className="text-lg font-semibold text-foreground">{selectedClaim.spreadVelocity}/hr</p></div>
                    <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={selectedClaim.status} className="mt-1" /></div>
                  </div>
                </div>
              </Panel>
              <Panel title="Rebuttal Points" subtitle="Counter-messaging">
                <ul className="space-y-3">
                  {selectedClaim.rebuttalPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" /><span className="text-sm text-foreground">{point}</span></li>
                  ))}
                </ul>
              </Panel>
              <Button className="w-full gap-2" onClick={handleAssign}><Users className="w-4 h-4" />Assign to Team</Button>
            </>
          ) : (
            <Panel title="Select a Claim" subtitle="Click a claim to see details">
              <div className="h-48 flex items-center justify-center text-muted-foreground"><p className="text-sm">Select a claim from the list</p></div>
            </Panel>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"><p className="text-xs text-muted-foreground uppercase mb-1">Critical</p><p className="text-2xl font-bold text-destructive">{misinformationClaims.filter(c => c.severity === 'critical').length}</p></div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20"><p className="text-xs text-muted-foreground uppercase mb-1">High</p><p className="text-2xl font-bold text-warning">{misinformationClaims.filter(c => c.severity === 'high').length}</p></div>
        <div className="p-4 rounded-xl bg-muted border border-border"><p className="text-xs text-muted-foreground uppercase mb-1">Contained</p><p className="text-2xl font-bold text-muted-foreground">{misinformationClaims.filter(c => c.status === 'contained').length}</p></div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20"><p className="text-xs text-muted-foreground uppercase mb-1">Debunked</p><p className="text-2xl font-bold text-success">{misinformationClaims.filter(c => c.status === 'debunked').length}</p></div>
      </div>
    </div>
  );
}
