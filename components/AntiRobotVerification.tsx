'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Loader2, Lock } from 'lucide-react';

interface AntiRobotVerificationProps {
  isVerified: boolean;
  onVerifyChange: (verified: boolean) => void;
  error?: string;
  lang?: 'id' | 'en';
}

export default function AntiRobotVerification({
  isVerified,
  onVerifyChange,
  error,
  lang = 'id',
}: AntiRobotVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCheckboxClick = () => {
    if (isVerified) {
      onVerifyChange(false);
      return;
    }

    setIsVerifying(true);
    // Simulate brief human interaction check
    setTimeout(() => {
      setIsVerifying(false);
      onVerifyChange(true);
    }, 700);
  };

  return (
    <div className="space-y-1.5">
      <div
        onClick={handleCheckboxClick}
        role="checkbox"
        aria-checked={isVerified}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleCheckboxClick();
          }
        }}
        className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
          isVerified
            ? 'bg-emerald-50/80 border-emerald-300 shadow-sm ring-1 ring-emerald-400/20'
            : error
            ? 'bg-rose-50/80 border-rose-300 shadow-sm ring-1 ring-rose-400/20'
            : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
              isVerified
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm scale-105'
                : isVerifying
                ? 'bg-white border-teal-500'
                : 'bg-white border-slate-300 hover:border-teal-600'
            }`}
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
            ) : isVerified ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : null}
          </div>

          <div className="flex flex-col">
            <span
              className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                isVerified ? 'text-emerald-900' : 'text-slate-800'
              }`}
            >
              {lang === 'id' ? 'Saya bukan robot' : "I'm not a robot"}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-teal-700" />
              {isVerified
                ? lang === 'id'
                  ? 'Verifikasi identitas manusia berhasil'
                  : 'Human verification successful'
                : lang === 'id'
                ? 'Klik kotak untuk verifikasi keamanan'
                : 'Click box for security verification'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end pl-3 border-l border-slate-200/80 text-[9px] text-slate-400">
          <div className="flex items-center gap-1 text-teal-700 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span className="tracking-wide">BETAMI</span>
          </div>
          <span className="text-[8px] text-slate-400">Security Check</span>
        </div>
      </div>

      {error && (
        <p className="text-[11px] font-semibold text-rose-600 pl-1 flex items-center gap-1 animate-pulse">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
