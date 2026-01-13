import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenCommandPalette: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
}

const shortcuts: { category: string; items: Shortcut[] }[] = [
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['G', 'H'], description: 'Go to Home' },
      { keys: ['G', 'T'], description: 'Go to Trends' },
      { keys: ['G', 'S'], description: 'Go to Sentiment' },
      { keys: ['G', 'B'], description: 'Go to Breaking News' },
      { keys: ['G', 'M'], description: 'Go to Misinformation' },
      { keys: ['G', 'I'], description: 'Go to Influencers' },
      { keys: ['G', 'P'], description: 'Go to Policy Impact' },
      { keys: ['G', 'R'], description: 'Go to Reports' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['⌘', 'E'], description: 'Export current view' },
      { keys: ['⌘', 'R'], description: 'Refresh data' },
      { keys: ['⌘', '\\'], description: 'Toggle sidebar' },
      { keys: ['Esc'], description: 'Close dialogs/panels' },
    ],
  },
  {
    category: 'Filters',
    items: [
      { keys: ['F', '1'], description: 'Last 1 hour' },
      { keys: ['F', '6'], description: 'Last 6 hours' },
      { keys: ['F', '2'], description: 'Last 24 hours' },
      { keys: ['F', '7'], description: 'Last 7 days' },
    ],
  },
  {
    category: 'Help',
    items: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
    ],
  },
];

export function KeyboardShortcuts({ open, onOpenChange, onOpenCommandPalette }: KeyboardShortcutsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const isCombo = now - lastKeyTime < 500;

      // Command palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
        return;
      }

      // Help: ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onOpenChange(true);
        return;
      }

      // Escape to close
      if (e.key === 'Escape') {
        onOpenChange(false);
        return;
      }

      // Navigation shortcuts (G + letter)
      if (isCombo && lastKey === 'g') {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            navigate('/');
            break;
          case 't':
            e.preventDefault();
            navigate('/trends');
            break;
          case 's':
            e.preventDefault();
            navigate('/sentiment');
            break;
          case 'b':
            e.preventDefault();
            navigate('/breaking');
            break;
          case 'm':
            e.preventDefault();
            navigate('/misinfo');
            break;
          case 'i':
            e.preventDefault();
            navigate('/influencers');
            break;
          case 'p':
            e.preventDefault();
            navigate('/policy');
            break;
          case 'r':
            e.preventDefault();
            navigate('/reports');
            break;
        }
      }

      lastKey = e.key.toLowerCase();
      lastKeyTime = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onOpenChange, onOpenCommandPalette]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick navigation and actions using your keyboard
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {shortcuts.map((section, idx) => (
            <div key={section.category}>
              {idx > 0 && <Separator className="mb-4 bg-border/50" />}
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {section.category}
              </h4>
              <div className="space-y-2">
                {section.items.map((shortcut, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <kbd
                          key={keyIdx}
                          className="px-2 py-1 text-xs font-medium bg-muted border border-border rounded-md text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
