import React from 'react';
import { Camera, AlertTriangle, CheckCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { PhotoQuality } from '../types';

interface PhotoQualityCardProps {
  photoQuality: PhotoQuality;
  onRetake: () => void;
}

export const PhotoQualityCard: React.FC<PhotoQualityCardProps> = ({ photoQuality, onRetake }) => {
  const isRetakeNeeded = photoQuality.status === '재촬영 필요';

  return (
    <div
      className={`rounded-2xl p-5 border-2 transition-all shadow-sm ${
        isRetakeNeeded
          ? 'bg-amber-50/90 border-amber-400 text-amber-950'
          : 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl text-white font-bold shrink-0 ${
              isRetakeNeeded ? 'bg-amber-600' : 'bg-emerald-600'
            }`}
          >
            {isRetakeNeeded ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block text-slate-600">
              [3-1 단계] 사진 품질 상태 검사 결과
            </span>
            <h3 className="text-lg font-bold">
              {isRetakeNeeded ? '⚠️ 추가 사진 / 재촬영 권고' : '✅ 사진 품질 적합 (분석 가능)'}
            </h3>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isRetakeNeeded
              ? 'bg-amber-200 text-amber-900 border border-amber-300'
              : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
          }`}
        >
          {photoQuality.status}
        </span>
      </div>

      {/* 품질 검사 상세 이유 및 재촬영 가이드 */}
      {isRetakeNeeded ? (
        <div className="space-y-3 pt-1 border-t border-amber-200/80 mt-2">
          {photoQuality.issues && photoQuality.issues.length > 0 && (
            <div>
              <p className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>감지된 사진 품질 문제점:</span>
              </p>
              <ul className="list-disc list-inside text-xs text-amber-900 space-y-0.5 ml-1 font-medium">
                {photoQuality.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {photoQuality.retakeInstructions && photoQuality.retakeInstructions.length > 0 && (
            <div className="bg-white/80 p-3.5 rounded-xl border border-amber-300/80">
              <p className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1">
                <Camera className="w-4 h-4 text-amber-700" />
                <span>구체적인 재촬영 / 추가 안내:</span>
              </p>
              <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                {photoQuality.retakeInstructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>사진 다시 촬영 및 보강하기</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-emerald-800 font-medium pt-1">
          사진의 초점, 밝기, 증상 부위 크기가 정밀 분석에 적합합니다. 아래 3-2 단계 분석 결과를 확인하세요.
        </p>
      )}
    </div>
  );
};
