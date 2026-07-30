import React, { useState } from 'react';
import { History, Trash2, ChevronRight, Search, FileText, Sprout } from 'lucide-react';
import { ConsultationRecord } from '../types';

interface HistoryModalProps {
  records: ConsultationRecord[];
  onSelectRecord: (record: ConsultationRecord) => void;
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  records,
  onSelectRecord,
  onClearHistory,
  onDeleteRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(
    (r) =>
      r.cropName.includes(searchTerm) ||
      r.region.includes(searchTerm) ||
      r.receiptNumber.includes(searchTerm) ||
      (r.diagnosis.analysis?.firstPossibility &&
        r.diagnosis.analysis.firstPossibility.includes(searchTerm))
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-600 text-white p-2 rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">최근 현장 진단 및 상담 기록</h3>
            <p className="text-xs text-slate-500">
              브라우저에 보관된 과거 상담 내역 목록입니다. (총 {records.length}건)
            </p>
          </div>
        </div>

        {records.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>기록 전체 삭제</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {records.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="작물명, 재배지역, 접수번호, 의심 질병명 검색..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Record Items List */}
      {filtered.length > 0 ? (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-sm transition-all flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-emerald-50/30 group"
            >
              <div 
                className="flex-1 cursor-pointer space-y-1"
                onClick={() => onSelectRecord(item)}
              >
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {item.receiptNumber}
                  </span>
                  <span>{item.createdAt}</span>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-bold text-base text-slate-900">{item.cropName}</span>
                  <span className="text-xs text-slate-600">({item.region})</span>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                    {item.parts.join(', ')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  1순위 의심: <span className="font-bold text-rose-700">{item.diagnosis.analysis?.firstPossibility || '분석 중'}</span>
                  {' | '}
                  품질: <span className="font-bold text-emerald-700">{item.diagnosis.photoQuality.status}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectRecord(item)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>결과 열람</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteRecord(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="기록 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50">
          <Sprout className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">저장된 상담 기록이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">농작물 사진을 진단하시면 이곳에 자동으로 보관됩니다.</p>
        </div>
      )}
    </div>
  );
};
