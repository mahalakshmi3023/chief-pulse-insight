import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanelProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  gradient?: boolean;
}

export function Panel({ title, subtitle, action, children, className, headerClassName, gradient }: PanelProps) {
  return (
    <div className={cn(
      "panel fade-in relative overflow-hidden",
      gradient && "gradient-border",
      className
    )}>
      {/* Subtle background glow */}
      {gradient && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      )}
      
      <div className={cn("flex items-start justify-between mb-4 relative z-10", headerClassName)}>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}