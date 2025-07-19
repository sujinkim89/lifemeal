export interface Nutrient {
  id: string;
  name: string;
  koreanName: string;
  unit: string;
  dailyValue: number;
  category: "macro" | "vitamin" | "mineral";
  character: {
    name: string;
    emoji: string;
    personality: string;
    color: string;
  };
}

// 실제로는 400여 가지 영양소를 분석하지만, UI에서는 주요 28개 영양소만 표시
export const nutrients: Nutrient[] = [
  // 탄수화물, 단백질, 지방 (3대 영양소)
  {
    id: "carbohydrate",
    name: "Carbohydrate",
    koreanName: "탄수화물",
    unit: "g",
    dailyValue: 300,
    category: "macro",
    character: {
      name: "에너지맨",
      emoji: "⚡",
      personality: "활기차고 긍정적인 에너지 공급자",
      color: "#FFA500"
    }
  },
  {
    id: "protein",
    name: "Protein",
    koreanName: "단백질",
    unit: "g",
    dailyValue: 50,
    category: "macro",
    character: {
      name: "프로틴맨",
      emoji: "💪",
      personality: "근육을 지키는 정의의 히어로",
      color: "#FF6B6B"
    }
  },
  {
    id: "fat",
    name: "Fat",
    koreanName: "지방",
    unit: "g",
    dailyValue: 65,
    category: "macro",
    character: {
      name: "지방박사",
      emoji: "🧈",
      personality: "오해를 풀어주는 이성적인 캐릭터",
      color: "#FFD93D"
    }
  },
  
  // 비타민류
  {
    id: "vitaminA",
    name: "Vitamin A",
    koreanName: "비타민 A",
    unit: "μg",
    dailyValue: 900,
    category: "vitamin",
    character: {
      name: "시력수호자",
      emoji: "👁️",
      personality: "밝은 시야를 지켜주는 수호자",
      color: "#FF8C00"
    }
  },
  {
    id: "vitaminC",
    name: "Vitamin C",
    koreanName: "비타민 C",
    unit: "mg",
    dailyValue: 90,
    category: "vitamin",
    character: {
      name: "비타민C요정",
      emoji: "🧚",
      personality: "면역력과 피부를 담당하는 싱글벙글 요정",
      color: "#FFC107"
    }
  },
  {
    id: "vitaminD",
    name: "Vitamin D",
    koreanName: "비타민 D",
    unit: "μg",
    dailyValue: 20,
    category: "vitamin",
    character: {
      name: "햇살친구",
      emoji: "☀️",
      personality: "뼈 건강을 책임지는 햇살 같은 친구",
      color: "#FFEB3B"
    }
  },
  {
    id: "vitaminE",
    name: "Vitamin E",
    koreanName: "비타민 E",
    unit: "mg",
    dailyValue: 15,
    category: "vitamin",
    character: {
      name: "항산화전사",
      emoji: "🛡️",
      personality: "세포를 보호하는 든든한 전사",
      color: "#8BC34A"
    }
  },
  {
    id: "vitaminK",
    name: "Vitamin K",
    koreanName: "비타민 K",
    unit: "μg",
    dailyValue: 120,
    category: "vitamin",
    character: {
      name: "응고도우미",
      emoji: "🩹",
      personality: "상처를 치유하는 다정한 도우미",
      color: "#4CAF50"
    }
  },
  {
    id: "vitaminB1",
    name: "Vitamin B1",
    koreanName: "비타민 B1 (티아민)",
    unit: "mg",
    dailyValue: 1.2,
    category: "vitamin",
    character: {
      name: "에너지변환사",
      emoji: "🔄",
      personality: "에너지를 만드는 부지런한 일꾼",
      color: "#9C27B0"
    }
  },
  {
    id: "vitaminB2",
    name: "Vitamin B2",
    koreanName: "비타민 B2 (리보플라빈)",
    unit: "mg",
    dailyValue: 1.3,
    category: "vitamin",
    character: {
      name: "대사촉진자",
      emoji: "🏃",
      personality: "신진대사를 돕는 활발한 러너",
      color: "#E91E63"
    }
  },
  {
    id: "vitaminB6",
    name: "Vitamin B6",
    koreanName: "비타민 B6",
    unit: "mg",
    dailyValue: 1.7,
    category: "vitamin",
    character: {
      name: "뇌활성화기",
      emoji: "🧠",
      personality: "두뇌 활동을 돕는 똑똑한 조력자",
      color: "#3F51B5"
    }
  },
  {
    id: "vitaminB12",
    name: "Vitamin B12",
    koreanName: "비타민 B12",
    unit: "μg",
    dailyValue: 2.4,
    category: "vitamin",
    character: {
      name: "혈액생성자",
      emoji: "🩸",
      personality: "건강한 혈액을 만드는 성실한 일꾼",
      color: "#F44336"
    }
  },
  {
    id: "folate",
    name: "Folate",
    koreanName: "엽산",
    unit: "μg",
    dailyValue: 400,
    category: "vitamin",
    character: {
      name: "세포분열사",
      emoji: "🧬",
      personality: "새로운 세포를 만드는 생명의 수호자",
      color: "#00BCD4"
    }
  },
  
  // 미네랄류
  {
    id: "calcium",
    name: "Calcium",
    koreanName: "칼슘",
    unit: "mg",
    dailyValue: 1000,
    category: "mineral",
    character: {
      name: "뼈튼튼이",
      emoji: "🦴",
      personality: "뼈와 치아를 튼튼하게 지키는 수호자",
      color: "#EEEEEE"
    }
  },
  {
    id: "iron",
    name: "Iron",
    koreanName: "철분",
    unit: "mg",
    dailyValue: 18,
    category: "mineral",
    character: {
      name: "산소운반자",
      emoji: "🚂",
      personality: "온몸에 산소를 배달하는 부지런한 기관사",
      color: "#795548"
    }
  },
  {
    id: "magnesium",
    name: "Magnesium",
    koreanName: "마그네슘",
    unit: "mg",
    dailyValue: 400,
    category: "mineral",
    character: {
      name: "근육이완사",
      emoji: "🧘",
      personality: "긴장을 풀어주는 편안한 요가 선생님",
      color: "#607D8B"
    }
  },
  {
    id: "phosphorus",
    name: "Phosphorus",
    koreanName: "인",
    unit: "mg",
    dailyValue: 700,
    category: "mineral",
    character: {
      name: "에너지저장고",
      emoji: "🔋",
      personality: "에너지를 저장하는 든든한 배터리",
      color: "#FF5722"
    }
  },
  {
    id: "potassium",
    name: "Potassium",
    koreanName: "칼륨",
    unit: "mg",
    dailyValue: 3500,
    category: "mineral",
    character: {
      name: "균형조절사",
      emoji: "⚖️",
      personality: "체내 균형을 맞추는 공정한 심판",
      color: "#009688"
    }
  },
  {
    id: "sodium",
    name: "Sodium",
    koreanName: "나트륨",
    unit: "mg",
    dailyValue: 2300,
    category: "mineral",
    character: {
      name: "수분지킴이",
      emoji: "💧",
      personality: "적절한 수분을 유지하는 균형의 달인",
      color: "#03A9F4"
    }
  },
  {
    id: "zinc",
    name: "Zinc",
    koreanName: "아연",
    unit: "mg",
    dailyValue: 11,
    category: "mineral",
    character: {
      name: "면역부스터",
      emoji: "🦾",
      personality: "면역력을 높이는 강력한 부스터",
      color: "#9E9E9E"
    }
  },
  {
    id: "selenium",
    name: "Selenium",
    koreanName: "셀레늄",
    unit: "μg",
    dailyValue: 55,
    category: "mineral",
    character: {
      name: "항산화도우미",
      emoji: "🌟",
      personality: "세포를 지키는 반짝이는 별",
      color: "#FFC107"
    }
  },
  {
    id: "copper",
    name: "Copper",
    koreanName: "구리",
    unit: "mg",
    dailyValue: 0.9,
    category: "mineral",
    character: {
      name: "효소활성화",
      emoji: "⚙️",
      personality: "신체 기능을 원활하게 돌리는 엔지니어",
      color: "#B87333"
    }
  },
  {
    id: "manganese",
    name: "Manganese",
    koreanName: "망간",
    unit: "mg",
    dailyValue: 2.3,
    category: "mineral",
    character: {
      name: "항산화협력자",
      emoji: "🤝",
      personality: "다른 영양소와 협력하는 팀플레이어",
      color: "#673AB7"
    }
  },
  {
    id: "iodine",
    name: "Iodine",
    koreanName: "요오드",
    unit: "μg",
    dailyValue: 150,
    category: "mineral",
    character: {
      name: "갑상선지킴이",
      emoji: "🦋",
      personality: "신진대사를 조절하는 나비 같은 수호자",
      color: "#7B1FA2"
    }
  },
  
  // 추가 영양소
  {
    id: "fiber",
    name: "Dietary Fiber",
    koreanName: "식이섬유",
    unit: "g",
    dailyValue: 28,
    category: "macro",
    character: {
      name: "장청소부",
      emoji: "🧹",
      personality: "장 속을 청소하며 은밀하게 활약하는 스파이",
      color: "#8D6E63"
    }
  },
  {
    id: "omega3",
    name: "Omega-3",
    koreanName: "오메가-3",
    unit: "g",
    dailyValue: 1.6,
    category: "macro",
    character: {
      name: "혈관청소부",
      emoji: "🐟",
      personality: "혈관을 깨끗하게 유지하는 바다의 친구",
      color: "#1E88E5"
    }
  },
  {
    id: "water",
    name: "Water",
    koreanName: "수분",
    unit: "L",
    dailyValue: 2.5,
    category: "macro",
    character: {
      name: "생명의샘",
      emoji: "💦",
      personality: "모든 생명 활동의 기본이 되는 순수한 존재",
      color: "#00ACC1"
    }
  }
];

export function getNutrientById(id: string): Nutrient | undefined {
  return nutrients.find(n => n.id === id);
}

export function getNutrientsByCategory(category: "macro" | "vitamin" | "mineral"): Nutrient[] {
  return nutrients.filter(n => n.category === category);
}