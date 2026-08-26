'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { DocumentHelpDrawer } from './document-help-drawer';
import { toast } from 'sonner';
import {
  FileText,
  CheckCircle2,
  Clock,
  Upload,
  LifeBuoy,
  FileCheck,
  X,
} from 'lucide-react';

export default function DocumentsScreen() {
  const { documents, uploadDocument } = useApp();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadDoc, setUploadDoc] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpDoc, setHelpDoc] = useState('');

  const verifiedCount = documents.filter((d) => d.status === 'verified').length;
  const totalCount = documents.length;
  const progress = Math.round((verifiedCount / totalCount) * 100);

  const openUpload = (docId: string) => {
    setUploadDoc(docId);
    setUploadModalOpen(true);
  };

  const handleUpload = () => {
    if (uploadDoc) {
      uploadDocument(uploadDoc);
      setUploadModalOpen(false);
      const doc = documents.find((d) => d.id === uploadDoc);
      toast.success('Document uploaded', { description: `${doc?.name} has been uploaded and verified.` });
    }
  };

  const openHelp = (docName: string) => {
    setHelpDoc(docName);
    setHelpOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload and manage your application documents</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              <span className="font-semibold">Document Upload Progress</span>
            </div>
            <Badge variant="secondary">{verifiedCount}/{totalCount} verified</Badge>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">{progress}% complete — {totalCount - verifiedCount} documents pending</p>
        </CardContent>
      </Card>

      {/* Document list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className={`hover:shadow-md transition-shadow ${doc.status === 'pending' ? 'border-warning/40' : 'border-border'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    doc.status === 'verified' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    <FileText className={`w-5 h-5 ${doc.status === 'verified' ? 'text-success' : 'text-warning'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
                    {doc.status === 'verified' ? (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {doc.pages} pages · Uploaded {doc.uploadedAt}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">Not uploaded yet</p>
                    )}
                  </div>
                </div>
                {doc.status === 'verified' ? (
                  <Badge className="bg-success text-success-foreground">Verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-warning border-warning/40">Pending</Badge>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                {doc.status === 'pending' && (
                  <>
                    <Button size="sm" className="flex-1" onClick={() => openUpload(doc.id)}>
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openHelp(doc.name)}>
                      <LifeBuoy className="w-3.5 h-3.5 mr-1" />
                      Need Help?
                    </Button>
                  </>
                )}
                {doc.status === 'verified' && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>AI verified — no issues detected</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Demo Mode:</strong> Click &quot;Use Demo Document&quot; to simulate an upload for this prototype.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              <FileCheck className="w-4 h-4 mr-1" />
              Use Demo Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DocumentHelpDrawer
        open={helpOpen}
        onOpenChange={setHelpOpen}
        documentName={helpDoc}
      />
    </div>
  );
}
