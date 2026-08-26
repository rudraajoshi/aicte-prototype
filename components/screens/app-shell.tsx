'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  ScanLine,
  ClipboardCheck,
  GitBranch,
  UserCheck,
  Users,
  LifeBuoy,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

interface AppShellProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  children: React.ReactNode;
}

const INSTITUTION_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'ai-verification', label: 'AI Verification', icon: ScanLine },
  { id: 'compliance', label: 'Compliance', icon: ClipboardCheck },
  { id: 'tracking', label: 'Application Tracking', icon: GitBranch },
  { id: 'evaluator-recommendation', label: 'Evaluator Recommendation', icon: UserCheck },
];

const EVALUATOR_NAV = [
  { id: 'evaluator-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'evaluator-review', label: 'Application Review', icon: ClipboardCheck },
  { id: 'evaluator-support', label: 'Support Requests', icon: LifeBuoy },
];

export default function AppShell({ activeScreen, onNavigate, children }: AppShellProps) {
  const { role, logout, institutionName, applicationId, status } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = role === 'evaluator' ? EVALUATOR_NAV : INSTITUTION_NAV;

  return (
    <div className="min-h-screen flex bg-secondary/20">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-primary text-primary-foreground flex flex-col transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm">AICTE Portal</h1>
              <p className="text-xs text-white/60">{role === 'evaluator' ? 'Evaluator' : 'Institution'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-white/50">{institutionName}</p>
            <p className="text-xs text-white/70 font-medium">{applicationId}</p>
            <Badge className="mt-1 bg-white/15 text-white">{status}</Badge>
          </div>
          <Button
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10 justify-start"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-primary text-primary-foreground sticky top-0 z-20">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            <ChevronLeft className={`w-6 h-6 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} />
          </button>
          <span className="font-semibold text-sm">AICTE Portal</span>
          <button onClick={logout}>
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
