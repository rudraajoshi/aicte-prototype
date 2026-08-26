'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { DocumentHelpDrawer } from './document-help-drawer';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  LifeBuoy,
  ArrowRight,
} from 'lucide-react';

interface ComplianceScreenProps {
  onNavigate: (screen: string) => void;
}

export default function ComplianceScreen({ onNavigate }: ComplianceScreenProps) {
  const { complianceScore, complianceItems } = useApp();
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpDoc, setHelpDoc] = useState('');
  const [helpContext, setHelpContext] = useState<string | undefined>(undefined);

  const openHelp = (title: string, details: string) => {
    setHelpDoc(title);
    setHelpContext(details);
    setHelpOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Compliance Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered compliance check against AICTE norms</p>
      </div>

      {/* Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                <circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke={complianceScore >= 80 ? 'hsl(var(--success))' : complianceScore >= 60 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(complianceScore / 100) * 440} 440`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{complianceScore}%</span>
                <span className="text-sm text-muted-foreground">Compliance Score</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">Overall Compliance Status</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {complianceScore >= 80
                    ? 'Your application meets most AICTE requirements. Address remaining warnings to ensure full compliance.'
                    : 'Your application has compliance issues that need to be addressed before approval.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-success text-success-foreground">
                  {complianceItems.filter((c) => c.status === 'compliant').length} Compliant
                </Badge>
                <Badge className="bg-warning text-warning-foreground">
                  {complianceItems.filter((c) => c.status === 'warning').length} Warning
                </Badge>
                <Badge className="bg-destructive text-destructive-foreground">
                  {complianceItems.filter((c) => c.status === 'non-compliant').length} Non-Compliant
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirement cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {complianceItems.map((item) => (
          <Card key={item.id} className={`hover:shadow-md transition-shadow ${
            item.status === 'compliant' ? 'border-success/30' :
            item.status === 'warning' ? 'border-warning/30' :
            'border-destructive/30'
          }`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {item.status === 'compliant' ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : item.status === 'warning' ? (
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                  <div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
                <Badge className={`${
                  item.status === 'compliant' ? 'bg-success text-success-foreground' :
                  item.status === 'warning' ? 'bg-warning text-warning-foreground' :
                  'bg-destructive text-destructive-foreground'
                }`}>
                  {item.score}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{item.details}</p>
              {item.status !== 'compliant' && (
                <Button variant="outline" size="sm" onClick={() => openHelp(item.title, item.details)}>
                  <LifeBuoy className="w-3.5 h-3.5 mr-1" />
                  Get Help
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Findings table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Findings</CardTitle>
          <CardDescription>AI-generated compliance analysis report</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requirement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge className={`${
                      item.status === 'compliant' ? 'bg-success text-success-foreground' :
                      item.status === 'warning' ? 'bg-warning text-warning-foreground' :
                      'bg-destructive text-destructive-foreground'
                    }`}>
                      {item.status === 'compliant' ? 'Compliant' : item.status === 'warning' ? 'Warning' : 'Non-Compliant'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.score}%</TableCell>
                  <TableCell>
                    {item.status !== 'compliant' ? (
                      <Button variant="ghost" size="sm" onClick={() => openHelp(item.title, item.details)}>
                        <LifeBuoy className="w-3.5 h-3.5 mr-1" />
                        Get Help
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">No action needed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Cpu className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">AI Recommendation</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Upload the Financial Statements to address the non-compliant item. For the faculty qualification warning, provide a timeline for PhD completion or hire additional qualified faculty. Once these are addressed, your compliance score should reach the 90%+ threshold for approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => onNavigate('tracking')}>
          Continue to Tracking <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <DocumentHelpDrawer
        open={helpOpen}
        onOpenChange={setHelpOpen}
        documentName={helpDoc}
        issueContext={helpContext}
      />
    </div>
  );
}
