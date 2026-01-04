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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground text-sm">Navigation</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-primary"
                  )} />
                  {!collapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" />
              <span>Last updated: 2 min ago</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
          </div>
        )}
      </div>
    </aside>
  );
}
