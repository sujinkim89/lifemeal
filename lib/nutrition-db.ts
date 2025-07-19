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
  private baseUrl = 'https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02';

  constructor() {
    this.apiKey = process.env.FOOD_SAFETY_API_KEY || '';
  }

  // 식품명으로 영양정보 검색
  async searchFood(foodName: string): Promise<FoodSearchResult> {
    const url = `${this.baseUrl}/getFoodNtrCpntDbInq02?serviceKey=${this.apiKey}&pageNo=1&numOfRows=10&type=json&FOOD_NM_KR=${encodeURIComponent(foodName)}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('API 응답 오류:', response.status, response.statusText);
        return { total_count: 0, items: [] };
      }
      
      const data = await response.json();
      console.log('API 응답:', data); // 디버깅용
      
      if (data.body?.items) {
        return {
          total_count: data.body.totalCount || data.body.items.length,
          items: data.body.items.map(this.mapToNutritionData)
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
      food_name: apiData.FOOD_NM_KR || '',
      energy: parseFloat(apiData.AMT_NUM1) || 0,        // 에너지(kcal)
      protein: parseFloat(apiData.AMT_NUM3) || 0,       // 단백질(g)  
      fat: parseFloat(apiData.AMT_NUM4) || 0,           // 지방(g)
      carbohydrate: parseFloat(apiData.AMT_NUM2) || 0,  // 탄수화물(g)
      sugar: parseFloat(apiData.AMT_NUM5) || 0,         // 당류(g)
      fiber: parseFloat(apiData.AMT_NUM6) || 0,         // 식이섬유(g)
      calcium: parseFloat(apiData.AMT_NUM7) || 0,       // 칼슘(mg)
      iron: parseFloat(apiData.AMT_NUM9) || 0,          // 철(mg)
      sodium: parseFloat(apiData.AMT_NUM8) || 0,        // 나트륨(mg)
      vitamin_c: parseFloat(apiData.AMT_NUM11) || 0,    // 비타민C(mg)
    };
  }

  // 여러 음식의 영양정보 합계 계산
  async calculateTotalNutrition(foods: { name: string; amount: number }[]): Promise<NutritionData> {
    const totalNutrition: NutritionData = {
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
    };

    for (const food of foods) {
      try {
        const searchResult = await this.searchFood(food.name);
        if (searchResult.items.length > 0) {
          const nutrition = searchResult.items[0]; // 첫 번째 검색 결과 사용
          const ratio = food.amount / 100; // 100g 기준으로 계산
          
          totalNutrition.energy += nutrition.energy * ratio;
          totalNutrition.protein += nutrition.protein * ratio;
          totalNutrition.fat += nutrition.fat * ratio;
          totalNutrition.carbohydrate += nutrition.carbohydrate * ratio;
          totalNutrition.sugar += nutrition.sugar * ratio;
          totalNutrition.fiber += nutrition.fiber * ratio;
          totalNutrition.calcium += nutrition.calcium * ratio;
          totalNutrition.iron += nutrition.iron * ratio;
          totalNutrition.sodium += nutrition.sodium * ratio;
          totalNutrition.vitamin_c += nutrition.vitamin_c * ratio;
        }
      } catch (error) {
        console.error(`${food.name} 영양정보 검색 실패:`, error);
        // 검색 실패시 기본값 사용 (계속 진행)
      }
    }

    return totalNutrition;
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