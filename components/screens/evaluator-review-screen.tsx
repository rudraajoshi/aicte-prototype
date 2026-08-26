'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ClipboardCheck,
  FileCheck,
  Cpu,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
} from 'lucide-react';

export default function EvaluatorReviewScreen() {
  const { documents, complianceItems, aiFindings, institutionName, applicationId, submitEvaluatorReview, evaluatorReview } = useApp();
  const [decision, setDecision] = useState<string>('');
  const [comments, setComments] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async () => {
    if (!decision) return;
    await submitEvaluatorReview(decision, comments);
    setConfirmOpen(false);
    toast.success('Review submitted', { description: `Your decision (${decision}) has been recorded.` });
  };

  if (evaluatorReview) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Application Review</h1>
        <Card className={`${evaluatorReview.decision === 'Approved' ? 'border-success/30 bg-success/5' : evaluatorReview.decision === 'Rejected' ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {evaluatorReview.decision === 'Approved' ? (
                <CheckCircle2 className="w-12 h-12 text-success" />
              ) : evaluatorReview.decision === 'Rejected' ? (
                <XCircle className="w-12 h-12 text-destructive" />
              ) : (
                <HelpCircle className="w-12 h-12 text-warning" />
              )}
              <div>
                <h2 className="text-xl font-semibold">Decision: {evaluatorReview.decision}</h2>
                <p className="text-sm text-muted-foreground mt-1">{evaluatorReview.comments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Application Review</h1>
        <p className="text-muted-foreground text-sm mt-1">{institutionName} — {applicationId}</p>
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="findings">AI Findings</TabsTrigger>
        </TabsList>

        {/* Documents tab */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Submitted Documents
              </CardTitle>
              <CardDescription>Review uploaded documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="text-sm font-medium">{doc.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {doc.status === 'verified' ? `${doc.pages} pages · Uploaded ${doc.uploadedAt}` : 'Not uploaded'}
                      </p>
                    </div>
                  </div>
                  {doc.status === 'verified' ? (
                    <Badge className="bg-success text-success-foreground">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-warning border-warning/40">Missing</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance tab */}
        <TabsContent value="compliance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Compliance Analysis
              </CardTitle>
              <CardDescription>AI-generated compliance report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceItems.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {item.status === 'compliant' ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : item.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-warning" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <h4 className="text-sm font-medium">{item.title}</h4>
                    </div>
                    <Badge className={
                      item.status === 'compliant' ? 'bg-success text-success-foreground' :
                      item.status === 'warning' ? 'bg-warning text-warning-foreground' :
                      'bg-destructive text-destructive-foreground'
                    }>
                      {item.score}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.details}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Findings tab */}
        <TabsContent value="findings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                AI Verification Findings
              </CardTitle>
              <CardDescription>Issues detected by AI document scanning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiFindings.map((finding) => (
                <div key={finding.id} className={`p-3 rounded-lg border ${
                  finding.severity === 'high' ? 'border-destructive/30 bg-destructive/5' :
                  'border-warning/30 bg-warning/5'
                }`}>
                  <div className="flex items-start gap-2">
                    {finding.severity === 'high' ? (
                      <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium">{finding.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{finding.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Decision form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submit Your Decision</CardTitle>
          <CardDescription>Provide your review and recommendation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setDecision('Approved')}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'Approved' ? 'border-success bg-success/5' : 'border-border hover:border-success/40'
              }`}
            >
              <ThumbsUp className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-sm font-medium">Approve</p>
            </button>
            <button
              onClick={() => setDecision('Needs More Info')}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'Needs More Info' ? 'border-warning bg-warning/5' : 'border-border hover:border-warning/40'
              }`}
            >
              <HelpCircle className="w-6 h-6 text-warning mx-auto mb-2" />
              <p className="text-sm font-medium">Needs More Info</p>
            </button>
            <button
              onClick={() => setDecision('Rejected')}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'Rejected' ? 'border-destructive bg-destructive/5' : 'border-border hover:border-destructive/40'
              }`}
            >
              <ThumbsDown className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium">Reject</p>
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Review Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide detailed comments about your decision..."
              rows={4}
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!decision}
            onClick={() => setConfirmOpen(true)}
          >
            Submit Review
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Decision</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You are about to submit the following decision:
            </p>
            <div className="p-3 rounded-lg border border-border bg-muted/30">
              <p className="font-semibold">{decision}</p>
              {comments && <p className="text-xs text-muted-foreground mt-1">{comments}</p>}
            </div>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone. The institution will be notified of your decision.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Confirm Decision</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
