'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  UserCheck,
  Star,
  Award,
  Briefcase,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface EvaluatorRecommendationScreenProps {
  onNavigate: (screen: string) => void;
}

export default function EvaluatorRecommendationScreen({ onNavigate }: EvaluatorRecommendationScreenProps) {
  const { evaluators, assignEvaluator, assignedEvaluatorId } = useApp();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState<string | null>(null);

  const handleAssign = () => {
    if (selectedEvaluator) {
      assignEvaluator(selectedEvaluator);
      const evaluator = evaluators.find((e) => e.id === selectedEvaluator);
      setConfirmModalOpen(false);
      toast.success('Evaluator assigned', {
        description: `${evaluator?.name} has been assigned to your application.`,
      });
      onNavigate('tracking');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Evaluator Recommendation</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-matched evaluators based on your application requirements</p>
      </div>

      {assignedEvaluatorId && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <p className="text-sm">
                An evaluator has already been assigned.{' '}
                <button onClick={() => onNavigate('tracking')} className="text-accent underline">
                  View tracking
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {evaluators.map((evaluator, i) => (
          <Card
            key={evaluator.id}
            className={`hover:shadow-lg transition-all cursor-pointer ${
              evaluator.assigned ? 'border-success/40' : i === 0 ? 'border-accent/30' : 'border-border'
            }`}
            onClick={() => {
              setSelectedEvaluator(evaluator.id);
              setConfirmModalOpen(true);
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {evaluator.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                {i === 0 && !evaluator.assigned && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Best Match
                  </Badge>
                )}
                {evaluator.assigned && (
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Assigned
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold">{evaluator.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{evaluator.expertise}</p>

              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {evaluator.experience}
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {evaluator.match_score}% match
                </div>
              </div>

              {/* Match score bar */}
              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      evaluator.match_score >= 90 ? 'bg-success' :
                      evaluator.match_score >= 80 ? 'bg-accent' : 'bg-warning'
                    }`}
                    style={{ width: `${evaluator.match_score}%` }}
                  />
                </div>
              </div>

              <Button
                className="w-full mt-4"
                variant={evaluator.assigned ? 'secondary' : 'default'}
                disabled={evaluator.assigned}
              >
                {evaluator.assigned ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Assigned
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-1" />
                    Assign Evaluator
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Evaluator Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEvaluator && (() => {
              const evaluator = evaluators.find((e) => e.id === selectedEvaluator);
              return (
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {evaluator?.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{evaluator?.name}</h4>
                    <p className="text-xs text-muted-foreground">{evaluator?.expertise}</p>
                    <p className="text-xs text-muted-foreground mt-1">{evaluator?.experience} · {evaluator?.match_score}% match</p>
                  </div>
                </div>
              );
            })()}
            <p className="text-sm text-muted-foreground">
              Once assigned, the evaluator will review your application and provide a decision. You cannot change the evaluator after assignment.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign}>
              <UserCheck className="w-4 h-4 mr-1" />
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
