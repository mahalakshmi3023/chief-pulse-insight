import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  trendLabel?: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning';
  icon?: React.ReactNode;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  trendLabel,
  variant = 'default',
  icon 
}: KPICardProps) {
  const trendColor = {
    up: 'text-success',
    down: 'text-destructive',
    stable: 'text-muted-foreground'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const variantStyles = {
    default: 'border-kpi-border',
    positive: 'border-success/20 bg-success/5',
    negative: 'border-destructive/20 bg-destructive/5',
    warning: 'border-warning/20 bg-warning/5'
  };

  return (
    <div className={cn(
      "kpi-card fade-in",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-1.5">
          <TrendIcon className={cn("h-3.5 w-3.5", trendColor[trend])} />
          <span className={cn("text-sm font-medium", trendColor[trend])}>
            {trendValue}
          </span>
          {trendLabel && (
            <span className="text-xs text-muted-foreground">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
