import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API 키가 환경변수에 설정되어 있지 않습니다.' },
      { status: 500 }
    );
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { image, gender, age } = await request.json();

    if (!image || !gender || !age) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // Gemini 1.5 Flash 모델 사용
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
        data: image,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // 에러 타입에 따른 구체적인 메시지
    let errorMessage = '분석 중 오류가 발생했습니다.';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API 키 설정에 문제가 있습니다.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'API 사용량 한도를 초과했습니다.';
      } else if (error.message.includes('image')) {
        errorMessage = '이미지 처리 중 오류가 발생했습니다.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}