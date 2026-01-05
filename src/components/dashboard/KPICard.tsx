import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  trendLabel?: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning';
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  trendLabel,
  variant = 'default',
  icon,
  className
}: KPICardProps) {
  const trendColor = {
    up: 'text-success',
    down: 'text-destructive',
    stable: 'text-muted-foreground'
  };

  const trendBgColor = {
    up: 'bg-success/10',
    down: 'bg-destructive/10',
    stable: 'bg-muted/50'
  };

  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  const variantStyles = {
    default: 'border-border/50',
    positive: 'border-success/30',
    negative: 'border-destructive/30',
    warning: 'border-warning/30'
  };

  const iconBgStyles = {
    default: 'bg-primary/10 text-primary',
    positive: 'bg-success/10 text-success',
    negative: 'bg-destructive/10 text-destructive',
    warning: 'bg-warning/10 text-warning'
  };

  const glowStyles = {
    default: '',
    positive: 'hover:shadow-glow-success',
    negative: 'hover:shadow-glow-danger',
    warning: 'hover:shadow-glow-warning'
  };

  return (
    <div className={cn(
      "kpi-card group cursor-pointer",
      variantStyles[variant],
      glowStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className={cn(
            "p-2 rounded-lg transition-transform group-hover:scale-110",
            iconBgStyles[variant]
          )}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trendBgColor[trend],
            trendColor[trend]
          )}>
            <TrendIcon className="h-3 w-3" />
            <span>{trendValue}</span>
          </div>
          {trendLabel && (
            <span className="text-xs text-muted-foreground">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}