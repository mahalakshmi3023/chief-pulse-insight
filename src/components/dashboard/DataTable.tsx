import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    className?: string;
    render?: (item: T) => React.ReactNode;
  }[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({ data, columns, onRowClick, className }: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-3 first:pl-0 last:pr-0",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "transition-colors",
                onRowClick && "cursor-pointer hover:bg-muted/50"
              )}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    "py-3 px-3 first:pl-0 last:pr-0 text-sm",
                    col.className
                  )}
                >
                  {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
