'use client';

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/lib/app-context';
import { Toaster } from 'sonner';
import AppShell from '@/components/screens/app-shell';
import LoginScreen from '@/components/screens/login-screen';
import DashboardScreen from '@/components/screens/dashboard-screen';
import DocumentsScreen from '@/components/screens/documents-screen';
import AIVerificationScreen from '@/components/screens/ai-verification-screen';
import ComplianceScreen from '@/components/screens/compliance-screen';
import TrackingScreen from '@/components/screens/tracking-screen';
import EvaluatorRecommendationScreen from '@/components/screens/evaluator-recommendation-screen';
import EvaluatorDashboardScreen from '@/components/screens/evaluator-dashboard-screen';
import EvaluatorReviewScreen from '@/components/screens/evaluator-review-screen';
import EvaluatorSupportScreen from '@/components/screens/evaluator-support-screen';

function AppContent() {
  const { loggedIn, role, loading } = useApp();
  const [screen, setScreen] = useState('dashboard');

  useEffect(() => {
    if (loggedIn) {
      setScreen(role === 'evaluator' ? 'evaluator-dashboard' : 'dashboard');
    }
  }, [loggedIn, role]);

  if (!loggedIn) {
    return <LoginScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <DashboardScreen onNavigate={setScreen} />;
      case 'documents':
        return <DocumentsScreen />;
      case 'ai-verification':
        return <AIVerificationScreen onNavigate={setScreen} />;
      case 'compliance':
        return <ComplianceScreen onNavigate={setScreen} />;
      case 'tracking':
        return <TrackingScreen onNavigate={setScreen} />;
      case 'evaluator-recommendation':
        return <EvaluatorRecommendationScreen onNavigate={setScreen} />;
      case 'evaluator-dashboard':
        return <EvaluatorDashboardScreen onNavigate={setScreen} />;
      case 'evaluator-review':
        return <EvaluatorReviewScreen />;
      case 'evaluator-support':
        return <EvaluatorSupportScreen />;
      default:
        return <DashboardScreen onNavigate={setScreen} />;
    }
  };

  return (
    <AppShell activeScreen={screen} onNavigate={setScreen}>
      {renderScreen()}
    </AppShell>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}
