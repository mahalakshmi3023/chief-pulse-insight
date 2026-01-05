import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Heart, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: 'CM Home', description: 'Morning Briefing' },
  { path: '/trends', icon: TrendingUp, label: 'Trends', description: 'Hashtags & Issues' },
  { path: '/sentiment', icon: Heart, label: 'Sentiment', description: 'Emotion Analysis' },
  { path: '/breaking', icon: AlertTriangle, label: 'Breaking News', description: 'Crisis Monitor' },
  { path: '/misinfo', icon: ShieldAlert, label: 'Misinformation', description: 'Claim Tracker' },
  { path: '/influencers', icon: Users, label: 'Influencers', description: 'Media Bias' },
  { path: '/policy', icon: BarChart3, label: 'Policy Impact', description: 'Scheme Analysis' },
  { path: '/reports', icon: FileText, label: 'Reports', description: 'Daily & Weekly' },
  { path: '/admin', icon: Settings, label: 'Admin', description: 'Settings & Roles' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          collapsed ? "w-[68px]" : "w-60"
        )}
        style={{
          background: 'linear-gradient(180deg, hsl(240 10% 6%) 0%, hsl(240 10% 4%) 100%)'
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-3 border-b border-sidebar-border shrink-0">
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            collapsed ? "justify-center" : ""
          )}>
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-glow-sm">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success animate-pulse border-2 border-sidebar" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-sm font-bold gradient-text">TN CM</h1>
                <p className="text-[10px] text-muted-foreground">Intelligence</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              const linkContent = (
                <NavLink
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                    isActive 
                      ? "bg-gradient-to-r from-primary/20 to-primary/5 text-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary shadow-glow-sm" />
                  )}
                  
                  <div className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "text-sidebar-foreground group-hover:text-primary group-hover:bg-primary/10"
                  )}>
                    <item.icon className="h-[18px] w-[18px]" />
                  </div>
                  
                  {!collapsed && (
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={cn(
                        "text-sm font-medium truncate transition-colors",
                        isActive ? "text-foreground" : ""
                      )}>{item.label}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{item.description}</span>
                    </div>
                  )}
                </NavLink>
              );
              
              return (
                <li key={item.path}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex flex-col">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </TooltipContent>
                    </Tooltip>
                  ) : linkContent}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border shrink-0">
          {/* Collapse Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "w-full justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
              collapsed ? "px-2" : "px-3"
            )}
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
          
          {/* Status */}
          <div className={cn(
            "mt-3 pt-3 border-t border-sidebar-border",
            collapsed ? "text-center" : ""
          )}>
            {!collapsed && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
                </div>
                <span>Live · Updated 2m ago</span>
              </div>
            )}
            {collapsed && (
              <div className="flex justify-center">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}