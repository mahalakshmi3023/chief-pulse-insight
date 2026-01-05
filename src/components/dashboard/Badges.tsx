import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendBadgeProps {
  trend: 'rising' | 'falling' | 'stable';
  value?: string;
  className?: string;
}

export function TrendBadge({ trend, value, className }: TrendBadgeProps) {
  const config = {
    rising: { 
      icon: TrendingUp, 
      bg: 'bg-success/10', 
      text: 'text-success',
      border: 'border-success/30'
    },
    falling: { 
      icon: TrendingDown, 
      bg: 'bg-destructive/10', 
      text: 'text-destructive',
      border: 'border-destructive/30'
    },
    stable: { 
      icon: Minus, 
      bg: 'bg-muted', 
      text: 'text-muted-foreground',
      border: 'border-border'
    }
  };

  const { icon: Icon, bg, text, border } = config[trend];

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
      bg, text, border,
      className
    )}>
      <Icon className="h-3 w-3" />
      {value && <span>{value}</span>}
    </span>
  );
}

interface AlignmentBadgeProps {
  alignment: 'pro' | 'anti' | 'neutral';
  className?: string;
}

export function AlignmentBadge({ alignment, className }: AlignmentBadgeProps) {
  const config = {
    pro: { 
      bg: 'bg-success/10', 
      text: 'text-success', 
      border: 'border-success/30',
      label: 'Pro-Govt' 
    },
    anti: { 
      bg: 'bg-destructive/10', 
      text: 'text-destructive', 
      border: 'border-destructive/30',
      label: 'Anti-Govt' 
    },
    neutral: { 
      bg: 'bg-muted', 
      text: 'text-muted-foreground', 
      border: 'border-border',
      label: 'Neutral' 
    }
  };

  const { bg, text, border, label } = config[alignment];

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
      bg, text, border,
      className
    )}>
      {label}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = {
    low: { 
      bg: 'bg-success/10', 
      text: 'text-success', 
      border: 'border-success/30',
      label: 'Low' 
    },
    medium: { 
      bg: 'bg-warning/10', 
      text: 'text-warning', 
      border: 'border-warning/30',
      label: 'Medium' 
    },
    high: { 
      bg: 'bg-destructive/10', 
      text: 'text-destructive', 
      border: 'border-destructive/30',
      label: 'High' 
    },
    critical: { 
      bg: 'bg-destructive/20', 
      text: 'text-destructive', 
      border: 'border-destructive/50',
      label: 'Critical',
      glow: true
    }
  };

  const { bg, text, border, label, glow } = config[severity] as any;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase border",
      bg, text, border,
      glow && "shadow-glow-danger animate-pulse-subtle",
      className
    )}>
      {label}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'contained' | 'debunked' | 'ready' | 'generating';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    active: 'bg-destructive/10 text-destructive border-destructive/30',
    contained: 'bg-warning/10 text-warning border-warning/30',
    debunked: 'bg-success/10 text-success border-success/30',
    ready: 'bg-success/10 text-success border-success/30',
    generating: 'bg-muted text-muted-foreground border-border animate-pulse-subtle'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
      styles[status],
      className
    )}>
      {status}
    </span>
  );
}