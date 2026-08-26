'use client';

import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LifeBuoy, CheckCircle2, Clock } from 'lucide-react';

export default function EvaluatorSupportScreen() {
  const { supportRequests, resolveSupportRequest } = useApp();

  const handleResolve = async (id: string) => {
    await resolveSupportRequest(id);
    toast.success('Support request resolved');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Support Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and resolve support requests from institutions</p>
      </div>

      {supportRequests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <LifeBuoy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No support requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {supportRequests.map((req) => (
            <Card key={req.id} className={req.status === 'open' ? 'border-warning/30' : 'border-success/30'}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      req.status === 'open' ? 'bg-warning/10' : 'bg-success/10'
                    }`}>
                      {req.status === 'open' ? (
                        <Clock className="w-5 h-5 text-warning" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{req.document_name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{req.issue_type}</p>
                    </div>
                  </div>
                  <Badge variant={req.status === 'open' ? 'destructive' : 'secondary'}>
                    {req.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{req.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(req.created_at).toLocaleString()}
                  </span>
                  {req.status === 'open' && (
                    <Button size="sm" variant="outline" onClick={() => handleResolve(req.id)}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
