import { Panel } from '@/components/dashboard/Panel';
import { StatusBadge } from '@/components/dashboard/Badges';
import { useSocialData } from '@/contexts/SocialDataContext';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Reports() {
  const { isLoading, reports, fetchedAt } = useSocialData();
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({ title: 'Export queued', description: `Your ${format} will be ready shortly.` });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Generating reports from live data...</span>
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Auto-generated from live API data · {fetchedAt?.toLocaleTimeString()}
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs ml-2">Live</Badge>
        </p>
      </div>

      {reports.map((report) => (
        <Panel key={report.id} title={report.title} subtitle={`Generated ${new Date(report.generatedAt).toLocaleString()}`} action={<StatusBadge status={report.status} />}>
          <ul className="space-y-2 mb-4">
            {report.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground">{point}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="w-4 h-4 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('DOC')}><Download className="w-4 h-4 mr-1" />DOC</Button>
          </div>
        </Panel>
      ))}
      {reports.length === 0 && <p className="text-sm text-muted-foreground">No reports generated yet</p>}
    </div>
  );
}
