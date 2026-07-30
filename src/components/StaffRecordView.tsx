import React, { useState } from 'react';
import { 
  FileCheck2, Building2, Calendar, MapPin, Tag, ShieldCheck, Edit3, Save 
} from 'lucide-react';
import { DiagnosisData, ShootPart, AdditionalInfo } from '../types';

interface StaffRecordViewProps {
  receiptNumber: string;
  createdAt: string;
  cropName: string;
  region: string;
  parts: ShootPart[];
  additionalInfo: AdditionalInfo;
  diagnosis: DiagnosisData;
  initialMemo?: string;
  onSaveMemo?: (memo: string) => void;
}

export const StaffRecordView: React.FC<StaffRecordViewProps> = ({
  receiptNumber,
  createdAt,
  cropName,
  region,
  parts,
  additionalInfo,
  diagnosis,
  initialMemo = '',
  onSaveMemo,
}) => {
  const { photoQuality, analysis, staffRecord } = diagnosis;
  const [memo, setMemo] = useState(initialMemo);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (onSaveMemo) {
      onSaveMemo(memo);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm space-y-6 print-area">
      {/* Official Header */}
      <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2.5 rounded-xl font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              대한민국 농림축산식품부 / 시·군 농업기술센터 현장지원 시스템
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              농작물 AI 현장진단·초기 상담기록 서식
            </h3>
          </div>
        </div>

        <div className="text-right text-xs text-slate-600 font-mono">
          <div><span className="font-bold">접수번호:</span> {receiptNumber}</div>
          <div><span className="font-bold">접수일시:</span> {createdAt}</div>
        </div>
      </div>

      {/* 1. 기본 접수 정보 Grid */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="text-slate-500 block">작물명:</span>
            <span className="font-bold text-sm text-slate-900">{cropName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="text-slate-500 block">재배지역:</span>
            <span className="font-bold text-sm text-slate-900">{region}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="text-slate-500 block">촬영부위:</span>
            <span className="font-bold text-sm text-slate-900">{parts.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* 2. 상세 진단 내용 테이블 서식 */}
      <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr className="border-b border-slate-200">
              <th className="bg-slate-100 p-3 font-bold text-slate-700 w-1/4 border-r border-slate-200">
                사진 품질 검사
              </th>
              <td className="p-3 text-slate-800 font-semibold">
                {photoQuality.status} {photoQuality.issues.length > 0 && `(${photoQuality.issues.join(', ')})`}
              </td>
            </tr>

            <tr className="border-b border-slate-200">
              <th className="bg-slate-100 p-3 font-bold text-slate-700 border-r border-slate-200">
                관찰 증상
              </th>
              <td className="p-3 text-slate-800 font-medium leading-relaxed">
                {analysis?.observedSymptoms || '미작성'}
              </td>
            </tr>

            <tr className="border-b border-slate-200">
              <th className="bg-slate-100 p-3 font-bold text-slate-700 border-r border-slate-200">
                의심 원인 (1/2순위)
              </th>
              <td className="p-3 text-slate-800 font-bold space-y-1">
                <div>1순위: <span className="text-rose-700">{analysis?.firstPossibility || 'N/A'}</span></div>
                <div>2순위: <span className="text-amber-800">{analysis?.secondPossibility || 'N/A'}</span></div>
              </td>
            </tr>

            <tr className="border-b border-slate-200">
              <th className="bg-slate-100 p-3 font-bold text-slate-700 border-r border-slate-200">
                판단 근거
              </th>
              <td className="p-3 text-slate-800 font-medium leading-relaxed">
                {analysis?.evidence || 'N/A'}
              </td>
            </tr>

            <tr className="border-b border-slate-200">
              <th className="bg-slate-100 p-3 font-bold text-slate-700 border-r border-slate-200">
                피해 심각도 및 확산 가능성
              </th>
              <td className="p-3 text-slate-800 font-semibold">
                심각도: <span className="font-bold text-rose-700">{analysis?.severity}</span> | 확산 가능성: {analysis?.spreadRisk}
              </td>
            </tr>

            <tr className="border-b border-slate-200">
              <th className="bg-slate-100 p-3 font-bold text-slate-700 border-r border-slate-200">
                추가 확인사항 & 조치 권고
              </th>
              <td className="p-3 text-slate-800 font-medium leading-relaxed">
                <div className="mb-1 font-bold">▶ 현장 추가 확인:</div>
                <div className="mb-2">{analysis?.additionalChecks.join(', ')}</div>
                <div className="font-bold">▶ 즉시 조치:</div>
                <div>{analysis?.immediateActions.join(' / ')}</div>
              </td>
            </tr>

            <tr>
              <th className="bg-slate-100 p-3 font-bold text-slate-700 border-r border-slate-200">
                AI 신뢰 수준 & 진단 필요성
              </th>
              <td className="p-3 text-slate-800 font-bold">
                AI 신뢰도: {analysis?.confidence} | 전문기관 진단: {analysis?.expertDiagnosisNeeded}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. 담당자 현장 작성 메모 (수정 가능) */}
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2 no-print">
        <div className="flex items-center justify-between">
          <label className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-emerald-700" />
            <span>담당 공무원 / 농업상담관 현장 작성 메모</span>
          </label>
          <button
            type="button"
            onClick={handleSave}
            className="text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? '저장됨✓' : '메모 저장'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="현장 방문 특이사항, 농가 조치 지도 내용 및 추후 모니터링 계획을 입력하세요..."
          className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        />
      </div>

      {/* 4. 업무 보고서 전문 */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          업무 기록 표준 보고서 전문:
        </h4>
        <div className="bg-slate-100 p-4 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-300">
          {staffRecord}
          {memo && `\n\n[담당자 현장 추가 메모]\n${memo}`}
        </div>
      </div>

      {/* 서명란 및 스탬프 박스 */}
      <div className="pt-4 flex items-end justify-between text-xs text-slate-600 font-medium border-t border-slate-200">
        <div>
          <span>작성시스템: 농작물 AI 현장진단·상담 도우미</span>
        </div>
        <div className="border border-slate-300 px-4 py-2 rounded-lg bg-slate-50 text-center">
          <span className="block text-[10px] text-slate-400">담당자 확인</span>
          <span className="font-bold text-slate-800 text-sm">( 서명 / 인 )</span>
        </div>
      </div>
    </div>
  );
};
