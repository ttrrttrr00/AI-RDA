import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const LoadingView: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    '사진 품질 및 초점 상태 확인 중...',
    '관찰 가능한 농작물 증상 파악 중...',
    '의심 원인 (1순위 / 2순위) 종합 비교 중...',
    '피해 심각도 및 확산 가능성 분석 중...',
    '농업인용 쉬운 가이드 및 상담기록 작성 중...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-md text-center max-w-lg mx-auto my-8 space-y-6">
      {/* Animated Pulser & Sprout Icon */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-40"></div>
        <div className="absolute inset-2 bg-emerald-100 rounded-full animate-pulse"></div>
        <div className="relative z-10 bg-emerald-600 text-white p-4 rounded-full shadow-lg">
          <Sprout className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      {/* Main Title & Required Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          <span>분석을 시작합니다</span>
        </h2>
        <p className="text-base font-semibold text-emerald-800 bg-emerald-50 py-2 px-4 rounded-xl inline-block border border-emerald-200">
          “사진 상태와 농작물 증상을 분석하고 있습니다.”
        </p>
      </div>

      {/* Progress Checklist */}
      <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 space-y-2.5">
        {steps.map((text, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-sm transition-all ${
                isDone
                  ? 'text-emerald-700 font-semibold'
                  : isCurrent
                  ? 'text-emerald-900 font-bold'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{text}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>분석에는 약 3~8초가 소요됩니다. 잠시만 기다려 주세요.</span>
      </p>
    </div>
  );
};
