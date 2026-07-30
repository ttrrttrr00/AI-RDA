import React from 'react';
import { 
  Stethoscope, AlertOctagon, TrendingUp, ShieldAlert, CheckSquare, 
  HelpCircle, Building2, Cpu
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisResultCardProps {
  analysis: AnalysisResult;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ analysis }) => {
  const getSeverityBadge = (sev: '낮음' | '보통' | '높음') => {
    switch (sev) {
      case '높음':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-3 py-1 rounded-full text-xs">높음 (심각)</span>;
      case '보통':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs">보통 (주의)</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs">낮음 (관찰)</span>;
    }
  };

  const getConfidenceBadge = (conf: '높음' | '보통' | '낮음') => {
    switch (conf) {
      case '높음':
        return <span className="bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded-md text-xs">높음</span>;
      case '보통':
        return <span className="bg-amber-600 text-white font-bold px-2.5 py-0.5 rounded-md text-xs">보통</span>;
      default:
        return <span className="bg-slate-600 text-white font-bold px-2.5 py-0.5 rounded-md text-xs">낮음</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 text-white p-2 rounded-xl">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">AI 관찰 증상 및 원인 분석 결과</h3>
            <p className="text-xs text-slate-500">사진의 병반 형태와 기상 조건을 바탕으로 추론된 원인 정보입니다.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>AI 신뢰 수준: {getConfidenceBadge(analysis.confidence)}</span>
        </div>
      </div>

      {/* 1순위 / 2순위 의심 원인 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1순위 의심 */}
        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4 space-y-1.5 relative">
          <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md inline-block">
            1순위 의심
          </span>
          <h4 className="font-bold text-rose-900 text-lg">{analysis.firstPossibility}</h4>
          <p className="text-xs text-rose-700 font-medium">※ 확정 진단이 아니며 추정된 최고 가능성입니다.</p>
        </div>

        {/* 2순위 의심 */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-1.5">
          <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md inline-block">
            2순위 의심
          </span>
          <h4 className="font-bold text-amber-900 text-lg">{analysis.secondPossibility}</h4>
          <p className="text-xs text-amber-700 font-medium">※ 부차적으로 고려할 필요가 있는 질환/장해입니다.</p>
        </div>
      </div>

      {/* 판단 근거 & 상태 평가 */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
        <div>
          <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>판단 근거 (Evidence)</span>
          </h5>
          <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
            {analysis.evidence}
          </p>
        </div>

        {/* 심각도 및 확산 가능성 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span>피해 심각도</span>
            </span>
            {getSeverityBadge(analysis.severity)}
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <span>확산 가능성</span>
            </span>
            <span className="text-xs font-bold text-slate-800">{analysis.spreadRisk}</span>
          </div>
        </div>
      </div>

      {/* 즉시 해야 할 조치 및 추가 확인사항 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 즉시 조치 */}
        <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-2">
          <h5 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>즉시 해야 할 현장 조치</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
            {analysis.immediateActions.map((action, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 추가 확인사항 */}
        <div className="border border-slate-200 bg-white rounded-xl p-4 space-y-2">
          <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            <span>농가 현장 추가 확인사항</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
            {analysis.additionalChecks.map((check, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">•</span>
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 권고 메시지 */}
      <div className="bg-emerald-900 text-white rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">
            권고: 시·군 농업기술센터 또는 전문 진단기관에 진단 및 방제 의뢰 필요 ({analysis.expertDiagnosisNeeded})
          </span>
        </div>
      </div>
    </div>
  );
};
