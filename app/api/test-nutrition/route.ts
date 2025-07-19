import { NextRequest, NextResponse } from 'next/server';
import { NutritionAPI } from '@/lib/nutrition-db';

export async function GET(request: NextRequest) {
  try {
    const nutritionAPI = new NutritionAPI();
    
    // 테스트: 김치 검색
    const result = await nutritionAPI.searchFood('김치');
    
    return NextResponse.json({
      success: true,
      data: result,
      message: '영양소 DB 연결 테스트 성공'
    });
    
  } catch (error) {
    console.error('영양소 DB 테스트 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        message: '영양소 DB 연결 테스트 실패' 
      },
      { status: 500 }
    );
  }
}