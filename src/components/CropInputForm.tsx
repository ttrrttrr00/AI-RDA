import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Trash2, Plus, Sparkles, Tag, Calendar, 
  CloudSun, FileText, Check, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { UploadedPhoto, ShootPart, AdditionalInfo, SamplePreset } from '../types';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface CropInputFormProps {
  onSubmit: (formData: {
    cropName: string;
    region: string;
    parts: ShootPart[];
    photos: UploadedPhoto[];
    additionalInfo: AdditionalInfo;
  }) => void;
  isLoading: boolean;
  onLoadPreset: (preset: SamplePreset) => void;
}

const COMMON_CROPS = ['고추', '벼', '사과', '토마토', '오이', '딸기', '마늘', '양파', '배', '감자'];
const COMMON_REGIONS = ['충남 논산시', '경북 안동시', '전남 나주시', '경기 수원시', '강원 평창군', '경남 밀양시'];
const SHOOT_PARTS: ShootPart[] = ['잎', '줄기', '열매', '포장 전체'];
const WEATHER_PRESETS = ['최근 잦은 비와 고온 다습', '장마철 연속 강우', '폭염 및 가뭄', '서리 및 갑작스러운 저온'];

export const CropInputForm: React.FC<CropInputFormProps> = ({ onSubmit, isLoading, onLoadPreset }) => {
  const [cropName, setCropName] = useState('토마토');
  const [region, setRegion] = useState('충남 논산시');
  const [selectedParts, setSelectedParts] = useState<ShootPart[]>(['잎']);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [symptomDate, setSymptomDate] = useState('3~4일 전부터 관찰됨');
  const [weather, setWeather] = useState('최근 잦은 비와 다습한 환경');
  const [notes, setNotes] = useState('잎 뒷면에 먼지 같은 회갈색 반점이 보이며 잎 표면이 노랗게 변색되고 있음');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 촬영 부위 토글
  const togglePart = (part: ShootPart) => {
    if (selectedParts.includes(part)) {
      if (selectedParts.length > 1) {
        setSelectedParts(selectedParts.filter((p) => p !== part));
      }
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  // 이미지 파일 추가 처리
  const handleFileChange = (files: FileList | null) => {
    setErrorMsg(null);
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 4) {
      setErrorMsg('사진은 최대 4장까지 등록할 수 있습니다.');
      return;
    }

    const newPhotos: UploadedPhoto[] = [];
    const ArrayFiles = Array.from(files);

    let processedCount = 0;
    ArrayFiles.forEach((file, idx) => {
      // 이미지 파일 형식 검사
      if (!file.type.startsWith('image/')) {
        setErrorMsg('지원하지 않는 이미지 형식입니다. JPG, PNG, WEBP 등의 이미지 파일만 선택해 주세요.');
        return;
      }

      // 용량 제한 검사 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('이미지 용량이 너무 큽니다. 10MB 이하의 이미지를 등록해 주세요.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        // 촬영 부위 자동 할당 (기본은 첫 번째 선택 부위)
        const partToAssign = selectedParts[idx % selectedParts.length] || '잎';

        newPhotos.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url,
          mimeType: file.type || 'image/jpeg',
          part: partToAssign,
          name: file.name,
          size: file.size,
        });

        processedCount++;
        if (processedCount === ArrayFiles.length) {
          setPhotos((prev) => [...prev, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 이미지 삭제
  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // 개별 사진 촬영 부위 변경
  const updatePhotoPart = (id: string, part: ShootPart) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, part } : p))
    );
  };

  // 예시 샘플 불러오기
  const handleApplyPreset = (preset: SamplePreset) => {
    setErrorMsg(null);
    setCropName(preset.cropName);
    setRegion(preset.region);
    setSelectedParts(preset.parts);
    setSymptomDate(preset.additionalInfo.symptomDate);
    setWeather(preset.additionalInfo.weather);
    setNotes(preset.additionalInfo.notes);

    // 샘플 사진 구성
    const loadedPhotos: UploadedPhoto[] = preset.photos.map((p, i) => ({
      id: `preset-${i}-${Date.now()}`,
      url: p.url,
      mimeType: 'image/jpeg',
      part: p.part,
      name: p.name,
      size: 150000,
    }));
    setPhotos(loadedPhotos);
    onLoadPreset(preset);
  };

  // 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cropName.trim()) {
      setErrorMsg('작물명을 입력해 주세요.');
      return;
    }

    if (!region.trim()) {
      setErrorMsg('재배지역을 입력해 주세요.');
      return;
    }

    if (photos.length === 0) {
      setErrorMsg('농작물 사진을 최소 1장 이상 등록해 주세요.');
      return;
    }

    onSubmit({
      cropName,
      region,
      parts: selectedParts,
      photos,
      additionalInfo: {
        symptomDate,
        weather,
        notes,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* 0. 예시 테스트 프리셋 바 */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 shadow-sm border border-emerald-700">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="font-bold text-base">테스트용 예시 선택 (1-Click 자동입력)</span>
          </div>
          <span className="text-xs text-emerald-200 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700">
            사진 없이 빠른 체험 가능
          </span>
        </div>
        <p className="text-xs text-emerald-100 mb-3">
          아래 예시 버튼을 누르면 작물정보, 샘플 사진, 추가설명이 자동으로 채워집니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-emerald-500/50 flex flex-col items-start gap-1 transition-all text-left shadow-sm hover:shadow"
            >
              <span className="font-bold text-amber-200">{preset.title}</span>
              <span className="text-[11px] text-emerald-100 line-clamp-1">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. 작물명 및 재배지역 입력 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Tag className="w-5 h-5 text-emerald-600" />
            <span>1. 작물 및 재배지역 정보</span>
          </h2>

          {/* 작물명 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              작물명 <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_CROPS.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setCropName(crop)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    cropName === crop
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="직접 입력 (예: 토마토, 샤인머스캣, 고추)"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* 재배지역 선택 */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-slate-700">
              재배지역 <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_REGIONS.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setRegion(reg)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    region === reg
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="시/군/구 입력 (예: 충남 논산시, 전남 나주시)"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* 촬영 부위 선택 */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-slate-700">
              촬영 부위 (복수 선택 가능) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SHOOT_PARTS.map((part) => {
                const isSelected = selectedParts.includes(part);
                return (
                  <button
                    key={part}
                    type="button"
                    onClick={() => togglePart(part)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    <span>{part}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. 농작물 사진 업로드 (최대 4장) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>2. 농작물 사진 업로드</span>
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              {photos.length} / 4장 등록됨
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            선명하고 가까이 찍은 사진일수록 AI 정밀도와 사진 품질 점검 결과가 좋아집니다. (증상 부위, 잎 앞/뒷면, 열매, 포장 전체)
          </p>

          {/* 숨겨진 파일 및 카메라인풋 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            accept="image/*"
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* 업로드 컨트롤 버튼 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= 4}
              className={`p-3.5 rounded-xl border-2 border-dashed font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                photos.length >= 4
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-50/50 border-emerald-400 text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              <Upload className="w-5 h-5 text-emerald-600" />
              <span>갤러리 파일 선택</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={photos.length >= 4}
              className={`p-3.5 rounded-xl border-2 border-dashed font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                photos.length >= 4
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-50/50 border-teal-400 text-teal-800 hover:bg-teal-100/50'
              }`}
            >
              <Camera className="w-5 h-5 text-teal-600" />
              <span>카메라로 direct 촬영</span>
            </button>
          </div>

          {/* 등록된 사진 프리뷰 그리드 */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative group bg-slate-900 rounded-xl overflow-hidden border border-slate-200 aspect-square flex flex-col justify-between shadow-sm"
                >
                  <img
                    src={photo.url}
                    alt={`업로드 사진 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* 상단 순번 및 삭제버튼 */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow transition-transform hover:scale-110"
                      title="사진 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 하단 부위 선택태그 */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/70 p-1 rounded-lg backdrop-blur-sm">
                    <select
                      value={photo.part}
                      onChange={(e) => updatePhotoPart(photo.id, e.target.value as ShootPart)}
                      className="w-full bg-transparent text-white text-[11px] font-medium outline-none cursor-pointer"
                    >
                      {SHOOT_PARTS.map((p) => (
                        <option key={p} value={p} className="text-slate-900">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {/* 4장 미만 시 추가 플레이스홀더 */}
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl aspect-square flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs font-semibold">사진 추가</span>
                </button>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/60">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">등록된 농작물 사진이 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">위의 갤러리 또는 카메라 버튼으로 최대 4장까지 등록하세요.</p>
            </div>
          )}
        </div>

        {/* 3. 추가 설명 입력 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>3. 현장 추가 설명</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 증상 나타난 시기 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>증상이 나타난 시기</span>
              </label>
              <input
                type="text"
                value={symptomDate}
                onChange={(e) => setSymptomDate(e.target.value)}
                placeholder="예: 3일 전부터, 1주일 전"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* 최근 기상 상황 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span>최근 기상 상황</span>
              </label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="예: 장마 후 잦은 비와 고온 다습"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* 기상 상황 빠른 선택 */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {WEATHER_PRESETS.map((wp) => (
              <button
                key={wp}
                type="button"
                onClick={() => setWeather(wp)}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg"
              >
                + {wp}
              </button>
            ))}
          </div>

          {/* 관찰한 특이사항 */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-sm font-bold text-slate-700">
              관찰 특이사항 (사용자 직접 작성)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 잎 뒷면에 흰 가루 같은 무늬가 보이고, 하우스 내 통풍이 다소 부족했습니다."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* 에러 메시지 표시 */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3.5 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>사진 품질 검사 및 AI 증상 분석 시작</span>
        </button>
      </form>
    </div>
  );
};
