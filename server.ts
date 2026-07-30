import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// 대용량 이미지 Base64 업로드를 위한 payload 제한 확장
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/**
 * =========================================================================
 * Gemini 모델 및 API 키 설정 위치 안내 (초보자 가이드)
 * =========================================================================
 * 1. API 키 설정 위치:
 *    - process.env.GEMINI_API_KEY 변수에서 자동으로 읽어옵니다.
 *    - AI Studio 환경에서는 Settings -> Secrets 메뉴에서 GEMINI_API_KEY를 설정합니다.
 *    - 로컬 개발 환경에서는 프로젝트 루트의 .env 파일에 GEMINI_API_KEY=내키값 형식으로 등록합니다.
 *
 * 2. Gemini 모델명 변경 위치:
 *    - 아래의 GEMINI_MODEL 상수의 값을 변경하면 사용 모델을 쉽게 교체할 수 있습니다.
 *    - 예: 'gemini-3.6-flash', 'gemini-3.1-pro-preview' 등
 * =========================================================================
 */
const GEMINI_MODEL = "gemini-3.6-flash";

// 헬스체크 엔드포인트
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: GEMINI_MODEL, hasApiKey: !!process.env.GEMINI_API_KEY });
});

// 농작물 AI 진단 API 엔드포인트
app.post("/api/diagnose", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "API_KEY_MISSING",
        message: "Gemini API 키가 설정되지 않았습니다. AI Studio 비밀번호(Secrets) 설정 또는 .env 파일에서 GEMINI_API_KEY를 지정해 주세요."
      });
    }

    const { cropName, region, parts, images, additionalInfo } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        error: "NO_IMAGES",
        message: "분석할 농작물 사진을 최소 1장 이상 업로드해 주세요."
      });
    }

    // GoogleGenAI 클라이언트 초기화 (서버 전용)
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    // 이미지 파트 변환
    const imageParts = images.map((img: { data: string; mimeType: string; label?: string }) => {
      // base64 prefix 처리
      let cleanData = img.data;
      if (cleanData.includes(",")) {
        cleanData = cleanData.split(",")[1];
      }
      return {
        inlineData: {
          mimeType: img.mimeType || "image/jpeg",
          data: cleanData
        }
      };
    });

    // 시스템 및 프롬프트 작성
    const systemInstruction = `당신은 대한민국 농림축산식품부 및 농업기술센터 지원용 "농작물 AI 현장진단·상담 도우미" 전문가 AI입니다.
당신의 임무는 업로드된 농작물 사진의 촬영 품질을 점검하고, 선명한 사진인 경우 관찰 가능한 증상과 의심 원인을 분석하여 현장 상담기록을 작성하는 것입니다.

[필수 요구사항 및 규칙]
1. 사진 품질 검사 (photoQuality):
   - 사진이 흐린지(초점), 농작물이 작게 찍혔는지, 너무 밝거나 어두운지, 증상 부위가 잘 보이는지 검사합니다.
   - 품질이 부족하거나 초점이 맞지 않은 경우 status를 "재촬영 필요"로 설정하고 구체적인 재촬영 지침(retakeInstructions)을 작성하세요.
   - 사진 품질이 부족할 경우, 진단 결과(analysis)는 억지로 확정하지 말고 재촬영 안내 위주로 작성하세요.

2. 증상 분석 (analysis):
   - 사진 품질이 적합한 경우에만 꼼꼼히 분석합니다.
   - 절대 확정적인 진단으로 표현하지 마세요. "1순위 의심", "2순위 의심" 형태로 가능성 단위로 표현하세요.
   - 의심 원인 범주: 병해, 해충, 바이러스, 영양결핍, 수분 스트레스, 고온·저온 피해, 약해, 기타 생리장해.
   - 피해 심각도(severity)는 반드시 "낮음", "보통", "높음" 중 하나여야 합니다.
   - AI 신뢰 수준(confidence)은 반드시 "높음", "보통", "낮음" 중 하나여야 합니다.
   - 전문기관 진단 필요 여부(expertDiagnosisNeeded)는 반드시 "필요", "권장", "현재는 불필요" 중 하나여야 합니다.

3. 농약 추천 금지 규칙 (엄격 준수):
   - 특정 농약 상표 제품명, 화학 살포 희석배수, 정확한 헥타르당 살포량 등을 임의로 추천하거나 제시하지 마세요.
   - 방제나 약제 사용은 반드시 "농업기술센터 또는 전문가 상담 후 등록 약제 사용 권장"으로 제시하세요.

4. 필수 주의문구 포함:
   - 모든 가이드와 기록에는 "본 결과는 사진을 기반으로 한 AI 참고 분석이며 실제 병원체 검사나 전문가 진단을 대체하지 않습니다"라는 취지가 반영되어야 합니다.`;

    const promptText = `다음 농가 접수 정보를 바탕으로 농작물 사진을 분석해 주세요.

[접수 정보]
- 작물명: ${cropName || "미지정"}
- 재배지역: ${region || "미지정"}
- 촬영 부위: ${Array.isArray(parts) ? parts.join(", ") : parts || "미지정"}
- 증상 나타난 시기: ${additionalInfo?.symptomDate || "미상"}
- 최근 기상 상황: ${additionalInfo?.weather || "특이사항 없음"}
- 사용자가 관찰한 특이사항: ${additionalInfo?.notes || "없음"}

위 이미지들과 접수 정보를 종합하여 지정된 JSON 구조로 정확히 응답하세요.`;

    const contents = {
      parts: [
        ...imageParts,
        { text: promptText }
      ]
    };

    // 구조화된 JSON 응답 스키마 설정
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        photoQuality: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "'적합' 또는 '재촬영 필요'" },
            issues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "품질 이슈 목록"
            },
            retakeInstructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "재촬영 안내 문구 목록"
            }
          },
          required: ["status", "issues", "retakeInstructions"]
        },
        analysis: {
          type: Type.OBJECT,
          properties: {
            observedSymptoms: { type: Type.STRING, description: "관찰된 증상 설명" },
            firstPossibility: { type: Type.STRING, description: "1순위 의심 원인" },
            secondPossibility: { type: Type.STRING, description: "2순위 의심 원인" },
            evidence: { type: Type.STRING, description: "판단 근거" },
            severity: { type: Type.STRING, description: "'낮음' 또는 '보통' 또는 '높음'" },
            spreadRisk: { type: Type.STRING, description: "확산 가능성 설명" },
            additionalChecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "추가 확인사항"
            },
            immediateActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "즉시 해야 할 조치"
            },
            expertDiagnosisNeeded: { type: Type.STRING, description: "'필요' 또는 '권장' 또는 '현재는 불필요'" },
            confidence: { type: Type.STRING, description: "'높음' 또는 '보통' 또는 '낮음'" }
          },
          required: [
            "observedSymptoms",
            "firstPossibility",
            "secondPossibility",
            "evidence",
            "severity",
            "spreadRisk",
            "additionalChecks",
            "immediateActions",
            "expertDiagnosisNeeded",
            "confidence"
          ]
        },
        farmerGuide: { type: Type.STRING, description: "농업인을 위한 쉬운 설명서" },
        staffRecord: { type: Type.STRING, description: "담당자용 상담기록 보고서" }
      },
      required: ["photoQuality", "farmerGuide", "staffRecord"]
    };

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      return res.status(500).json({
        error: "EMPTY_RESPONSE",
        message: "Gemini API로부터 빈 응답을 받았습니다."
      });
    }

    try {
      const parsedData = JSON.parse(jsonText);
      return res.json({ success: true, data: parsedData });
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr, "Raw Text:", jsonText);
      return res.status(500).json({
        error: "INVALID_JSON",
        message: "AI 응답을 JSON 형식으로 해석할 수 없습니다."
      });
    }
  } catch (err: any) {
    console.error("Gemini Diagnosis Error:", err);
    return res.status(500).json({
      error: "GEMINI_CALL_FAILED",
      message: err?.message || "Gemini API 호출 중 오류가 발생했습니다."
    });
  }
});

// Production Vite asset serving vs Dev middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[농작물 AI 진단 도우미] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
