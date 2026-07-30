import { SamplePreset } from '../types';

// SVG 기반 고화질 샘플 이미지 생성 함수 (외부 네트워크 dependency 없이 즉시 렌더링 가능)
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// 1. 토마토 잎곰팡이병 샘플 이미지
const tomatoLeafSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#2d422a"/>
  <!-- Leaf Base -->
  <path d="M 200,30 C 100,80 50,200 200,270 C 350,200 300,80 200,30 Z" fill="#4a7c41" stroke="#375a30" stroke-width="3"/>
  <!-- Veins -->
  <path d="M 200,30 L 200,270 M 200,90 L 120,130 M 200,90 L 280,130 M 200,150 L 100,200 M 200,150 L 300,200" stroke="#689f5d" stroke-width="2.5" fill="none"/>
  <!-- Disease Mold Spots (회갈색 반점) -->
  <circle cx="160" cy="110" r="18" fill="#8c775d" opacity="0.85"/>
  <circle cx="160" cy="110" r="10" fill="#544434"/>
  <circle cx="230" cy="160" r="22" fill="#8c775d" opacity="0.9"/>
  <circle cx="230" cy="160" r="14" fill="#4d3e2f"/>
  <circle cx="170" cy="210" r="15" fill="#7a6750" opacity="0.8"/>
  <circle cx="250" cy="100" r="12" fill="#8c775d" opacity="0.8"/>
  <text x="20" y="280" font-family="sans-serif" font-size="14" fill="#ffffff" font-weight="bold">[샘플 이미지] 토마토 잎 뒷면 반점</text>
</svg>
`);

// 2. 고추 탄저병 샘플 이미지
const pepperAnthracnoseSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#1e2c1c"/>
  <!-- Pepper Fruit -->
  <path d="M 120,40 C 220,30 280,120 250,240 C 240,280 210,280 200,270 C 180,240 120,120 120,40 Z" fill="#cc2218" stroke="#8c120b" stroke-width="4"/>
  <path d="M 120,40 L 110,15" stroke="#387a2d" stroke-width="6" stroke-linecap="round"/>
  <!-- Anthracnose Sunken Lesions (움푹 패인 갈색 병반) -->
  <ellipse cx="190" cy="120" rx="20" ry="14" fill="#592e19" stroke="#33170b" stroke-width="3"/>
  <ellipse cx="190" cy="120" rx="12" ry="8" fill="#240e05"/>
  <ellipse cx="210" cy="180" rx="25" ry="18" fill="#592e19" stroke="#33170b" stroke-width="3"/>
  <ellipse cx="210" cy="180" rx="16" ry="10" fill="#240e05"/>
  <text x="20" y="280" font-family="sans-serif" font-size="14" fill="#ffffff" font-weight="bold">[샘플 이미지] 고추 열매 원형 패임 병반</text>
</svg>
`);

// 3. 벼 도열병 샘플 이미지
const riceBlastSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#293b22"/>
  <!-- Rice Leaves -->
  <path d="M 50,290 C 100,180 180,80 350,20 L 370,30 C 200,100 120,200 70,300 Z" fill="#69a349" stroke="#487530" stroke-width="2"/>
  <path d="M 20,250 C 120,150 220,100 380,80 L 390,95 C 230,120 130,170 30,270 Z" fill="#7dbd5a" stroke="#528239" stroke-width="2"/>
  <!-- Spindle Lesions (방추형 병반) -->
  <path d="M 170,130 Q 195,115 220,130 Q 195,145 170,130 Z" fill="#a89274" stroke="#52391b" stroke-width="2"/>
  <path d="M 185,130 Q 195,123 205,130 Q 195,137 185,130 Z" fill="#423425"/>
  <path d="M 230,180 Q 250,168 270,180 Q 250,192 230,180 Z" fill="#a89274" stroke="#52391b" stroke-width="2"/>
  <text x="20" y="280" font-family="sans-serif" font-size="14" fill="#ffffff" font-weight="bold">[샘플 이미지] 벼 잎 방추형 병반</text>
</svg>
`);

// 4. 흐린 사진 (재촬영 필요 검사 테스트)
const blurryPhotoSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <filter id="blur">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>
  <rect width="400" height="300" fill="#3a4038"/>
  <g filter="url(#blur)">
    <circle cx="200" cy="150" r="100" fill="#66825c"/>
    <circle cx="180" cy="130" r="30" fill="#8c563f"/>
    <circle cx="220" cy="170" r="40" fill="#a39049"/>
  </g>
  <rect x="30" y="230" width="340" height="45" fill="rgba(0,0,0,0.7)" rx="8"/>
  <text x="45" y="258" font-family="sans-serif" font-size="15" fill="#ff7a7a" font-weight="bold">⚠️ 초점이 심하게 흔들린 흐린 샘플 사진</text>
</svg>
`);

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'sample-tomato-mold',
    title: '🍅 토마토 잎곰팡이병 예시',
    cropName: '토마토',
    region: '충남 논산시',
    parts: ['잎'],
    description: '잎 뒷면에 회갈색 곰팡이 반점이 발생하여 사진 품질 검사 및 의심 증상 분석 테스트',
    additionalInfo: {
      symptomDate: '4일 전부터 관찰됨',
      weather: '최근 잦은 비로 시설 하우스 내부 습도가 매우 높았음',
      notes: '잎 뒷면에 먼지 같은 회갈색 반점이 보이고 잎 표면이 노랗게 변함'
    },
    photos: [
      {
        name: '토마토_잎_뒷면_근접.jpg',
        part: '잎',
        url: tomatoLeafSvg
      }
    ],
    mockResult: {
      photoQuality: {
        status: '적합',
        issues: [],
        retakeInstructions: []
      },
      analysis: {
        observedSymptoms: '잎 뒷면에서 회갈색의 모자이크형 곰팡이 반점이 포착되며 잎 앞면은 연노란색으로 변색됨.',
        firstPossibility: '토마토 잎곰팡이병 (Passalora fulva)',
        secondPossibility: '영양결핍 (마그네슘 또는 칼륨 부족)',
        evidence: '잎 뒷면에 특이적으로 나타나는 회갈색 포자 형성 및 습도 높은 시설 환경 병력',
        severity: '보통',
        spreadRisk: '하우스 내 다습 조건 지속 시 인근 토마토 개체로 신속 확산 가능',
        additionalChecks: ['시설 하우스 내부 환기 상태 및 측창 개폐 유무', '인근 주 개체의 잎 뒷면 감염 여부'],
        immediateActions: [
          '감염 증상이 심한 하엽(아래쪽 잎)은 따서 밀폐 봉투에 담아 하우스 밖으로 배출',
          '주간 환기 및 야간 난방·제습을 통해 하우스 내부 상대습도 낮추기',
          '농업기술센터와 상담하여 등록된 전용 약제를 적기 살포'
        ],
        expertDiagnosisNeeded: '권장',
        confidence: '높음'
      },
      farmerGuide: `[농업인용 쉬운 가이드]
현재 제출하신 사진에서는 토마토 잎곰팡이병 초기 증상이 높게 의심됩니다.

■ 보이기 시작한 증상:
잎 뒷면에 회갈색의 부드러운 곰팡이가 생기고 있으며, 잎 표면이 노랗게 변하고 있습니다. 이는 환기가 잘 되지 않고 습기가 많은 하우스에서 자주 발생합니다.

■ 지금 즉시 하실 일:
1. 병든 아래쪽 잎은 발견 즉시 따서 하우스 바깥으로 멀리 버려주세요. (전염 방지)
2. 하우스 천창과 측창을 열어 바람이 잘 통하게 제습해 주세요.
3. 가까운 농업기술센터를 방문하시거나 이 화면을 보여주시고 약제 처방을 받으세요.`,
      staffRecord: `[담당자용 상담기록]
- 접수일시: ${new Date().toLocaleString('ko-KR')}
- 작물명: 토마토 | 재배지역: 충남 논산시 | 촬영부위: 잎
- 관찰증상: 잎 뒷면 회갈색 포자층 형성 및 잎 상단 황화 현상
- 의심원인 1순위: 토마토 잎곰팡이병 (확정진단 아님)
- 의심원인 2순위: 영양결핍 (마그네슘 결핍)
- 판단근거: 잎 뒷면 회갈색 반점 양상 및 다습한 시설 하우스 기상 조건
- 피해 심각도: 보통 | 확산 가능성: 높음 | AI 신뢰 수준: 높음
- 조치권고: 이병엽 제거 지도, 제습 환기 조치, 농업기술센터 약제 지도 안내`
    }
  },
  {
    id: 'sample-pepper-anthracnose',
    title: '🌶️ 고추 탄저병 예시',
    cropName: '고추',
    region: '경북 안동시',
    parts: ['열매', '잎'],
    description: '고추 열매 표면에 움푹 패인 원형 갈색 반점 테스트',
    additionalInfo: {
      symptomDate: '약 1주일 전 장마 이후',
      weather: '장마철 연속 강우 및 폭염 반복',
      notes: '붉게 익어가는 고추 열매에 물반점 같은 패인 자국이 급격히 늘어남'
    },
    photos: [
      {
        name: '고추_열매_탄저병반.jpg',
        part: '열매',
        url: pepperAnthracnoseSvg
      }
    ],
    mockResult: {
      photoQuality: {
        status: '적합',
        issues: [],
        retakeInstructions: []
      },
      analysis: {
        observedSymptoms: '고추 열매 표면에 원형의 움푹 패인 암갈색 반점이 관찰되며 겹무늬 형태를 띰.',
        firstPossibility: '고추 탄저병 (Colletotrichum species)',
        secondPossibility: '열과 및 세균성반점병',
        evidence: '열매에 특이적인 오목한 윤문(동그란 겹무늬) 병반과 장마철 기상 조건',
        severity: '높음',
        spreadRisk: '빗물 및 흙탕물 튀김으로 포장 전체로 매우 신속히 확산될 수 있음',
        additionalChecks: ['배수로 정비 상태 및 물고임 유무', '바닥 멀칭 비닐 손상 여부'],
        immediateActions: [
          '병든 고추 열매는 보이는 즉시 수거하여 밭 밖으로 멀리 폐기',
          '비 오기 전후 농업기술센터 지침에 따른 탄저병 등록 방제제 처리',
          '고추 포기 사이 통풍 확보 및 하단 가지 정돈'
        ],
        expertDiagnosisNeeded: '필요',
        confidence: '높음'
      },
      farmerGuide: `[농업인용 쉬운 가이드]
제출하신 사진 분석 결과, 고추 탄저병 가능성이 강하게 의심됩니다.

■ 현재 증상:
고추 열매에 오목하게 들어간 갈색 동그란 자국이 보입니다. 비가 온 후 빗물에 곰팡이 포자가 튀면서 전염됩니다.

■ 지금 바로 해야 할 조치:
1. 자국이 있는 병든 고추는 발견 즉시 따서 밭 밖으로 멀리 버려주세요.
2. 밭 바닥에 물이 고이지 않게 물길(배수로)을 깊게 파주세요.
3. 시군 농업기술센터에 문의하시어 올바른 방제 약제를 처방받으세요.`,
      staffRecord: `[담당자용 상담기록]
- 접수일시: ${new Date().toLocaleString('ko-KR')}
- 작물명: 고추 | 재배지역: 경북 안동시 | 촬영부위: 열매, 잎
- 관찰증상: 열매 표면 윤문상의 오목한 암갈색 병반
- 의심원인 1순위: 고추 탄저병 (확정진단 아님)
- 의심원인 2순위: 세균성반점병 또는 열과
- 판단근거: 열매 오목 윤문 병반 및 강우 후 발생 이력
- 피해 심각도: 높음 | 확산 가능성: 매우 높음 | AI 신뢰 수준: 높음
- 조치권고: 이병과 즉시 밭 외 수거 소각, 배수로 정비, 전용 방제 약제 교체 살포 지도`
    }
  },
  {
    id: 'sample-blurry-photo',
    title: '⚠️ 사진 품질 부족 (재촬영 필요 테스트)',
    cropName: '딸기',
    region: '전남 담양군',
    parts: ['잎'],
    description: '초점이 흔들리거나 흐린 사진 제출 시 사진 품질 검사(재촬영 안내) 우선 표시 작동 테스트',
    additionalInfo: {
      symptomDate: '어제부터',
      weather: '흐림',
      notes: '스마트폰 카메라 초점이 안 맞아서 약간 흐리게 촬영됨'
    },
    photos: [
      {
        name: '흐린_사진_샘플.jpg',
        part: '잎',
        url: blurryPhotoSvg
      }
    ],
    mockResult: {
      photoQuality: {
        status: '재촬영 필요',
        issues: [
          '사진의 초점이 크게 흔들려 병반의 미세한 윤곽 및 구조 판독 불가',
          '조명이 다소 어둡고 증상 부위가 확대되지 않음'
        ],
        retakeInstructions: [
          '“증상 부위가 흐리므로 카메라 초점을 화면에서 손으로 터치하여 맞춘 후 다시 촬영해 주세요.”',
          '“밝은 자연광에서 병반 부위가 잘 보이도록 가까이 근접 촬영해 주세요.”',
          '“잎 앞면과 잎 뒷면의 상태를 각각 선명하게 추가 촬영해 주세요.”'
        ]
      },
      farmerGuide: `[사진 재촬영 안내]
현재 제출해주신 사진은 초점이 흐려서 정확한 농작물 병해충 판독이 어렵습니다.
억지로 잘못된 결과를 안내해 드리는 것을 방지하기 위해 재촬영을 요청해 드립니다.

📸 촬영 팁:
1. 스마트폰 화면에서 잎의 상처 부위를 손으로 터치하여 초점을 맞춘 후 촬영해 주세요.
2. 잎 뒷면을 가까이 밝은 곳에서 촬영해 주세요.`,
      staffRecord: `[담당자용 상담기록]
- 접수일시: ${new Date().toLocaleString('ko-KR')}
- 작물명: 딸기 | 재배지역: 전남 담양군 | 촬영부위: 잎
- 상태: 사진 품질 불충분 (재촬영 요청 상태)
- 사유: 카메라 블러 및 병반 구조 불명확
- 조치: 농가에 접사 초점 맞춘 재촬영 안내 발송`
    }
  }
];
