import { Panel } from '@/components/dashboard/Panel';
import { roles, permissionsMatrix } from '@/data/mockData';
import { Users, Shield, Check, X } from 'lucide-react';

const pages = ['home', 'trends', 'sentiment', 'breaking', 'misinfo', 'influencers', 'policy', 'reports', 'admin'];

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Role management and permissions</p>
      </div>

      <Panel title="Roles" subtitle="User access levels">
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{role.name}</p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Permissions Matrix" subtitle="Page access by role (read-only)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-xs text-muted-foreground">Role</th>
                {pages.map((p) => (<th key={p} className="text-center py-2 px-2 text-xs text-muted-foreground capitalize">{p}</th>))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b border-border/50">
                  <td className="py-2 px-2 font-medium">{role.name}</td>
                  {pages.map((page) => (
                    <td key={page} className="text-center py-2 px-2">
                      {permissionsMatrix[role.id as keyof typeof permissionsMatrix]?.includes(page) 
                        ? <Check className="w-4 h-4 text-success mx-auto" />
                        : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}