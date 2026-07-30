import React, { useState } from 'react';
import { 
  UserCheck, CheckSquare, Sparkles, AlertCircle, Building2, HelpCircle 
} from 'lucide-react';
import { DiagnosisData, UploadedPhoto } from '../types';

interface FarmerGuideViewProps {
  diagnosis: DiagnosisData;
  cropName: string;
  region: string;
  photos: UploadedPhoto[];
}

export const FarmerGuideView: React.FC<FarmerGuideViewProps> = ({
  diagnosis,
  cropName,
  region,
  photos,
}) => {
  const { photoQuality, analysis, farmerGuide } = diagnosis;

  // Interactive Checklist State
  const initialActions = analysis?.immediateActions || [
    '의심 증상이 나타난 잎이나 열매는 따서 하우스/밭 바깥으로 멀리 버리기',
    '바닥 배수로 정리 및 밭 물고임 방지',
    '시·군 농업기술센터 상담을 통해 등록된 전용 약제 처방 받기'
  ];

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-6 print-area">
      {/* Header Banner */}
      <div className="bg-emerald-800 text-white rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-600 p-2 rounded-lg text-amber-300 font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">
              농업인용 쉬운 안내서
            </span>
            <h3 className="text-lg font-bold text-emerald-50">
              [{region}] {cropName} 현장 진단결과 요약가이드
            </h3>
          </div>
        </div>
        <span className="bg-emerald-700 text-emerald-100 text-xs px-3 py-1 rounded-full font-medium border border-emerald-600">
          쉬운 문장 제공
        </span>
      </div>

      {/* 1. 현재 사진에서 보이는 증상 및 의심 원인 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 보이는 증상 */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>현재 사진에서 보이는 증상</span>
          </h4>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {analysis?.observedSymptoms || '사진 분석 결과를 불러오는 중입니다.'}
          </p>
        </div>

        {/* 의심되는 원인 */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>의심되는 원인</span>
          </h4>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">
              1순위: <span className="text-rose-700">{analysis?.firstPossibility || '분석 중'}</span>
            </p>
            {analysis?.secondPossibility && (
              <p className="text-xs text-slate-600">
                2순위: <span>{analysis.secondPossibility}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. 지금 농가에서 해야 할 일 (인터랙티브 체크리스트) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <span>지금 농가에서 즉시 해야 할 일</span>
          </h4>
          <span className="text-xs text-emerald-700 font-semibold">
            체크하면서 현장 조치하세요
          </span>
        </div>

        <div className="space-y-2.5">
          {initialActions.map((action, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <label
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 shrink-0"
                />
                <span className={`text-sm font-medium leading-relaxed ${isChecked ? 'line-through text-slate-500' : ''}`}>
                  {action}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. 추가로 촬영할 사진 및 전문기관 문의 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 추가 촬영 안내 */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-emerald-600" />
            <span>추가로 촬영하면 좋은 사진</span>
          </h4>
          <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside font-medium">
            {photoQuality.retakeInstructions && photoQuality.retakeInstructions.length > 0 ? (
              photoQuality.retakeInstructions.map((inst, i) => <li key={i}>{inst}</li>)
            ) : (
              <>
                <li>증상 부위 잎의 앞면과 뒷면 접사 사진</li>
                <li>포장 전체 피해 분포를 한눈에 볼 수 있는 넓은 시야 사진</li>
              </>
            )}
          </ul>
        </div>

        {/* 전문기관 문의 필요 여부 */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>전문기관 문의 안내</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {analysis?.expertDiagnosisNeeded === '필요' || analysis?.expertDiagnosisNeeded === '권장'
              ? '가까운 시·군 농업기술센터나 농업 전문가에게 본 결과 화면을 보여주시고 구체적인 현장 진단과 적정 농약 방제 상담을 꼭 받으시기 바랍니다.'
              : '현재 증상은 초기 단계입니다. 추가 확산 여부를 지속 관찰하시고 증상이 심해지면 농업기술센터에 문의하세요.'}
          </p>
        </div>
      </div>

      {/* 전문 쉬운 설명서 텍스트 전체 */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          농업인용 전체 설명서 전문:
        </h4>
        <div className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-200">
          {farmerGuide}
        </div>
      </div>
    </div>
  );
};
