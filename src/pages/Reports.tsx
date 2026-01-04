import { Panel } from '@/components/dashboard/Panel';
import { StatusBadge } from '@/components/dashboard/Badges';
import { reports } from '@/data/mockData';
import { FileText, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({ title: 'Export queued', description: `Your ${format} will be ready shortly.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Auto-generated summaries and briefings</p>
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
    </div>
  );
}