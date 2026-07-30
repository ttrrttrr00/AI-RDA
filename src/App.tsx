import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NoticeBanner } from './components/NoticeBanner';
import { StepIndicator } from './components/StepIndicator';
import { CropInputForm } from './components/CropInputForm';
import { LoadingView } from './components/LoadingView';
import { PhotoQualityCard } from './components/PhotoQualityCard';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { FarmerGuideView } from './components/FarmerGuideView';
import { StaffRecordView } from './components/StaffRecordView';
import { ResultActions } from './components/ResultActions';
import { HistoryModal } from './components/HistoryModal';
import { GuideModal } from './components/GuideModal';

import { 
  ConsultationRecord, UploadedPhoto, ShootPart, 
  AdditionalInfo, DiagnosisData, SamplePreset 
} from './types';

const STORAGE_KEY = 'crop_ai_consultation_history_v1';

export default function App() {

  const [currentTab, setCurrentTab] = useState<'diagnose' | 'history' | 'guide'>('diagnose');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 현재 진단 진행 데이터
  const [currentRecord, setCurrentRecord] = useState<ConsultationRecord | null>(null);
  const [resultView, setResultView] = useState<'farmer' | 'staff'>('farmer');

  // 상담 내역 보관
  const [historyRecords, setHistoryRecords] = useState<ConsultationRecord[]>([]);

  // LocalStorage 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistoryRecords(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // LocalStorage 저장
  const saveRecordToHistory = (record: ConsultationRecord) => {
    setHistoryRecords((prev) => {
      // 중복 체크 및 업데이트
      const existsIndex = prev.findIndex((r) => r.id === record.id);
      let updated: ConsultationRecord[];
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = record;
      } else {
        updated = [record, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  // 기록 전체 삭제
  const handleClearHistory = () => {
    if (window.confirm('저장된 모든 현장 상담 기록을 삭제하시겠습니까?')) {
      setHistoryRecords([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // 개별 기록 삭제
  const handleDeleteRecord = (id: string) => {
    setHistoryRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  // 예시 테스트 샘플 적용 시
  const handleLoadPreset = (preset: SamplePreset) => {
    setApiError(null);
  };

  // 백엔드 API 호출 진단 실행
  const handleDiagnose = async (formData: {
    cropName: string;
    region: string;
    parts: ShootPart[];
    photos: UploadedPhoto[];
    additionalInfo: AdditionalInfo;
  }) => {
    setApiError(null);
    setIsLoading(true);
    setCurrentStep(3); // 품질 및 증상 분석 단계

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `REG-${dateStr}-${randNum}`;
    const createdAt = now.toLocaleString('ko-KR');

    // 예시 샘플 기반으로 즉시 시뮬레이션 응답을 원할 때 처리
    const firstPhoto = formData.photos[0];
    if (firstPhoto && firstPhoto.id.startsWith('preset-')) {
      // 미리 정의된 목업 응답 사용
      setTimeout(() => {
        const matchingPreset = presetMockResult(formData.cropName);
        const record: ConsultationRecord = {
          id: `rec-${Date.now()}`,
          receiptNumber,
          createdAt,
          cropName: formData.cropName,
          region: formData.region,
          parts: formData.parts,
          additionalInfo: formData.additionalInfo,
          photos: formData.photos,
          diagnosis: matchingPreset,
        };
        setCurrentRecord(record);
        saveRecordToHistory(record);
        setIsLoading(false);
        setCurrentStep(4);
      }, 1500);
      return;
    }

    try {
      // 이미지 payload 가공 (Base64 data)
      const imagesPayload = formData.photos.map((p) => ({
        data: p.url,
        mimeType: p.mimeType,
        label: p.part,
      }));

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: formData.cropName,
          region: formData.region,
          parts: formData.parts,
          images: imagesPayload,
          additionalInfo: formData.additionalInfo,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'AI 분석 호출에 실패했습니다.');
      }

      const diagnosisData: DiagnosisData = json.data;

      const record: ConsultationRecord = {
        id: `rec-${Date.now()}`,
        receiptNumber,
        createdAt,
        cropName: formData.cropName,
        region: formData.region,
        parts: formData.parts,
        additionalInfo: formData.additionalInfo,
        photos: formData.photos,
        diagnosis: diagnosisData,
      };

      setCurrentRecord(record);
      saveRecordToHistory(record);
      setCurrentStep(4);
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setApiError(
        err.message ||
          '서버 연결 중 오류가 발생했습니다. API 키 및 인터넷 연결을 확인해 주세요.'
      );
      // 에러 발생시 예시 목업 결과 제공 옵션 제시
    } finally {
      setIsLoading(false);
    }
  };

  // 에러 시 대체 목업 결과로 시뮬레이션 시작 버튼
  const handleUseFallbackMock = () => {
    if (!currentRecord) return;
    setIsLoading(true);
    setApiError(null);
    setTimeout(() => {
      const mockDiagnosis = presetMockResult('토마토');
      const updated = {
        ...currentRecord,
        diagnosis: mockDiagnosis,
      };
      setCurrentRecord(updated);
      saveRecordToHistory(updated);
      setIsLoading(false);
      setCurrentStep(4);
    }, 1000);
  };

  // 초기화
  const handleReset = () => {
    setCurrentRecord(null);
    setCurrentStep(1);
    setApiError(null);
  };

  // 과거 기록 열람
  const handleSelectHistoryRecord = (record: ConsultationRecord) => {
    setCurrentRecord(record);
    setCurrentStep(4);
    setCurrentTab('diagnose');
  };

  // 담당자 메모 수정
  const handleSaveMemo = (memo: string) => {
    if (!currentRecord) return;
    const updatedRecord = {
      ...currentRecord,
      staffMemo: memo,
    };
    setCurrentRecord(updatedRecord);
    saveRecordToHistory(updatedRecord);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf7] text-slate-900 font-sans">
      {/* 1. Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        historyCount={historyRecords.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* Mandatory Notice Banner */}
        <NoticeBanner />

        {/* Tab 1: 진단하기 (Main Workflow) */}
        {currentTab === 'diagnose' && (
          <div className="space-y-4">
            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* Error Banner */}
            {apiError && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950 space-y-3">
                <div className="font-bold text-base flex items-center gap-2 text-rose-900">
                  <span>⚠️ AI 분석 호출 오류가 발생했습니다</span>
                </div>
                <p className="text-sm font-medium">{apiError}</p>
                <p className="text-xs text-rose-800">
                  ※ Secrets 설정에서 <code className="bg-rose-200 px-1 py-0.5 rounded">GEMINI_API_KEY</code>를 등록해 주시거나 아래 시뮬레이션 결과로 체험할 수 있습니다.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-bold shadow"
                  >
                    양식으로 돌아가기
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 & 2: Crop Input Form */}
            {!isLoading && currentStep < 3 && (
              <CropInputForm
                onSubmit={handleDiagnose}
                isLoading={isLoading}
                onLoadPreset={handleLoadPreset}
              />
            )}

            {/* Step 3: Loading View */}
            {isLoading && <LoadingView />}

            {/* Step 4: Analysis Results Display */}
            {!isLoading && currentStep === 4 && currentRecord && (
              <div className="space-y-6">
                {/* 3-1. Photo Quality Card */}
                <PhotoQualityCard
                  photoQuality={currentRecord.diagnosis.photoQuality}
                  onRetake={handleReset}
                />

                {/* 3-2. Detailed Analysis Results (Only if quality is OK) */}
                {currentRecord.diagnosis.analysis && (
                  <AnalysisResultCard
                    analysis={currentRecord.diagnosis.analysis}
                  />
                )}

                {/* Document View Switcher Actions Bar */}
                <ResultActions
                  activeView={resultView}
                  onSelectView={setResultView}
                  farmerGuideText={currentRecord.diagnosis.farmerGuide}
                  staffRecordText={currentRecord.diagnosis.staffRecord}
                  onReset={handleReset}
                />

                {/* Active Document View (Farmer Guide OR Staff Record) */}
                {resultView === 'farmer' ? (
                  <FarmerGuideView
                    diagnosis={currentRecord.diagnosis}
                    cropName={currentRecord.cropName}
                    region={currentRecord.region}
                    photos={currentRecord.photos}
                  />
                ) : (
                  <StaffRecordView
                    receiptNumber={currentRecord.receiptNumber}
                    createdAt={currentRecord.createdAt}
                    cropName={currentRecord.cropName}
                    region={currentRecord.region}
                    parts={currentRecord.parts}
                    additionalInfo={currentRecord.additionalInfo}
                    diagnosis={currentRecord.diagnosis}
                    initialMemo={currentRecord.staffMemo}
                    onSaveMemo={handleSaveMemo}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 상담내역 (Consultation History) */}
        {currentTab === 'history' && (
          <HistoryModal
            records={historyRecords}
            onSelectRecord={handleSelectHistoryRecord}
            onClearHistory={handleClearHistory}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {/* Tab 3: 개발 및 시스템 이용 가이드 */}
        {currentTab === 'guide' && <GuideModal />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800 no-print">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-300">
            농작물 AI 현장진단·상담 도우미 (Crop AI Field Consultation Assistant)
          </p>
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto">
            본 웹앱은 사진 접수 품질 향상과 현장 초기 상담기록 작성을 지원하기 위한 AI 참고 도구입니다. 
            병원체 확정 진단 및 약제 사용 처방은 반드시 시·군 농업기술센터 또는 전문 기관을 통해 최종 결정하시기 바랍니다.
          </p>
          <p className="text-[10px] text-slate-600">
            Powered by Google Gemini 3.6 Flash & React
          </p>
        </div>
      </footer>
    </div>
  );
}

// 목업 백업 데이터 생성 함수
function presetMockResult(cropName: string): DiagnosisData {
  return {
    photoQuality: {
      status: '적합',
      issues: [],
      retakeInstructions: []
    },
    analysis: {
      observedSymptoms: `${cropName} 잎 및 열매 부위에 반점과 초기 변색 증상이 관찰됨.`,
      firstPossibility: `${cropName} 주요 곰팡이성 병해 (추정)`,
      secondPossibility: '영양 불균형 및 수분 스트레스',
      evidence: '반점의 윤구 구조 및 시설 내 기상 조건 종합 고려',
      severity: '보통',
      spreadRisk: '고온 다습 조건 지속 시 주변 포기로 신속 확산 위험',
      additionalChecks: ['하우스 내 환기 상태 및 습도 유무', '인근 개체 병반 확산 여부'],
      immediateActions: [
        '병든 부위는 발견 즉시 수거하여 밀폐 봉투로 외부에 배출',
        '포장 환기를 강화하여 상대습도 감소시키기',
        '농업기술센터 상담 후 등록 약제 살포'
      ],
      expertDiagnosisNeeded: '권장',
      confidence: '높음'
    },
    farmerGuide: `[농업인용 쉬운 안내서]
현재 사진상으로 ${cropName}의 초기 병해 증상이 의심됩니다.

1. 병든 잎이나 열매는 보이는 즉시 따서 밭 밖으로 멀리 버려주세요.
2. 밭이나 하우스 안이 습하지 않도록 바람이 잘 통하게 환기해 주세요.
3. 가까운 농업기술센터를 방문하시어 정확한 약제를 처방받으세요.`,
    staffRecord: `[담당자용 상담기록]
- 작물명: ${cropName}
- 관찰증상: 병반 반점 및 잎 변색
- 의심원인 1순위: 주요 병해충 추정 (확정진단 아님)
- 조치권고: 이병엽 즉시 제거, 통풍 배수 관리, 농업기술센터 지도 요청`
  };
}
