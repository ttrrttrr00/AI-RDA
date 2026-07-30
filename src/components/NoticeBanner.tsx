import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 shadow-sm text-amber-950 my-3">
      <div className="flex items-start gap-3">
        <div className="bg-amber-500 text-white p-1.5 rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-base">
            <span>[필수 안내] 농작물 AI 참고 진단 유의사항</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700 inline" />
          </div>
          <p className="font-medium text-amber-950">
            본 결과는 사진을 기반으로 한 AI 참고 분석입니다. 실제 병원체 검사, 토양검정, 현장조사 또는 전문가 진단을 대체하지 않습니다. 농약 사용이나 방제 여부는 반드시 농업기술센터 또는 전문가와 상담하여 결정하세요.
          </p>
        </div>
      </div>
    </div>
  );
};
