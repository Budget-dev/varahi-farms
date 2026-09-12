"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ShieldCheck, Lock, Mail, Sparkles, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminLoginPage() {
  const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';
  
  const [password, setPassword] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      // Sync admin role document to ensure Security Rules recognize the master account
      const adminRoleData = {
        email: ADMIN_EMAIL,
        role: 'admin',
        lastVerifiedAt: new Date().toISOString()
      };

      setDoc(doc(db, 'adminRoles', user.uid), adminRoleData, { merge: true })
        .catch(async () => {
          // If this fails, it's likely a rules block. Emit the error for debugging.
          const permissionError = new FirestorePermissionError({
            path: `adminRoles/${user.uid}`,
            operation: 'write',
            requestResourceData: adminRoleData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      
      router.push('/admin');
    }
  }, [user, router, ADMIN_EMAIL, db]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSetupMode) {
        await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password);
        toast({ title: "Admin Initialized", description: "Master credentials set." });
      } else {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
        toast({ title: "Admin Verified", description: "Welcome back." });
      }
      router.push('/admin');
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError("Admin account exists. Please sign in.");
        setIsSetupMode(false);
      } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError("Incorrect password.");
      } else {
        setError(e.message || "Access denied.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[32px] overflow-hidden">
        <div className={`p-10 text-center text-white ${isSetupMode ? 'bg-secondary' : 'bg-primary'}`}>
          <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
          <h1 className="font-headline text-3xl font-extrabold">{isSetupMode ? 'Admin Setup' : 'Admin Portal'}</h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">Vivan Farms Management</p>
        </div>
        
        <CardContent className="p-8">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-[#7A6848]">Authorized Email</label>
              <Input type="email" value={ADMIN_EMAIL} disabled className="h-12 rounded-xl bg-[#F9F6EF] font-bold opacity-60" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-[#7A6848]">{isSetupMode ? 'Create Password' : 'Password'}</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold"
                required
              />
            </div>

            {error && <div className="p-3 bg-destructive/5 text-destructive rounded-xl text-xs font-bold text-center">{error}</div>}

            <Button disabled={isLoading} className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-lg">
              {isLoading ? 'Wait...' : (isSetupMode ? 'Initialize Admin' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {!isSetupMode ? (
              <button onClick={() => setIsSetupMode(true)} className="text-[10px] font-black uppercase text-primary hover:underline">
                First-time? Initialize Master Account
              </button>
            ) : (
              <button onClick={() => setIsSetupMode(false)} className="text-[10px] font-black uppercase text-[#7A6848] hover:underline">
                Back to Sign In
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}