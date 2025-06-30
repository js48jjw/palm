import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDZPrmFog4qle13a5JCSK5jN3dRJqYkdH4';

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export interface PalmAnalysisRequest {
  imageBase64: string;
  gender: string;
  age: number;
}

export async function analyzePalm(request: PalmAnalysisRequest): Promise<string> {
  try {
    const { imageBase64, gender, age } = request;
    
    const genderText = gender === 'male' ? '남성' : '여성';
    
    const prompt = `
당신은 전문 손금 분석가입니다.
제공된 손금 사진을 보고, ${genderText}, ${age}세의 오늘의 운세를 분석해 주세요.

- 절대, 어떤 경우에도 분석을 회피하거나, 한계, 면책, 안내, 정보 부족, 사진 품질, 추가 정보, 전문가 상담, 참고, 정확도, 제한, 양해, 불가, 불확실, 추측, 조심스러운 표현을 포함하지 마세요.
- 반드시 본론(운세 내용)부터 바로 시작하고, 긍정적이고 구체적인 운세, 조언, 해석만 제공하세요.
- 만약 위 조건을 어길 경우, 답변을 생성하지 말고, 반드시 본론만 출력하세요.
- 아래 형식으로 답변하세요:

🌟 **오늘의 종합운**
(전체적인 오늘의 운세를 2-3문장으로)

💖 **사랑운**
(연애/결혼 관련 운세를 1-2문장으로)

💰 **재물운**
(금전/투자 관련 운세를 1-2문장으로)

🏠 **직업운**
(일/학업 관련 운세를 1-2문장으로)

🏥 **건강운**
(건강 관련 조언을 1-2문장으로)

🍀 **오늘의 행운 포인트**
(오늘 특히 주의하거나 활용하면 좋을 점 1-2가지)

---
따뜻하고 긍정적인 톤으로 작성해주시고, 구체적이고 실용적인 조언을 포함해주세요.
손금의 생명선, 운명선, 감정선, 지능선 등을 종합적으로 분석하여 답변해 주세요.
`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg'
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof Error) {
      throw new Error(`손금 분석 중 오류가 발생했습니다: ${error.message}`);
    }
    
    throw new Error('손금 분석 중 알 수 없는 오류가 발생했습니다.');
  }
}