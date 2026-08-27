'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DocumentHelpDrawer } from './document-help-drawer';
import {
  FileCheck,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertTriangle,
  XCircle,
  LifeBuoy,
  Cpu,
} from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { institutionName, applicationId, status, complianceScore, documents, stages, aiFindings, complianceItems } = useApp();
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpDoc, setHelpDoc] = useState('');

  const verifiedDocs = documents.filter((d) => d.status === 'verified').length;
  const totalDocs = documents.length;
  const docProgress = Math.round((verifiedDocs / totalDocs) * 100);
  const completedStages = stages.filter((s) => s.status === 'complete').length;
  const actionItems = aiFindings.filter((f) => f.severity === 'high');

  const openHelp = (docName: string, context?: string) => {
    setHelpDoc(docName);
    setHelpOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">{institutionName} — {applicationId}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="secondary">{docProgress}%</Badge>
            </div>
            <p className="text-2xl font-bold">{verifiedDocs}/{totalDocs}</p>
            <p className="text-xs text-muted-foreground mt-1">Documents Verified</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <Badge className="bg-success text-success-foreground">{complianceScore}%</Badge>
            </div>
            <p className="text-2xl font-bold">{complianceScore}%</p>
            <p className="text-xs text-muted-foreground mt-1">Compliance Score</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold">{completedStages}/{stages.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Stages Completed</p>
          </CardContent>
        </Card>

        {/* <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold">{actionItems.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Actions Required</p>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Journey */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Application Journey</CardTitle>
            <CardDescription>Track your application through each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    {stage.status === 'complete' ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : stage.status === 'current' ? (
                      <div className="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center animate-pulse-soft">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground/40" />
                    )}
                    {i < stages.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${stage.status === 'complete' ? 'bg-success' : 'bg-border'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${stage.status === 'pending' ? 'text-muted-foreground' : ''}`}>
                        {stage.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">{stage.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Score</CardTitle>
            <CardDescription>AI-powered analysis</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={complianceScore >= 80 ? 'hsl(var(--success))' : complianceScore >= 60 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(complianceScore / 100) * 327} 327`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{complianceScore}%</span>
                <span className="text-xs text-muted-foreground">Compliant</span>
              </div>
            </div>
            <div className="w-full mt-4 space-y-2">
              {complianceItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.title}</span>
                  {item.status === 'compliant' ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : item.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => onNavigate('compliance')}>
              View Details <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Required */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Action Required
            </CardTitle>
            <CardDescription>Issues that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-destructive/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openHelp(item.document, item.description)}>
                    <LifeBuoy className="w-3.5 h-3.5 mr-1" />
                    Get Help
                  </Button>
                  <Button size="sm" onClick={() => onNavigate('documents')}>
                    <Cpu className="w-3.5 h-3.5 mr-1" />
                    Resolve with AI
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stages.filter((s) => s.status === 'complete').slice().reverse().map((stage) => (
              <div key={stage.id} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span className="font-medium">{stage.title}</span>
                <span className="text-muted-foreground">— {stage.description}</span>
                <span className="text-muted-foreground ml-auto">{stage.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DocumentHelpDrawer
        open={helpOpen}
        onOpenChange={setHelpOpen}
        documentName={helpDoc}
      />
    </div>
  );
}
