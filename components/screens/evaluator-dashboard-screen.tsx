'use client';

import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileCheck,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LifeBuoy,
} from 'lucide-react';

interface EvaluatorDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export default function EvaluatorDashboardScreen({ onNavigate }: EvaluatorDashboardScreenProps) {
  const { institutionName, applicationId, status, complianceScore, documents, complianceItems, supportRequests, evaluatorReview } = useApp();

  const verifiedDocs = documents.filter((d) => d.status === 'verified').length;
  const openRequests = supportRequests.filter((s) => s.status === 'open').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Evaluator Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Review applications assigned to you</p>
      </div>

      {/* Application overview */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{institutionName}</h2>
              <p className="text-sm text-muted-foreground">{applicationId}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{status}</Badge>
              {evaluatorReview && (
                <Badge className={
                  evaluatorReview.decision === 'Approved' ? 'bg-success text-success-foreground' :
                  evaluatorReview.decision === 'Rejected' ? 'bg-destructive text-destructive-foreground' :
                  'bg-warning text-warning-foreground'
                }>
                  {evaluatorReview.decision}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{verifiedDocs}/{documents.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Documents Verified</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold">{complianceScore}%</p>
            <p className="text-xs text-muted-foreground mt-1">Compliance Score</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold">{complianceItems.filter((c) => c.status !== 'compliant').length}</p>
            <p className="text-xs text-muted-foreground mt-1">Compliance Issues</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold">{openRequests}</p>
            <p className="text-xs text-muted-foreground mt-1">Open Support Requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Summary</CardTitle>
          <CardDescription>AI-generated compliance analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {complianceItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                {item.status === 'compliant' ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : item.status === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-warning" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <div>
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Badge className={
                item.status === 'compliant' ? 'bg-success text-success-foreground' :
                item.status === 'warning' ? 'bg-warning text-warning-foreground' :
                'bg-destructive text-destructive-foreground'
              }>
                {item.score}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Support requests */}
      {supportRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support Requests</CardTitle>
            <CardDescription>Requests from the institution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {supportRequests.slice(0, 3).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <h4 className="text-sm font-medium">{req.document_name}</h4>
                  <p className="text-xs text-muted-foreground">{req.issue_type}: {req.description}</p>
                </div>
                <Badge variant={req.status === 'open' ? 'destructive' : 'secondary'}>
                  {req.status}
                </Badge>
              </div>
            ))}
            {supportRequests.length > 3 && (
              <button
                onClick={() => onNavigate('evaluator-support')}
                className="text-sm text-accent hover:underline"
              >
                View all {supportRequests.length} requests
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Review action */}
      {!evaluatorReview && (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Application Review Pending</h3>
              <p className="text-sm text-muted-foreground mt-1">Submit your review decision for this application</p>
            </div>
            <button
              onClick={() => onNavigate('evaluator-review')}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start Review
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
