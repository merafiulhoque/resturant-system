// src/app/(auth)/login/page.tsx
"use client";
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}