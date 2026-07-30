import React, { useState } from 'react';
import { Copy, Printer, RefreshCw, Check, FileText, UserCheck, Building2 } from 'lucide-react';

interface ResultActionsProps {
  activeView: 'farmer' | 'staff';
  onSelectView: (view: 'farmer' | 'staff') => void;
  farmerGuideText: string;
  staffRecordText: string;
  onReset: () => void;
}

export const ResultActions: React.FC<ResultActionsProps> = ({
  activeView,
  onSelectView,
  farmerGuideText,
  staffRecordText,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeView === 'farmer' ? farmerGuideText : staffRecordText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 no-print">
      {/* Document View Switcher Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onSelectView('farmer')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeView === 'farmer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>농업인용 쉬운 설명서</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('staff')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeView === 'staff'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>담당자용 상담기록</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          형태별 서식을 전환하여 확인하세요
        </span>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사되었습니다!' : '보고서 전체 복사'}</span>
          </button>

          {/* Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄 / PDF 저장</span>
          </button>
        </div>

        {/* Start New Diagnosis */}
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-emerald-700" />
          <span>새 농작물 진단하기</span>
        </button>
      </div>
    </div>
  );
};
