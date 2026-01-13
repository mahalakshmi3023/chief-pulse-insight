import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, AlertTriangle, TrendingUp, Shield, Check, X, 
  Clock, ChevronRight, CheckCheck, Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'update' | 'report';
  title: string;
  message: string;
  time: string;
  read: boolean;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Critical Misinformation Detected',
    message: 'New viral claim about electricity subsidy spreading rapidly.',
    time: '2 min ago',
    read: false,
    severity: 'critical',
  },
  {
    id: '2',
    type: 'alert',
    title: 'Sentiment Spike Alert',
    message: 'Negative sentiment surge in Chennai district (+45%).',
    time: '15 min ago',
    read: false,
    severity: 'high',
  },
  {
    id: '3',
    type: 'update',
    title: 'New Trending Hashtag',
    message: '#CMRelief is now trending with 50K+ mentions.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '4',
    type: 'report',
    title: 'Daily Summary Ready',
    message: 'Your morning briefing report has been generated.',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'update',
    title: 'Influencer Activity',
    message: 'High-reach account posted about water crisis.',
    time: '3 hours ago',
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string, severity?: string) => {
    if (type === 'alert') {
      return (
        <div className={`p-2 rounded-lg ${
          severity === 'critical' ? 'bg-destructive/20' :
          severity === 'high' ? 'bg-warning/20' :
          'bg-muted'
        }`}>
          <AlertTriangle className={`w-4 h-4 ${
            severity === 'critical' ? 'text-destructive' :
            severity === 'high' ? 'text-warning' :
            'text-muted-foreground'
          }`} />
        </div>
      );
    }
    if (type === 'update') {
      return (
        <div className="p-2 rounded-lg bg-primary/20">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
      );
    }
    return (
      <div className="p-2 rounded-lg bg-success/20">
        <Shield className="w-4 h-4 text-success" />
      </div>
    );
  };

  const filterByType = (type: string) => {
    if (type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-muted/50"
        >
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-destructive-foreground"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-96 p-0 border-border/50 bg-card/95 backdrop-blur-xl"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={markAllAsRead}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
            <TabsTrigger 
              value="all" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="alert"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Alerts
            </TabsTrigger>
            <TabsTrigger 
              value="update"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Updates
            </TabsTrigger>
            <TabsTrigger 
              value="report"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          {['all', 'alert', 'update', 'report'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="m-0">
              <ScrollArea className="h-[340px]">
                <div className="p-2 space-y-1">
                  <AnimatePresence mode="popLayout">
                    {filterByType(tabValue).map((notification, idx) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`relative group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                          notification.read 
                            ? 'hover:bg-muted/30' 
                            : 'bg-primary/5 hover:bg-primary/10'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        {getIcon(notification.type, notification.severity)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${
                              notification.read ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                            >
                              <X className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary ml-auto" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filterByType(tabValue).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Bell className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <Button variant="outline" className="w-full text-sm" size="sm">
            View All Notifications
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
