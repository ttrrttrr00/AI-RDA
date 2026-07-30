import React from 'react';
import { Sprout, History, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: 'diagnose' | 'history' | 'guide';
  onSelectTab: (tab: 'diagnose' | 'history' | 'guide') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, historyCount }) => {
  return (
    <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => onSelectTab('diagnose')}
        >
          <div className="bg-emerald-500 p-2 rounded-xl text-emerald-950 shadow-inner">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl tracking-tight leading-none text-emerald-50">
              농작물 AI 현장진단·상담 도우미
            </h1>
            <p className="text-xs text-emerald-300 mt-0.5 flex items-center gap-1 font-normal">
              <Sparkles className="w-3 h-3 text-amber-300" />
              사진 상태 점검 및 초기 상담기록 작성 지원
            </p>
          </div>
        </div>

        {/* Header Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('diagnose')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentTab === 'diagnose'
                ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>진단하기</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors relative ${
              currentTab === 'history'
                ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>상담내역</span>
            {historyCount > 0 && (
              <span className="bg-amber-400 text-amber-950 font-bold text-xs px-1.5 py-0.2 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentTab === 'guide'
                ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">개발·이용가이드</span>
            <span className="sm:hidden">안내</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
