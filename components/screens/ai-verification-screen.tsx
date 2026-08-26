'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentHelpDrawer } from './document-help-drawer';
import {
  FileText,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LifeBuoy,
  Cpu,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface AIVerificationScreenProps {
  onNavigate: (screen: string) => void;
}

const SCAN_STEPS = [
  { label: 'Loading document...', duration: 800 },
  { label: 'Extracting text content...', duration: 1200 },
  { label: 'Analyzing document structure...', duration: 1000 },
  { label: 'Cross-referencing with AICTE norms...', duration: 1400 },
  { label: 'Generating findings...', duration: 1000 },
];

export default function AIVerificationScreen({ onNavigate }: AIVerificationScreenProps) {
  const { documents, aiFindings } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpDoc, setHelpDoc] = useState('');
  const [helpContext, setHelpContext] = useState<string | undefined>(undefined);

  const verifiedDocs = documents.filter((d) => d.status === 'verified');
  const activeDoc = verifiedDocs[0] || documents[0];

  useEffect(() => {
    if (!scanning) return;
    if (scanStep >= SCAN_STEPS.length) {
      setScanning(false);
      setScanned(true);
      return;
    }
    const timer = setTimeout(() => setScanStep((s) => s + 1), SCAN_STEPS[scanStep]?.duration || 1000);
    return () => clearTimeout(timer);
  }, [scanning, scanStep]);

  const startScan = () => {
    setScanned(false);
    setScanStep(0);
    setScanning(true);
  };

  const openHelp = (docName: string, context?: string) => {
    setHelpDoc(docName);
    setHelpContext(context);
    setHelpOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">AI Verification</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered document scanning and verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {activeDoc?.name || 'No Document'}
            </CardTitle>
            <CardDescription>{activeDoc?.pages || 0} pages · {activeDoc?.type || 'PDF'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-80 rounded-lg border border-border bg-secondary/30 overflow-hidden">
              {/* Simulated document content */}
              <div className="absolute inset-0 p-6 space-y-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 bg-muted rounded"
                    style={{ width: `${Math.random() * 40 + 50}%` }}
                  />
                ))}
              </div>
              {/* Scanning line */}
              {scanning && (
                <div className="absolute left-0 right-0 h-0.5 bg-accent shadow-lg animate-scan" style={{ boxShadow: '0 0 10px hsl(var(--accent))' }} />
              )}
              {scanning && (
                <div className="absolute inset-0 bg-accent/5" />
              )}
              {scanned && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Scanned
                  </Badge>
                </div>
              )}
            </div>

            {/* Page tabs */}
            {activeDoc && activeDoc.pages > 0 && (
              <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                {Array.from({ length: Math.min(activeDoc.pages, 5) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePage(i + 1)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                      activePage === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    Page {i + 1}
                  </button>
                ))}
                {activeDoc.pages > 5 && (
                  <span className="px-3 py-1.5 text-xs text-muted-foreground">+{activeDoc.pages - 5} more</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Verification Results
            </CardTitle>
            <CardDescription>
              {scanning ? 'Scanning in progress...' : scanned ? 'AI analysis complete' : 'Click to start AI verification'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scanning && !scanned && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <ScanLine className="w-8 h-8 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                  Run AI verification to scan the document for completeness, accuracy, and compliance with AICTE norms.
                </p>
                <Button onClick={startScan} size="lg">
                  <ScanLine className="w-4 h-4 mr-2" />
                  Run AI Verification
                </Button>
              </div>
            )}

            {scanning && (
              <div className="space-y-3 py-4">
                {SCAN_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i < scanStep ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : i === scanStep ? (
                      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted" />
                    )}
                    <span className={`text-sm ${i <= scanStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {scanned && (
              <div className="space-y-4 animate-fade-in">
                {/* Extracted info */}
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-accent" />
                    Extracted Information
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Institution Name', value: 'National Institute of Technology' },
                      { label: 'Document Type', value: activeDoc?.name || 'N/A' },
                      { label: 'Date of Issue', value: 'January 15, 2024' },
                      { label: 'Issuing Authority', value: 'State Education Department' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Findings */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">AI Findings</h4>
                  <div className="space-y-2">
                    {aiFindings.map((finding) => (
                      <div key={finding.id} className={`p-3 rounded-lg border ${
                        finding.severity === 'high' ? 'border-destructive/30 bg-destructive/5' :
                        finding.severity === 'medium' ? 'border-warning/30 bg-warning/5' :
                        'border-border bg-muted/30'
                      }`}>
                        <div className="flex items-start gap-2">
                          {finding.severity === 'high' ? (
                            <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h5 className="text-sm font-medium">{finding.title}</h5>
                            <p className="text-xs text-muted-foreground mt-0.5">{finding.description}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 mt-2 text-xs"
                              onClick={() => openHelp(finding.document, finding.description)}
                            >
                              <LifeBuoy className="w-3 h-3 mr-1" />
                              How do I fix this?
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-accent" />
                    AI Recommendation
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Upload the missing documents (Faculty List, Financial Statements) to improve your compliance score. The faculty experience issue can be addressed by hiring qualified faculty or providing experience certificates.
                  </p>
                </div>

                <Button className="w-full" onClick={() => onNavigate('compliance')}>
                  View Compliance Analysis <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
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
