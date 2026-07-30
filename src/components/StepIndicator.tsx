import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number; // 1: 기본정보, 2: 사진등록, 3: 분석중, 4: 분석결과
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: '기본정보' },
    { num: 2, label: '사진등록' },
    { num: 3, label: '품질&분석' },
    { num: 4, label: '상담기록' },
  ];

  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-3 shadow-sm my-3">
      <div className="flex items-center justify-between max-w-xl mx-auto relative px-2">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isCurrent ? 'text-emerald-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                    currentStep > step.num ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
