'use client';

import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  UserCheck,
  FileCheck,
  ClipboardCheck,
  Send,
  Building2,
} from 'lucide-react';

interface TrackingScreenProps {
  onNavigate: (screen: string) => void;
}

const STAGE_ICONS = [Building2, FileCheck, ClipboardCheck, UserCheck, Send, CheckCircle2];

export default function TrackingScreen({ onNavigate }: TrackingScreenProps) {
  const { stages, assignedEvaluatorId, evaluators, status, evaluatorReview } = useApp();
  const assignedEvaluator = evaluators.find((e) => e.id === assignedEvaluatorId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Application Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your application through every stage of the approval process</p>
      </div>

      {/* Status banner */}
      <Card className={`${assignedEvaluatorId ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {assignedEvaluatorId ? (
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-success" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">Current Status: {status}</h3>
                <p className="text-sm text-muted-foreground">
                  {assignedEvaluatorId
                    ? `Evaluator ${assignedEvaluator?.name} has been assigned to your application`
                    : 'Waiting for evaluator assignment'}
                </p>
              </div>
            </div>
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Application Timeline</CardTitle>
            <CardDescription>Stage-by-stage progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {stages.map((stage, i) => {
                const Icon = STAGE_ICONS[i] || Circle;
                return (
                  <div key={stage.id} className="flex items-start gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        stage.status === 'complete' ? 'bg-success text-success-foreground' :
                        stage.status === 'current' ? 'bg-accent text-accent-foreground animate-pulse-soft' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {i < stages.length - 1 && (
                        <div className={`w-0.5 h-12 mt-1 ${stage.status === 'complete' ? 'bg-success' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${stage.status === 'pending' ? 'text-muted-foreground' : ''}`}>
                          {stage.title}
                        </h3>
                        <Badge variant={stage.status === 'complete' ? 'default' : stage.status === 'current' ? 'secondary' : 'outline'}>
                          {stage.status === 'complete' ? 'Complete' : stage.status === 'current' ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stage.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stage Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stage Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Completed', count: stages.filter((s) => s.status === 'complete').length, color: 'text-success' },
                { label: 'In Progress', count: stages.filter((s) => s.status === 'current').length, color: 'text-accent' },
                { label: 'Pending', count: stages.filter((s) => s.status === 'pending').length, color: 'text-muted-foreground' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`text-lg font-bold ${s.color}`}>{s.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {assignedEvaluator && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assigned Evaluator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{assignedEvaluator.name}</h4>
                    <p className="text-xs text-muted-foreground">{assignedEvaluator.expertise}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {evaluatorReview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluator Decision</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`mb-3 ${
                  evaluatorReview.decision === 'Approved' ? 'bg-success text-success-foreground' :
                  evaluatorReview.decision === 'Rejected' ? 'bg-destructive text-destructive-foreground' :
                  'bg-warning text-warning-foreground'
                }`}>
                  {evaluatorReview.decision}
                </Badge>
                <p className="text-xs text-muted-foreground">{evaluatorReview.comments}</p>
              </CardContent>
            </Card>
          )}

          {!assignedEvaluatorId && (
            <Button className="w-full" onClick={() => onNavigate('evaluator-recommendation')}>
              Assign Evaluator <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
