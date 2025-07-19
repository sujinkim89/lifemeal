"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ChevronLeft, User, Sparkles, Camera, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/contexts/UserContext";
import { nutrients, getNutrientById } from "@/lib/data/nutrients";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
  id: string;
  type: "user" | "coach" | "system";
  content: string;
  character?: {
    name: string;
    emoji: string;
    color: string;
  };
  timestamp: Date;
  isAnalysis?: boolean;
  mealData?: {
    foods: string[];
    analysis?: NutrientAnalysis[];
  };
  image?: string;
}

interface NutrientAnalysis {
  name: string;
  amount: number;
  unit: string;
  percentage: number;
  status: "low" | "normal" | "high";
}

interface MealItem {
  id: string;
  name: string;
  portion: string;
}

type CoachMode = "general" | "meal-analysis" | "nutrition-education" | "recommendation";

export default function CoachingPage() {
  const router = useRouter();
  const { userInfo, nutrientStatus } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCoach, setSelectedCoach] = useState<string>("vitaminC");
  const [coachMode, setCoachMode] = useState<CoachMode>("general");
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const [currentMeals, setCurrentMeals] = useState<MealItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/onboarding");
      return;
    }

    // 초기 인사 메시지
    const nutrient = getNutrientById(selectedCoach);
    if (nutrient) {
      const welcomeMessage: Message = {
        id: `welcome-${selectedCoach}`,
        type: "coach",
        content: `안녕하세요, ${userInfo.name}님! 저는 ${nutrient.character.name}예요. ${nutrient.character.emoji}\n\n식단을 분석해드리거나 영양에 대해 궁금한 점을 물어보세요! 모드를 바꿔가며 다양한 도움을 드릴 수 있어요.`,
        character: {
          name: nutrient.character.name,
          emoji: nutrient.character.emoji,
          color: nutrient.character.color,
        },
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedCoach, userInfo, router]);

  const handleModeChange = (newMode: CoachMode) => {
    setCoachMode(newMode);
    const nutrient = getNutrientById(selectedCoach);
    if (!nutrient) return;

    let modeMessage = "";
    switch (newMode) {
      case "meal-analysis":
        modeMessage = "🍽️ 식단 분석 모드로 전환되었습니다! 오늘 드신 음식들을 알려주시거나 사진을 업로드해주세요.";
        break;
      case "nutrition-education":
        modeMessage = "📚 영양 교육 모드입니다! 영양소에 대해 궁금한 점들을 물어보세요.";
        break;
      case "recommendation":
        modeMessage = "💡 맞춤 추천 모드입니다! 현재 부족한 영양소를 기반으로 음식을 추천해드릴게요.";
        break;
      default:
        modeMessage = "💬 일반 상담 모드입니다! 건강과 영양에 대해 자유롭게 대화해보세요.";
    }

    const systemMessage: Message = {
      id: `mode-${messageIdCounter}`,
      type: "system",
      content: modeMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, systemMessage]);
    setMessageIdCounter(prev => prev + 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setSelectedImage(imageUrl);
        
        // 이미지가 포함된 사용자 메시지 추가
        const userMessage: Message = {
          id: `user-${messageIdCounter}`,
          type: "user",
          content: "식단 사진을 분석해주세요",
          image: imageUrl,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setMessageIdCounter(prev => prev + 1);

        // AI 분석 시작
        analyzeImageMeal(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageMeal = async (imageUrl: string) => {
    setIsAnalyzing(true);
    
    try {
      // 실제 AI 분석 API 호출
      const response = await fetch('/api/analyze-food-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageUrl,
          userProfile: {
            age: userInfo?.age || 30,
            gender: userInfo?.gender || 'male',
            weight: userInfo?.weight || 70,
            height: userInfo?.height || 175,
            activity_level: userInfo?.activityLevel || 'moderate'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('분석 요청 실패');
      }

      const result = await response.json();
      
      if (result.success) {
        const realAnalysis: NutrientAnalysis[] = [
          { name: "칼로리", amount: Math.round(result.data.nutrition.energy), unit: "kcal", percentage: Math.min(100, Math.round((result.data.nutrition.energy / 2000) * 100)), status: result.data.nutrition.energy > 2400 ? "high" : result.data.nutrition.energy < 1600 ? "low" : "normal" },
          { name: "탄수화물", amount: Math.round(result.data.nutrition.carbohydrate), unit: "g", percentage: Math.min(100, Math.round((result.data.nutrition.carbohydrate / 330) * 100)), status: "normal" },
          { name: "단백질", amount: Math.round(result.data.nutrition.protein), unit: "g", percentage: Math.min(100, Math.round((result.data.nutrition.protein / 65) * 100)), status: result.data.nutrition.protein < 52 ? "low" : "normal" },
          { name: "지방", amount: Math.round(result.data.nutrition.fat), unit: "g", percentage: Math.min(100, Math.round((result.data.nutrition.fat / 83) * 100)), status: "normal" },
          { name: "식이섬유", amount: Math.round(result.data.nutrition.fiber), unit: "g", percentage: Math.min(100, Math.round((result.data.nutrition.fiber / 25) * 100)), status: result.data.nutrition.fiber < 20 ? "low" : "normal" },
          { name: "비타민 C", amount: Math.round(result.data.nutrition.vitamin_c), unit: "mg", percentage: Math.min(100, Math.round((result.data.nutrition.vitamin_c / 100) * 100)), status: result.data.nutrition.vitamin_c < 80 ? "low" : "normal" },
          { name: "칼슘", amount: Math.round(result.data.nutrition.calcium), unit: "mg", percentage: Math.min(100, Math.round((result.data.nutrition.calcium / 800) * 100)), status: result.data.nutrition.calcium < 640 ? "low" : "normal" },
          { name: "철분", amount: Math.round(result.data.nutrition.iron), unit: "mg", percentage: Math.min(100, Math.round((result.data.nutrition.iron / 10) * 100)), status: result.data.nutrition.iron < 8 ? "low" : "normal" }
        ];

        const nutrient = getNutrientById(selectedCoach);
        if (!nutrient) return;

        const analysisMessage: Message = {
          id: `analysis-${messageIdCounter}`,
          type: "coach",
          content: `사진을 분석해봤어요! 🔍\n\n${result.data.recognizedFoods.map((f: any) => f.name).join(", ")}이 보이네요.\n\n${result.data.aiComment}\n\n균형 점수: ${result.data.analysis.balance_score}/100점`,
          character: {
            name: nutrient.character.name,
            emoji: nutrient.character.emoji,
            color: nutrient.character.color,
          },
          timestamp: new Date(),
          isAnalysis: true,
          mealData: {
            foods: result.data.recognizedFoods.map((f: any) => f.name),
            analysis: realAnalysis
          }
        };

        setIsAnalyzing(false);
        setMessages(prev => [...prev, analysisMessage]);
        setMessageIdCounter(prev => prev + 1);
        setSelectedImage(null);
      } else {
        throw new Error(result.error || '분석 실패');
      }
    } catch (error) {
      console.error('이미지 분석 오류:', error);
      
      // 오류 시 기본 분석 결과 표시
      const nutrient = getNutrientById(selectedCoach);
      if (nutrient) {
        const errorMessage: Message = {
          id: `error-${messageIdCounter}`,
          type: "coach",
          content: `죄송해요, 이미지 분석 중 오류가 발생했습니다. 😅\n\n오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n네트워크 연결을 확인하거나 다른 사진으로 다시 시도해주세요!`,
          character: {
            name: nutrient.character.name,
            emoji: nutrient.character.emoji,
            color: nutrient.character.color,
          },
          timestamp: new Date(),
        };
        
        setIsAnalyzing(false);
        setMessages(prev => [...prev, errorMessage]);
        setMessageIdCounter(prev => prev + 1);
        setSelectedImage(null);
      }
    }
  };

  const analyzeMeals = async (foods: string[]) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockAnalysis: NutrientAnalysis[] = [
        { name: "칼로리", amount: 1800, unit: "kcal", percentage: 90, status: "normal" },
        { name: "탄수화물", amount: 220, unit: "g", percentage: 73, status: "normal" },
        { name: "단백질", amount: 65, unit: "g", percentage: 130, status: "high" },
        { name: "지방", amount: 45, unit: "g", percentage: 69, status: "normal" },
        { name: "식이섬유", amount: 18, unit: "g", percentage: 64, status: "low" },
        { name: "비타민 C", amount: 45, unit: "mg", percentage: 50, status: "low" },
        { name: "비타민 D", amount: 5, unit: "μg", percentage: 25, status: "low" },
        { name: "칼슘", amount: 650, unit: "mg", percentage: 65, status: "low" },
        { name: "철분", amount: 12, unit: "mg", percentage: 67, status: "normal" },
        { name: "오메가-3", amount: 0.8, unit: "g", percentage: 50, status: "low" }
      ];

      const nutrient = getNutrientById(selectedCoach);
      if (!nutrient) return;

      const analysisMessage: Message = {
        id: `analysis-${messageIdCounter}`,
        type: "coach",
        content: `오늘 드신 음식들을 분석해봤어요! 🔍\n\n${foods.join(", ")}을 드셨네요. 400여 가지 영양소를 분석한 결과, 전반적으로 균형잡힌 식단이지만 몇 가지 개선점이 있어요.\n\n특히 비타민 C와 칼슘이 부족하니 오렌지나 유제품을 추가해보시는 것을 추천드려요!`,
        character: {
          name: nutrient.character.name,
          emoji: nutrient.character.emoji,
          color: nutrient.character.color,
        },
        timestamp: new Date(),
        isAnalysis: true,
        mealData: {
          foods,
          analysis: mockAnalysis
        }
      };

      setIsAnalyzing(false);
      setMessages(prev => [...prev, analysisMessage]);
      setMessageIdCounter(prev => prev + 1);
      setCurrentMeals([]);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: `user-${messageIdCounter}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);
    setMessageIdCounter(prev => prev + 1);

    // 식단 분석 모드에서 음식 추가 처리
    if (coachMode === "meal-analysis" && (currentInput.includes("먹었") || currentInput.includes("드셨") || currentInput.includes("음식"))) {
      // 간단한 키워드 추출로 음식 이름 파싱
      const foodKeywords = currentInput.split(/[,\s]+/).filter(word => 
        word.length > 1 && !["을", "를", "이", "가", "은", "는", "먹었", "드셨", "음식", "오늘", "아침", "점심", "저녁"].includes(word)
      );
      
      if (foodKeywords.length > 0) {
        const newMeals = foodKeywords.map((food, index) => ({
          id: `meal-${Date.now()}-${index}`,
          name: food,
          portion: "1인분"
        }));
        setCurrentMeals(prev => [...prev, ...newMeals]);
        
        setTimeout(() => {
          setIsTyping(false);
          analyzeMeals([...currentMeals.map(m => m.name), ...newMeals.map(m => m.name)]);
        }, 1500);
        return;
      }
    }

    // 일반 코치 응답
    setTimeout(() => {
      const nutrient = getNutrientById(selectedCoach);
      if (!nutrient) return;

      let responseContent = "";
      const userStatus = nutrientStatus.find(s => s.nutrientId === selectedCoach);

      // 모드별 응답 처리
      if (coachMode === "meal-analysis") {
        responseContent = "음식을 분석하려면 '오늘 김치볶음밥과 계란국을 먹었어요' 같은 형태로 말씀해주세요! 🍽️";
      } else if (coachMode === "recommendation") {
        const foods = getFoodsForNutrient(selectedCoach);
        responseContent = `${userInfo?.name}님의 현재 영양 상태를 보면 ${nutrient.koreanName}을 더 섭취하시는 것이 좋겠어요! 추천 음식: ${foods.slice(0, 3).join(", ")} 등이 있습니다. 😊`;
      } else if (coachMode === "nutrition-education") {
        if (currentInput.includes("효과") || currentInput.includes("좋은")) {
          responseContent = getEffectsForNutrient(selectedCoach);
        } else {
          responseContent = `${nutrient.koreanName}에 대해 궁금한 점이 있으시면 언제든 물어보세요! 효과, 음식, 부족할 때 증상 등 무엇이든 답변드릴게요. 📚`;
        }
      } else {
        // 일반 모드 응답
        if (currentInput.includes("부족") || currentInput.includes("어떻게")) {
          if (userStatus && userStatus.status === "deficient") {
            responseContent = `${userInfo?.name}님은 현재 ${nutrient.koreanName}이 권장량의 ${Math.round(userStatus.percentage)}%만 섭취하고 계시네요. ${nutrient.koreanName}이 풍부한 음식을 추천해드릴게요!`;
          } else {
            responseContent = `${nutrient.koreanName}을 보충하려면 다음과 같은 음식을 드시는 것이 좋아요. 매일 꾸준히 섭취하는 것이 중요합니다!`;
          }
        } else if (currentInput.includes("음식") || currentInput.includes("뭐")) {
          const foods = getFoodsForNutrient(selectedCoach);
          responseContent = `${nutrient.koreanName}이 풍부한 음식들이에요: ${foods.join(", ")}. 이 중에서 좋아하시는 음식이 있나요?`;
        } else {
          responseContent = `${nutrient.character.personality}! ${userInfo?.name}님의 건강을 위해 제가 도와드릴 수 있는 다른 것이 있을까요?`;
        }
      }

      const coachMessage: Message = {
        id: `coach-${messageIdCounter}`,
        type: "coach",
        content: responseContent,
        character: {
          name: nutrient.character.name,
          emoji: nutrient.character.emoji,
          color: nutrient.character.color,
        },
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, coachMessage]);
    }, 1500);
  };

  const getFoodsForNutrient = (nutrientId: string): string[] => {
    const foodMap: { [key: string]: string[] } = {
      vitaminC: ["오렌지", "키위", "딸기", "파프리카", "브로콜리"],
      protein: ["닭가슴살", "계란", "두부", "연어", "그릭요거트"],
      calcium: ["우유", "치즈", "요구르트", "시금치", "멸치"],
      iron: ["소고기", "시금치", "렌틸콩", "굴", "다크초콜릿"],
      fiber: ["오트밀", "현미", "사과", "고구마", "아보카도"],
      vitaminD: ["연어", "참치", "달걀노른자", "버섯", "우유"],
      omega3: ["고등어", "호두", "아마씨", "치아씨드", "연어"],
    };
    return foodMap[nutrientId] || ["다양한 채소", "과일", "통곡물"];
  };

  const getEffectsForNutrient = (nutrientId: string): string => {
    const effectsMap: { [key: string]: string } = {
      vitaminC: "비타민 C는 면역력 강화, 피부 건강, 항산화 작용을 도와줘요! 특히 환절기에 중요하답니다.",
      protein: "단백질은 근육 생성과 유지, 포만감 증가, 신진대사 향상에 필수적이에요!",
      calcium: "칼슘은 뼈와 치아를 튼튼하게 하고, 근육 수축과 신경 전달에도 중요한 역할을 해요.",
      iron: "철분은 혈액 속 헤모글로빈 생성을 도와 산소 운반을 원활하게 해줍니다.",
      fiber: "식이섬유는 장 건강, 혈당 조절, 콜레스테롤 감소에 도움을 줘요!",
      vitaminD: "비타민 D는 칼슘 흡수를 돕고, 면역력 강화와 기분 개선에도 좋아요.",
      omega3: "오메가-3는 심혈관 건강, 뇌 기능 향상, 염증 감소에 효과적이에요!",
    };
    return effectsMap[nutrientId] || "이 영양소는 전반적인 건강 유지에 중요한 역할을 합니다!";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "#ef4444";
      case "normal": return "#10b981";
      case "high": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "low": return "부족";
      case "normal": return "적정";
      case "high": return "과다";
      default: return "";
    }
  };

  // 주요 코치 캐릭터들
  const coachCharacters = [
    { id: "vitaminC", nutrient: getNutrientById("vitaminC") },
    { id: "protein", nutrient: getNutrientById("protein") },
    { id: "calcium", nutrient: getNutrientById("calcium") },
    { id: "iron", nutrient: getNutrientById("iron") },
    { id: "fiber", nutrient: getNutrientById("fiber") },
    { id: "vitaminD", nutrient: getNutrientById("vitaminD") },
    { id: "omega3", nutrient: getNutrientById("omega3") },
  ].filter(item => item.nutrient);

  const coachModeOptions = [
    { id: "general" as CoachMode, name: "일반 상담", emoji: "💬" },
    { id: "meal-analysis" as CoachMode, name: "식단 분석", emoji: "🍽️" },
    { id: "nutrition-education" as CoachMode, name: "영양 교육", emoji: "📚" },
    { id: "recommendation" as CoachMode, name: "맞춤 추천", emoji: "💡" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ backgroundColor: "white", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link 
              href="/dashboard" 
              style={{ 
                padding: "8px", 
                backgroundColor: "#f3f4f6", 
                borderRadius: "8px", 
                textDecoration: "none",
                color: "#6b7280",
                display: "flex",
                alignItems: "center"
              }}
            >
              <ChevronLeft style={{ width: "24px", height: "24px" }} />
            </Link>
            <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>영양 코칭 & 식단 분석</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles style={{ width: "20px", height: "20px", color: "#2563eb" }} />
            <span style={{ fontSize: "14px", color: "#6b7280" }}>AI 영양 코치</span>
          </div>
        </div>
      </header>

      {/* Coach Mode Selection */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
            {coachModeOptions.map(mode => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                  backgroundColor: coachMode === mode.id ? "#2563eb" : "#f3f4f6",
                  color: coachMode === mode.id ? "white" : "#374151"
                }}
              >
                <span>{mode.emoji}</span>
                {mode.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coach Selection */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
            {coachCharacters.map(({ id, nutrient }) => (
              <button
                key={id}
                onClick={() => setSelectedCoach(id)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                  backgroundColor: selectedCoach === id ? "#2563eb" : "#f3f4f6",
                  color: selectedCoach === id ? "white" : "#374151"
                }}
              >
                <span style={{ fontSize: "20px" }}>{nutrient?.character.emoji}</span>
                <span>{nutrient?.character.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: message.type === "user" ? "flex-end" : "flex-start"
                  }}
                >
                  <div style={{ maxWidth: "480px", width: "100%" }}>
                    {message.type === "coach" && message.character && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "20px" }}>{message.character.emoji}</span>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                          {message.character.name}
                        </span>
                      </div>
                    )}
                    {message.type === "system" && (
                      <div style={{ textAlign: "center", margin: "16px 0" }}>
                        <span style={{ 
                          fontSize: "14px", 
                          color: "#6b7280", 
                          backgroundColor: "#f3f4f6",
                          padding: "8px 16px",
                          borderRadius: "16px"
                        }}>
                          {message.content}
                        </span>
                      </div>
                    )}
                    {message.type !== "system" && (
                      <div
                        style={{
                          padding: "16px",
                          borderRadius: "16px",
                          backgroundColor: message.type === "user" ? "#2563eb" : "white",
                          color: message.type === "user" ? "white" : "#374151",
                          border: message.type === "coach" ? "1px solid #e5e7eb" : "none",
                          boxShadow: message.type === "coach" ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)" : "none",
                          whiteSpace: "pre-line"
                        }}
                      >
                        {message.content}
                      </div>
                    )}

                    {/* 이미지 표시 */}
                    {message.image && (
                      <div style={{ marginTop: "8px" }}>
                        <Image 
                          src={message.image} 
                          alt="업로드된 식단 사진" 
                          width={300} 
                          height={200} 
                          style={{ 
                            width: "100%", 
                            maxWidth: "300px", 
                            height: "auto", 
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb"
                          }} 
                        />
                      </div>
                    )}

                    {/* 영양 분석 결과 표시 */}
                    {message.isAnalysis && message.mealData?.analysis && (
                      <div style={{ marginTop: "16px", backgroundColor: "white", borderRadius: "12px", padding: "16px", border: "1px solid #e5e7eb" }}>
                        <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>📊 영양소 분석 결과</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {message.mealData.analysis.slice(0, 5).map((nutrient, index) => (
                            <div key={index} style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px",
                              backgroundColor: "#f9fafb",
                              borderRadius: "8px"
                            }}>
                              <div>
                                <span style={{ fontWeight: "500" }}>{nutrient.name}</span>
                                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                  {nutrient.amount}{nutrient.unit}
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{
                                  color: getStatusColor(nutrient.status),
                                  fontWeight: "600"
                                }}>
                                  {nutrient.percentage}%
                                </div>
                                <div style={{
                                  fontSize: "10px",
                                  color: getStatusColor(nutrient.status)
                                }}>
                                  {getStatusText(nutrient.status)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <span style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", display: "block" }}>
                      {message.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isAnalyzing && (
              <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid #2563eb",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
            
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "16px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1.4s infinite" }} />
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1.4s infinite", animationDelay: "0.2s" }} />
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1.4s infinite", animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div style={{ backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "16px" }}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: "flex", gap: "16px", alignItems: "center" }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                coachMode === "meal-analysis" 
                  ? "오늘 드신 음식을 알려주세요 (예: 김치볶음밥, 계란국을 먹었어요)" 
                  : "영양에 대해 궁금한 점을 물어보세요..."
              }
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "24px",
                fontSize: "16px",
                outline: "none"
              }}
            />
            
            {/* 카메라/업로드 버튼 */}
            {coachMode === "meal-analysis" && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s"
                }}
                title="사진 업로드"
              >
                <Camera style={{ width: "24px", height: "24px", color: "#6b7280" }} />
              </button>
            )}
            
            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                padding: "12px 24px",
                backgroundColor: !inputValue.trim() ? "#9ca3af" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "24px",
                cursor: !inputValue.trim() ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.2s"
              }}
            >
              <Send style={{ width: "20px", height: "20px" }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}