'use client';

import { useState, useEffect } from 'react';
import { useApp, UserRole } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Shield, Building2, FileCheck, Cpu, ClipboardCheck, Users, ArrowRight } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useApp();
  const [role, setRole] = useState<UserRole>('institution');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/80" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AICTE Approval Portal</h1>
              <p className="text-sm text-white/70">AI-Powered Approval Management</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Streamlining the AICTE<br />approval process with AI
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-md">
            Submit, verify, and track your institution's approval application with intelligent document verification and compliance analysis.
          </p>
          <div className="space-y-4 max-w-md">
            {[
              { icon: FileCheck, title: 'AI Document Verification', desc: 'Automated scanning and validation of submitted documents' },
              { icon: Cpu, title: 'Compliance Analysis', desc: 'Real-time compliance scoring against AICTE norms' },
              { icon: ClipboardCheck, title: 'Application Tracking', desc: 'Track your application through every stage' },
              { icon: Users, title: 'Evaluator Portal', desc: 'Dedicated portal for evaluators to review applications' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-white/60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-secondary/30">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AICTE Approval Portal</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Approval Management</p>
            </div>
          </div>

          <Card className="shadow-xl border-border/60">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>Access your portal to manage applications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Role toggle */}
              <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-muted rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole('institution')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                    role === 'institution' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Institution
                </button>
                <button
                  type="button"
                  onClick={() => setRole('evaluator')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                    role === 'evaluator' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Evaluator
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{role === 'institution' ? 'Institution Email' : 'Evaluator Email'}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={role === 'institution' ? 'admin@institution.edu' : 'evaluator@aicte.gov.in'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Sign in as {role === 'institution' ? 'Institution' : 'Evaluator'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => login(role)}
                >
                  Demo Login
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Prototype demo — no real credentials required
          </p>
        </div>
      </div>
    </div>
  );
}
