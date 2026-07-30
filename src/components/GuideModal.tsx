import React from 'react';
import { BookOpen, Key, Cpu, Terminal, CheckCircle2, FileCode2 } from 'lucide-react';

export const GuideModal: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="bg-emerald-600 text-white p-2 rounded-xl">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">시스템 개발 및 설정 가이드</h3>
          <p className="text-xs text-slate-500">Gemini API 연동, 모델 교체 및 로컬 실행 안내</p>
        </div>
      </div>

      {/* Guide Item 1: API Key Location */}
      <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-2">
        <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-700" />
          <span>1. Gemini API 키 설정 위치</span>
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          본 웹앱은 보안을 위해 클라이언트가 아닌 서버 측(<code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono">server.ts</code>)에서 Gemini API를 안전하게 호출합니다.
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-medium pl-1">
          <li><strong>AI Studio 환경:</strong> 상단/좌측 메뉴의 <b>Secrets Panel</b>에서 <code className="bg-slate-200 px-1 py-0.5 rounded">GEMINI_API_KEY</code>를 등록합니다.</li>
          <li><strong>로컬 개발 환경:</strong> 프로젝트 루트에 <code className="bg-slate-200 px-1 py-0.5 rounded">.env</code> 파일을 작성하고 <code className="bg-slate-200 px-1 py-0.5 rounded">GEMINI_API_KEY="내_API_KEY"</code>를 지정합니다.</li>
        </ul>
      </div>

      {/* Guide Item 2: Model Name Change Location */}
      <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-2">
        <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-700" />
          <span>2. Gemini 사용 모델 변경 위치</span>
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">/server.ts</code> 파일 상단에 정의된 상수를 변경하여 원하는 모델로 교체할 수 있습니다.
        </p>
        <div className="bg-slate-900 text-amber-300 p-3 rounded-lg font-mono text-xs overflow-x-auto">
          {`// server.ts 상단
const GEMINI_MODEL = "gemini-3.6-flash"; // 또는 "gemini-3.1-pro-preview"`}
        </div>
      </div>

      {/* Guide Item 3: Local Execution Instructions */}
      <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 space-y-2">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-700" />
          <span>3. 초보자를 위한 로컬 실행 방법</span>
        </h4>
        <div className="space-y-1 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200 font-mono">
            <span className="text-emerald-700 font-bold">$</span>
            <span>npm install</span>
            <span className="text-slate-400 font-sans ml-auto text-[11px]">(패키지 설치)</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200 font-mono">
            <span className="text-emerald-700 font-bold">$</span>
            <span>npm run dev</span>
            <span className="text-slate-400 font-sans ml-auto text-[11px]">(개발 서버 실행: port 3000)</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200 font-mono">
            <span className="text-emerald-700 font-bold">$</span>
            <span>npm run build</span>
            <span className="text-slate-400 font-sans ml-auto text-[11px]">(운영용 번들 빌드)</span>
          </div>
        </div>
      </div>

      {/* Guide Item 4: Principles */}
      <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-white">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>핵심 설계 및 제약 준수</span>
        </h4>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>농약 상표 제품명, 희석배수, 정확한 살포량은 AI가 임의로 직접 추천하지 않도록 엄격히 차단되어 있습니다.</li>
          <li>일관된 결과 출력을 위해 Gemini JSON Mode 및 responseSchema를 사용하여 구조화된 응답을 보장합니다.</li>
          <li>사진 품질 불충분 시(초점 흐림, 각도 부적합 등) 억지 진단을 방지하고 재촬영 안내를 우위 출력합니다.</li>
        </ul>
      </div>
    </div>
  );
};
