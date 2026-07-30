/**
 * 농작물 AI 현장진단·상담 도우미 타입 정의
 */

export type ShootPart = '잎' | '줄기' | '열매' | '포장 전체';

export interface UploadedPhoto {
  id: string;
  url: string; // Data URL for rendering
  mimeType: string;
  part: ShootPart;
  name: string;
  size: number;
}

export interface AdditionalInfo {
  symptomDate: string; // 증상이 나타난 시기
  weather: string;     // 최근 기상 상황
  notes: string;       // 사용자가 관찰한 특이사항
}

export interface PhotoQuality {
  status: '적합' | '재촬영 필요';
  issues: string[];
  retakeInstructions: string[];
}

export interface AnalysisResult {
  observedSymptoms: string;          // 관찰된 증상
  firstPossibility: string;          // 1순위 의심 원인
  secondPossibility: string;         // 2순위 의심 원인
  evidence: string;                  // 판단 근거
  severity: '낮음' | '보통' | '높음';   // 피해 심각도
  spreadRisk: string;                // 확산 가능성
  additionalChecks: string[];        // 추가 확인사항
  immediateActions: string[];        // 즉시 해야 할 조치
  expertDiagnosisNeeded: '필요' | '권장' | '현재는 불필요'; // 전문기관 진단 필요 여부
  confidence: '높음' | '보통' | '낮음'; // AI 신뢰 수준
}

export interface DiagnosisData {
  photoQuality: PhotoQuality;
  analysis?: AnalysisResult;
  farmerGuide: string;
  staffRecord: string;
}

export interface ConsultationRecord {
  id: string;
  receiptNumber: string;
  createdAt: string;
  cropName: string;
  region: string;
  parts: ShootPart[];
  additionalInfo: AdditionalInfo;
  photos: UploadedPhoto[];
  diagnosis: DiagnosisData;
  staffMemo?: string;
}

export interface SamplePreset {
  id: string;
  title: string;
  cropName: string;
  region: string;
  parts: ShootPart[];
  description: string;
  additionalInfo: AdditionalInfo;
  photos: {
    name: string;
    part: ShootPart;
    url: string;
  }[];
  mockResult?: DiagnosisData;
}
