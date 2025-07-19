// 식품의약품안전처 영양성분 DB API
// https://www.foodsafetykorea.go.kr/api/openApiInfo.do?menu_grp=MENU_GRP31&menu_no=661&show_cnt=10&start_idx=1

export interface NutritionData {
  food_name: string;        // 식품명
  energy: number;          // 에너지(kcal)
  protein: number;         // 단백질(g)
  fat: number;            // 지방(g)
  carbohydrate: number;   // 탄수화물(g)
  sugar: number;          // 당류(g)
  fiber: number;          // 식이섬유(g)
  calcium: number;        // 칼슘(mg)
  iron: number;           // 철(mg)
  sodium: number;         // 나트륨(mg)
  vitamin_c: number;      // 비타민C(mg)
  // 400여 가지 영양소를 위한 추가 필드들
  [key: string]: string | number;
}

export interface FoodSearchResult {
  total_count: number;
  items: NutritionData[];
}

export class NutritionAPI {
  private apiKey: string;
  private baseUrl = 'http://openapi.foodsafetykorea.go.kr/api';

  constructor() {
    this.apiKey = process.env.FOOD_SAFETY_API_KEY || '';
  }

  // 식품명으로 영양정보 검색
  async searchFood(foodName: string): Promise<FoodSearchResult> {
    const url = `${this.baseUrl}/${this.apiKey}/I2790/json/1/100/DESC_KOR=${encodeURIComponent(foodName)}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.I2790?.row) {
        return {
          total_count: data.I2790.total_count,
          items: data.I2790.row.map(this.mapToNutritionData)
        };
      }
      
      return { total_count: 0, items: [] };
    } catch (error) {
      console.error('식품 검색 오류:', error);
      return { total_count: 0, items: [] };
    }
  }

  // API 응답을 NutritionData 형식으로 변환
  private mapToNutritionData(apiData: any): NutritionData {
    return {
      food_name: apiData.DESC_KOR || '',
      energy: parseFloat(apiData.NUTR_CONT1) || 0,      // 에너지
      protein: parseFloat(apiData.NUTR_CONT2) || 0,     // 단백질
      fat: parseFloat(apiData.NUTR_CONT3) || 0,         // 지방
      carbohydrate: parseFloat(apiData.NUTR_CONT4) || 0, // 탄수화물
      sugar: parseFloat(apiData.NUTR_CONT5) || 0,       // 당류
      fiber: parseFloat(apiData.NUTR_CONT6) || 0,       // 식이섬유
      calcium: parseFloat(apiData.NUTR_CONT7) || 0,     // 칼슘
      iron: parseFloat(apiData.NUTR_CONT8) || 0,        // 철
      sodium: parseFloat(apiData.NUTR_CONT9) || 0,      // 나트륨
      vitamin_c: parseFloat(apiData.NUTR_CONT10) || 0,  // 비타민C
    };
  }

  // 여러 음식의 영양정보 합계 계산
  calculateTotalNutrition(foods: { name: string; amount: number }[]): Promise<NutritionData> {
    // 각 음식의 영양정보를 검색하고 양에 따라 계산
    return Promise.resolve({
      food_name: '종합',
      energy: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sugar: 0,
      fiber: 0,
      calcium: 0,
      iron: 0,
      sodium: 0,
      vitamin_c: 0,
    });
  }
}

// 영양소 부족/과다 판정
export function analyzeNutritionBalance(nutrition: NutritionData, userProfile: {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activity_level: string;
}): {
  deficiencies: string[];
  excesses: string[];
  recommendations: string[];
  balance_score: number;
} {
  const deficiencies: string[] = [];
  const excesses: string[] = [];
  const recommendations: string[] = [];

  // 성인 남성 기준 권장량 (실제로는 사용자 프로필에 따라 계산)
  const recommendedIntake = {
    energy: 2500,     // kcal
    protein: 65,      // g
    fat: 83,          // g
    carbohydrate: 330, // g
    fiber: 25,        // g
    calcium: 800,     // mg
    iron: 10,         // mg
    sodium: 2000,     // mg (상한)
    vitamin_c: 100,   // mg
  };

  // 부족 영양소 체크
  if (nutrition.protein < recommendedIntake.protein * 0.8) {
    deficiencies.push('단백질');
    recommendations.push('닭가슴살, 두부, 계란 등 단백질 식품을 추가하세요');
  }

  if (nutrition.fiber < recommendedIntake.fiber * 0.8) {
    deficiencies.push('식이섬유');
    recommendations.push('채소, 과일, 통곡물을 더 섭취하세요');
  }

  if (nutrition.calcium < recommendedIntake.calcium * 0.8) {
    deficiencies.push('칼슘');
    recommendations.push('유제품, 멸치, 브로콜리 등을 섭취하세요');
  }

  // 과다 영양소 체크
  if (nutrition.sodium > recommendedIntake.sodium) {
    excesses.push('나트륨');
    recommendations.push('염분 섭취를 줄이고 신선한 식재료를 이용하세요');
  }

  if (nutrition.energy > recommendedIntake.energy * 1.2) {
    excesses.push('칼로리');
    recommendations.push('적정 칼로리를 유지하기 위해 포션 사이즈를 조절하세요');
  }

  // 균형 점수 계산 (0-100)
  let balance_score = 100;
  balance_score -= deficiencies.length * 10;
  balance_score -= excesses.length * 15;
  balance_score = Math.max(0, balance_score);

  return {
    deficiencies,
    excesses,
    recommendations,
    balance_score
  };
}