'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export type DocumentStatus = 'verified' | 'pending' | 'rejected';
export type StageStatus = 'complete' | 'current' | 'pending';
export type UserRole = 'institution' | 'evaluator';

export interface DocItem {
  id: string;
  name: string;
  status: DocumentStatus;
  uploadedAt: string | null;
  pages: number;
  type: string;
}

export interface Stage {
  id: string;
  title: string;
  status: StageStatus;
  date: string;
  description: string;
}

export interface AIFinding {
  id: string;
  document: string;
  type: string;
  severity: string;
  title: string;
  description: string;
}

export interface ComplianceItem {
  id: string;
  title: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  score: number;
  description: string;
  details: string;
}

export interface Evaluator {
  id: string;
  name: string;
  expertise: string;
  experience: string;
  match_score: number;
  assigned: boolean;
  assigned_at: string | null;
}

export interface SupportRequest {
  id: string;
  application_id: string | null;
  document_name: string;
  issue_type: string;
  description: string;
  status: string;
  created_at: string;
}

export interface EvaluatorReview {
  id: string;
  application_id: string;
  evaluator_id: string | null;
  decision: string;
  comments: string;
  created_at: string;
}

export interface AppState {
  loggedIn: boolean;
  role: UserRole;
  institutionName: string;
  applicationId: string;
  status: string;
  complianceScore: number;
  documents: DocItem[];
  stages: Stage[];
  aiFindings: AIFinding[];
  complianceItems: ComplianceItem[];
  assignedEvaluatorId: string | null;
  evaluatorReview: EvaluatorReview | null;
  evaluators: Evaluator[];
  supportRequests: SupportRequest[];
  loading: boolean;
}

interface AppContextType extends AppState {
  login: (role: UserRole) => void;
  logout: () => void;
  uploadDocument: (docId: string) => void;
  assignEvaluator: (evaluatorId: string) => void;
  submitSupportRequest: (docName: string, issueType: string, description: string) => Promise<void>;
  submitEvaluatorReview: (decision: string, comments: string) => Promise<void>;
  resolveSupportRequest: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const DEFAULT_DOCS: DocItem[] = [
  { id: 'doc1', name: 'Institution Proposal', status: 'verified', uploadedAt: '2024-01-15', pages: 12, type: 'PDF' },
  { id: 'doc2', name: 'Land Documents', status: 'verified', uploadedAt: '2024-01-15', pages: 8, type: 'PDF' },
  { id: 'doc3', name: 'Building Plan', status: 'verified', uploadedAt: '2024-01-16', pages: 15, type: 'PDF' },
  { id: 'doc4', name: 'Faculty List', status: 'pending', uploadedAt: null, pages: 0, type: 'PDF' },
  { id: 'doc5', name: 'Financial Statements', status: 'pending', uploadedAt: null, pages: 0, type: 'PDF' },
  { id: 'doc6', name: 'Affiliation Letter', status: 'verified', uploadedAt: '2024-01-14', pages: 5, type: 'PDF' },
  { id: 'doc7', name: 'NOC from State Government', status: 'pending', uploadedAt: null, pages: 0, type: 'PDF' },
  { id: 'doc8', name: 'Anti-Ragging Policy', status: 'verified', uploadedAt: '2024-01-17', pages: 3, type: 'PDF' },
];

const DEFAULT_STAGES: Stage[] = [
  { id: 'stage1', title: 'Initial Submission', status: 'complete', date: 'Jan 15, 2024', description: 'Application submitted with basic documents' },
  { id: 'stage2', title: 'Document Verification', status: 'complete', date: 'Jan 18, 2024', description: 'AI-powered document verification completed' },
  { id: 'stage3', title: 'Compliance Analysis', status: 'complete', date: 'Jan 20, 2024', description: 'AI compliance check completed - 84% score' },
  { id: 'stage4', title: 'Evaluator Assignment', status: 'current', date: 'In Progress', description: 'Awaiting evaluator assignment' },
  { id: 'stage5', title: 'Evaluator Review', status: 'pending', date: 'Pending', description: 'Evaluator review and site visit' },
  { id: 'stage6', title: 'Final Decision', status: 'pending', date: 'Pending', description: 'AICTE committee final decision' },
];

const DEFAULT_FINDINGS: AIFinding[] = [
  { id: 'f1', document: 'Faculty List', type: 'missing_document', severity: 'high', title: 'Faculty List Not Uploaded', description: 'The faculty list document is required but has not been uploaded yet.' },
  { id: 'f2', document: 'Financial Statements', type: 'missing_document', severity: 'high', title: 'Financial Statements Missing', description: 'Financial statements for the last 3 years are required for verification.' },
  { id: 'f3', document: 'Faculty List', type: 'data_issue', severity: 'medium', title: 'Faculty Experience Below Requirement', description: '5 faculty members have less than 3 years of teaching experience. Minimum 5 years is required for senior positions.' },
];

const DEFAULT_COMPLIANCE: ComplianceItem[] = [
  { id: 'c1', title: 'Land Requirement', status: 'compliant', score: 100, description: '5 acres of land available (minimum 2 acres required)', details: 'The institution has 5 acres of land which exceeds the minimum requirement of 2 acres for technical institutions.' },
  { id: 'c2', title: 'Building & Infrastructure', status: 'compliant', score: 95, description: 'Built-up area 8000 sq.m (minimum 5000 sq.m required)', details: 'The built-up area meets and exceeds the minimum requirement. Classrooms, laboratories, and library are adequately sized.' },
  { id: 'c3', title: 'Faculty Qualification', status: 'warning', score: 70, description: '70% faculty with PhD (minimum 80% required for PG programs)', details: 'Currently 70% of faculty members hold PhD qualifications. The minimum requirement is 80% for institutions offering postgraduate programs. 5 faculty members need to complete their PhD.' },
  { id: 'c4', title: 'Financial Stability', status: 'non-compliant', score: 0, description: 'Financial statements not submitted', details: 'Financial statements for the last 3 years are required to demonstrate financial stability. This is a mandatory document that has not been uploaded.' },
];

const APP_ROW_ID = 'a0000000-0000-0000-0000-000000000001';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    loggedIn: false,
    role: 'institution',
    institutionName: 'National Institute of Technology',
    applicationId: 'AICTE-2024-00342',
    status: 'Documents Pending',
    complianceScore: 84,
    documents: DEFAULT_DOCS,
    stages: DEFAULT_STAGES,
    aiFindings: DEFAULT_FINDINGS,
    complianceItems: DEFAULT_COMPLIANCE,
    assignedEvaluatorId: null,
    evaluatorReview: null,
    evaluators: [],
    supportRequests: [],
    loading: true,
  });

  const loadData = useCallback(async () => {
    try {
      const [appRes, evalRes, supportRes, reviewRes] = await Promise.all([
        supabase.from('applications').select('*').eq('id', APP_ROW_ID).maybeSingle(),
        supabase.from('evaluators').select('*'),
        supabase.from('support_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('evaluator_reviews').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);

      const evaluators: Evaluator[] = (evalRes.data || []).map((e: Record<string, unknown>) => ({
        id: e.id as string,
        name: e.name as string,
        expertise: e.expertise as string,
        experience: e.experience as string,
        match_score: e.match_score as number,
        assigned: e.assigned as boolean,
        assigned_at: e.assigned_at as string | null,
      }));

      const supportRequests: SupportRequest[] = (supportRes.data || []).map((s: Record<string, unknown>) => ({
        id: s.id as string,
        application_id: s.application_id as string | null,
        document_name: s.document_name as string,
        issue_type: s.issue_type as string,
        description: s.description as string,
        status: s.status as string,
        created_at: s.created_at as string,
      }));

      let evaluatorReview: EvaluatorReview | null = null;
      if (reviewRes.data) {
        const r = reviewRes.data as Record<string, unknown>;
        evaluatorReview = {
          id: r.id as string,
          application_id: r.application_id as string,
          evaluator_id: r.evaluator_id as string | null,
          decision: r.decision as string,
          comments: r.comments as string,
          created_at: r.created_at as string,
        };
      }

      if (appRes.data) {
        const app = appRes.data as Record<string, unknown>;
        setState((prev) => ({
          ...prev,
          institutionName: (app.institution_name as string) || prev.institutionName,
          applicationId: (app.application_id as string) || prev.applicationId,
          status: (app.status as string) || prev.status,
          complianceScore: (app.compliance_score as number) ?? prev.complianceScore,
          documents: (app.documents as DocItem[]) || prev.documents,
          stages: (app.stages as Stage[]) || prev.stages,
          aiFindings: (app.ai_findings as AIFinding[]) || prev.aiFindings,
          complianceItems: (app.compliance_items as ComplianceItem[]) || prev.complianceItems,
          assignedEvaluatorId: (app.assigned_evaluator_id as string | null) || null,
          evaluatorReview,
          evaluators,
          supportRequests,
          loading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, evaluators, supportRequests, evaluatorReview, loading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const persistApp = useCallback(async (updates: Record<string, unknown>) => {
    try {
      await supabase.from('applications').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', APP_ROW_ID);
    } catch {
      // silent fail for demo
    }
  }, []);

  const login = useCallback((role: UserRole) => {
    setState((prev) => ({ ...prev, loggedIn: true, role }));
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, loggedIn: false, role: 'institution' }));
  }, []);

  const uploadDocument = useCallback((docId: string) => {
    setState((prev) => {
      const documents = prev.documents.map((d) =>
        d.id === docId
          ? { ...d, status: 'verified' as DocumentStatus, uploadedAt: new Date().toISOString().split('T')[0], pages: Math.floor(Math.random() * 15) + 3 }
          : d
      );
      const verifiedCount = documents.filter((d) => d.status === 'verified').length;
      const totalCount = documents.length;
      const newScore = Math.round((verifiedCount / totalCount) * 100);
      persistApp({ documents, compliance_score: newScore });
      return { ...prev, documents, complianceScore: newScore };
    });
  }, [persistApp]);

  const assignEvaluator = useCallback((evaluatorId: string) => {
    setState((prev) => {
      const stages = prev.stages.map((s) =>
        s.id === 'stage4' ? { ...s, status: 'complete' as StageStatus, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
          : s.id === 'stage5' ? { ...s, status: 'current' as StageStatus, date: 'In Progress' }
          : s
      );
      const evaluators = prev.evaluators.map((e) =>
        e.id === evaluatorId ? { ...e, assigned: true, assigned_at: new Date().toISOString() } : { ...e, assigned: false }
      );
      persistApp({ assigned_evaluator_id: evaluatorId, stages });
      void supabase.from('evaluators').update({ assigned: false, assigned_at: null }).neq('id', evaluatorId);
      void supabase.from('evaluators').update({ assigned: true, assigned_at: new Date().toISOString() }).eq('id', evaluatorId);
      return { ...prev, assignedEvaluatorId: evaluatorId, stages, evaluators, status: 'Evaluator Assigned' };
    });
  }, [persistApp]);

  const submitSupportRequest = useCallback(async (docName: string, issueType: string, description: string) => {
    const { data } = await supabase.from('support_requests').insert({
      application_id: state.applicationId,
      document_name: docName,
      issue_type: issueType,
      description,
      status: 'open',
    }).select().single();
    if (data) {
      setState((prev) => ({
        ...prev,
        supportRequests: [
          {
            id: data.id,
            application_id: data.application_id,
            document_name: data.document_name,
            issue_type: data.issue_type,
            description: data.description,
            status: data.status,
            created_at: data.created_at,
          },
          ...prev.supportRequests,
        ],
      }));
    }
  }, [state.applicationId]);

  const submitEvaluatorReview = useCallback(async (decision: string, comments: string) => {
    const { data } = await supabase.from('evaluator_reviews').insert({
      application_id: state.applicationId,
      evaluator_id: state.assignedEvaluatorId,
      decision,
      comments,
    }).select().single();
    if (data) {
      const review: EvaluatorReview = {
        id: data.id,
        application_id: data.application_id,
        evaluator_id: data.evaluator_id,
        decision: data.decision,
        comments: data.comments,
        created_at: data.created_at,
      };
      setState((prev) => {
        const stages = prev.stages.map((s) =>
          s.id === 'stage5' ? { ...s, status: 'complete' as StageStatus, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
            : s.id === 'stage6' ? { ...s, status: 'current' as StageStatus, date: 'In Progress' }
            : s
        );
        persistApp({ evaluator_review: review, stages, status: decision });
        return { ...prev, evaluatorReview: review, stages, status: decision };
      });
    }
  }, [state.applicationId, state.assignedEvaluatorId, persistApp]);

  const resolveSupportRequest = useCallback(async (id: string) => {
    await supabase.from('support_requests').update({ status: 'resolved' }).eq('id', id);
    setState((prev) => ({
      ...prev,
      supportRequests: prev.supportRequests.map((s) => s.id === id ? { ...s, status: 'resolved' } : s),
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      uploadDocument,
      assignEvaluator,
      submitSupportRequest,
      submitEvaluatorReview,
      resolveSupportRequest,
    }}>
      {children}
    </AppContext.Provider>
  );
}
