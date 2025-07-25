import { NextRequest, NextResponse } from 'next/server';
import { NutritionAPI, analyzeNutritionBalance } from '@/lib/nutrition-db';

export async function POST(request: NextRequest) {
  try {
    // 환경변수 체크
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Anthropic API key가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    
    if (!process.env.FOOD_SAFETY_API_KEY) {
      return NextResponse.json(
        { success: false, error: '식품의약품안전처 API key가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    
    const { image, userProfile } = await request.json();
    
    // 1단계: Claude Vision API로 음식 인식
    const foodAnalysis = await analyzeFoodImage(image);
    
    // 2단계: 식품의약품안전처 DB에서 영양정보 검색
    const nutritionAPI = new NutritionAPI(process.env.FOOD_SAFETY_API_KEY);
    const nutritionData = await nutritionAPI.calculateTotalNutrition(
      foodAnalysis.foods.map((food: any) => ({
        name: food.name,
        amount: food.amount || 150 // 기본 150g (일반적인 1인분)
      }))
    );
    
    // 3단계: 영양 균형 분석
    const balanceAnalysis = analyzeNutritionBalance(nutritionData, userProfile);
    
    return NextResponse.json({
      success: true,
      data: {
        recognizedFoods: foodAnalysis.foods,
        nutrition: nutritionData,
        analysis: balanceAnalysis,
        aiComment: foodAnalysis.comment
      }
    });
    
  } catch (error) {
    console.error('식단 분석 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { 
        success: false, 
        error: '식단 분석 중 오류가 발생했습니다.',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

async function analyzeFoodImage(imageBase64: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64.split(',')[1] // data:image/jpeg;base64, 제거
            }
          },
          {
            type: "text",
            text: `이 음식 사진을 분석해서 다음 정보를 JSON 형태로 반환해주세요:

{
  "foods": [
    {
      "name": "음식명 (한국어)",
      "amount": 예상_그램수,
      "confidence": 인식_확신도_0_to_1
    }
  ],
  "comment": "음식에 대한 간단한 설명과 영양학적 조언 (한국어)"
}

한국 음식명을 정확히 사용하고, 일반적인 1인분 기준으로 그램수를 추정해주세요.`
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Claude API 에러:', errorData);
    throw new Error(`Claude API 요청 실패: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const result = await response.json();
  console.log('Claude API 응답:', result);
  
  if (!result.content || !result.content[0] || !result.content[0].text) {
    throw new Error('Claude API 응답 형식 오류');
  }
  
  const content = result.content[0].text;
  
  try {
    return JSON.parse(content);
  } catch {
    // JSON 파싱 실패시 기본값 반환
    return {
      foods: [{ name: "인식 실패", amount: 0, confidence: 0 }],
      comment: "음식 인식에 실패했습니다. 다시 시도해주세요."
    };
  }
}