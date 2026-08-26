'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useApp } from '@/lib/app-context';
import { toast } from 'sonner';
import {
  MapPin,
  FileText,
  MessageSquare,
  LifeBuoy,
  AlertTriangle,
  Send,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

interface DocumentHelpDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  issueContext?: string;
}

type View = 'main' | 'guidance' | 'alternatives' | 'chat';

const DOCUMENT_GUIDANCE: Record<string, { what: string; where: string; check: string; need: string }> = {
  default: {
    what: 'This document is a mandatory requirement for AICTE approval. It serves as proof of compliance with regulatory norms.',
    where: 'You can obtain this document from the relevant government department or your institution records office.',
    check: 'Ensure all pages are clearly legible, stamped, and signed by the authorized signatory.',
    need: 'You may need your institution registration certificate and a formal application letter to request this document.',
  },
};

const DOCUMENT_ALTERNATIVES: Record<string, { name: string; description: string }[]> = {
  default: [
    { name: 'Notarized Affidavit', description: 'A notarized affidavit on stamp paper declaring the required information can sometimes be accepted as a temporary substitute.' },
    { name: 'Provisional Certificate', description: 'A provisional certificate from the issuing authority may be accepted while the original is being processed.' },
  ],
};

const CHAT_RESPONSES: Record<string, string> = {
  default: 'Based on AICTE norms, this document is required to verify your institution meets the minimum infrastructure standards. I recommend uploading it as soon as possible. If you cannot obtain it immediately, you may submit a notarized affidavit as a temporary substitute, though final approval will require the original document.',
};

export function DocumentHelpDrawer({ open, onOpenChange, documentName, issueContext }: DocumentHelpDrawerProps) {
  const { submitSupportRequest } = useApp();
  const [view, setView] = useState<View>('main');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', description: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setView('main');
      setChatMessages([]);
    }
  }, [open, documentName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const guidance = DOCUMENT_GUIDANCE.default;
  const alternatives = DOCUMENT_ALTERNATIVES.default;

  const sendChat = (text: string) => {
    if (!text.trim()) return;
    setChatMessages((prev) => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = issueContext
        ? `${CHAT_RESPONSES.default}\n\nRegarding the issue: ${issueContext}`
        : CHAT_RESPONSES.default;
      setChatMessages((prev) => [...prev, { role: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSupportSubmit = async () => {
    if (!supportForm.subject || !supportForm.description) return;
    await submitSupportRequest(documentName, supportForm.subject, supportForm.description);
    setSupportModalOpen(false);
    setSupportForm({ subject: '', description: '' });
    toast.success('Support request submitted', { description: 'An evaluator will review your request shortly.' });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {view !== 'main' && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setView('main')}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              Document Assistance
            </SheetTitle>
            <SheetDescription>
              {documentName}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {view === 'main' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">
                    {issueContext ? issueContext : `Get help with "${documentName}" — find out where to get it, explore alternatives, or ask our AI assistant.`}
                  </p>
                </div>

                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('guidance')}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">Where can I get this document?</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Find the issuing authority and process</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('alternatives')}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">Is there an alternate document?</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Explore acceptable substitutes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('chat')}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">Ask AI Assistant</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Get instant answers to your questions</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => setSupportModalOpen(true)}>
                    <LifeBuoy className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  AI guidance is advisory only. Final decisions rest with AICTE evaluators.
                </p>
              </div>
            )}

            {view === 'guidance' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">What is this document?</h3>
                    <p className="text-sm text-muted-foreground">{guidance.what}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Where to obtain it</h3>
                    <p className="text-sm text-muted-foreground">{guidance.where}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">What to check before uploading</h3>
                    <p className="text-sm text-muted-foreground">{guidance.check}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">What you may need</h3>
                    <p className="text-sm text-muted-foreground">{guidance.need}</p>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setView('chat')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Still have questions? Ask AI
                </Button>
              </div>
            )}

            {view === 'alternatives' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Alternative documents may be accepted at the evaluator&apos;s discretion. There is no guarantee of approval.
                  </p>
                </div>
                {alternatives.map((alt, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-sm">{alt.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{alt.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button className="w-full" onClick={() => setView('chat')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI about alternatives
                </Button>
              </div>
            )}

            {view === 'chat' && (
              <div className="flex flex-col h-[calc(100vh-12rem)] animate-fade-in">
                <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                  {chatMessages.length === 0 && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                        Hi! I&apos;m your AI assistant. Ask me anything about &quot;{documentName}&quot; or AICTE requirements.
                      </div>
                      <div className="space-y-2">
                        {[
                          `What is ${documentName} and why is it needed?`,
                          'What happens if I cannot provide this document?',
                          'What are the common mistakes to avoid?',
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => sendChat(q)}
                            className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat(chatInput)}
                    placeholder="Type your question..."
                    className="flex-1"
                  />
                  <Button size="icon" onClick={() => sendChat(chatInput)} disabled={!chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" className="w-full mt-2 text-xs" onClick={() => setSupportModalOpen(true)}>
                  <LifeBuoy className="w-3 h-3 mr-1" />
                  Need human help? Contact Support
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Support Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Input
                id="support-subject"
                value={supportForm.subject}
                onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-desc">Description</Label>
              <Textarea
                id="support-desc"
                value={supportForm.description}
                onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                placeholder="Describe your issue in detail"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSupportSubmit} disabled={!supportForm.subject || !supportForm.description}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
