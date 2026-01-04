import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const styles = {
    critical: 'bg-destructive text-destructive-foreground',
    high: 'bg-warning text-warning-foreground',
    medium: 'bg-muted text-muted-foreground',
    low: 'bg-secondary text-secondary-foreground'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
      styles[severity],
      className
    )}>
      {severity}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'contained' | 'debunked' | 'ready' | 'generating';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    active: 'bg-destructive/10 text-destructive border-destructive/20',
    contained: 'bg-warning/10 text-warning border-warning/20',
    debunked: 'bg-success/10 text-success border-success/20',
    ready: 'bg-success/10 text-success border-success/20',
    generating: 'bg-muted text-muted-foreground border-border animate-pulse-subtle'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
      styles[status],
      className
    )}>
      {status}
    </span>
  );
}

interface AlignmentBadgeProps {
  alignment: 'neutral' | 'pro' | 'anti';
  className?: string;
}

export function AlignmentBadge({ alignment, className }: AlignmentBadgeProps) {
  const styles = {
    neutral: 'bg-muted text-muted-foreground',
    pro: 'bg-success/10 text-success',
    anti: 'bg-destructive/10 text-destructive'
  };

  const labels = {
    neutral: 'Neutral',
    pro: 'Pro-Govt',
    anti: 'Anti-Govt'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      styles[alignment],
      className
    )}>
      {labels[alignment]}
    </span>
  );
}

interface TrendBadgeProps {
  trend: 'rising' | 'falling' | 'stable';
  value?: string;
  className?: string;
}

export function TrendBadge({ trend, value, className }: TrendBadgeProps) {
  const styles = {
    rising: 'text-success',
    falling: 'text-destructive',
    stable: 'text-muted-foreground'
  };

  const icons = {
    rising: '↑',
    falling: '↓',
    stable: '→'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-xs font-medium",
      styles[trend],
      className
    )}>
      <span>{icons[trend]}</span>
      {value && <span>{value}</span>}
    </span>
  );
}
