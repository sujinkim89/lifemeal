"use client";

import { useState } from "react";
import { Camera, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MealItem {
  id: string;
  name: string;
  portion: string;
}

interface NutrientAnalysis {
  name: string;
  amount: number;
  unit: string;
  percentage: number;
  status: "low" | "normal" | "high";
}

export default function RecordPage() {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [newMeal, setNewMeal] = useState({ name: "", portion: "" });
  const [analysis, setAnalysis] = useState<NutrientAnalysis[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addMeal = () => {
    if (newMeal.name && newMeal.portion) {
      setMeals([...meals, {
        id: `meal-${Date.now()}`,
        ...newMeal
      }]);
      setNewMeal({ name: "", portion: "" });
    }
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const analyzeMeals = async () => {
    if (meals.length === 0) return;
    
    setIsAnalyzing(true);
    
    // 3초 후 분석 결과 표시 (실제로는 AI API 호출)
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
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <header style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link 
              href="/dashboard" 
              style={{ 
                padding: "8px", 
                backgroundColor: "#f3f4f6", 
                borderRadius: "8px", 
                textDecoration: "none",
                color: "#6b7280"
              }}
            >
              <ArrowLeft style={{ width: "24px", height: "24px" }} />
            </Link>
            <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>오늘 먹은 메뉴 기록</h1>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* 왼쪽: 식단 입력 */}
          <div>
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "12px", 
              padding: "24px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
                🍽️ 오늘 먹은 음식을 추가해주세요
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="음식명 (예: 김치볶음밥)"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  style={{
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none"
                  }}
                />
                <input
                  type="text"
                  placeholder="양 (예: 1그릇, 200g, 1개)"
                  value={newMeal.portion}
                  onChange={(e) => setNewMeal({ ...newMeal, portion: e.target.value })}
                  style={{
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none"
                  }}
                />
                <button
                  onClick={addMeal}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}
                >
                  <Plus style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                  추가하기
                </button>
              </div>
            </div>

            {/* 추가된 음식 목록 */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "12px", 
              padding: "24px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>
                📝 추가된 음식 ({meals.length}개)
              </h3>
              
              {meals.length === 0 ? (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "32px" }}>
                  아직 추가된 음식이 없습니다
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  {meals.map((meal) => (
                    <div 
                      key={meal.id}
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px"
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: "500" }}>{meal.name}</span>
                        <span style={{ color: "#6b7280", marginLeft: "8px" }}>({meal.portion})</span>
                      </div>
                      <button
                        onClick={() => removeMeal(meal.id)}
                        style={{
                          padding: "4px",
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer"
                        }}
                      >
                        <Trash2 style={{ width: "16px", height: "16px" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {meals.length > 0 && (
                <button
                  onClick={analyzeMeals}
                  disabled={isAnalyzing}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: isAnalyzing ? "#9ca3af" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isAnalyzing ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}
                >
                  {isAnalyzing ? "분석 중..." : "🤖 AI 영양 분석 시작"}
                </button>
              )}
            </div>
          </div>

          {/* 오른쪽: 분석 결과 */}
          <div>
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "12px", 
              padding: "24px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
                📊 영양소 분석 결과
              </h2>

              {!analysis && !isAnalyzing && (
                <div style={{ textAlign: "center", padding: "64px 0" }}>
                  <Camera style={{ width: "48px", height: "48px", color: "#9ca3af", margin: "0 auto 16px" }} />
                  <p style={{ color: "#6b7280" }}>
                    음식을 추가하고 분석 버튼을 눌러주세요
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div style={{ textAlign: "center", padding: "64px 0" }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    border: "4px solid #e5e7eb", 
                    borderTop: "4px solid #2563eb",
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ color: "#6b7280" }}>
                    400여 가지 영양소를 분석하고 있습니다...
                  </p>
                </div>
              )}

              {analysis && (
                <div>
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
                      🎯 주요 영양소 현황
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {analysis.map((nutrient, index) => (
                        <div key={index} style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          padding: "12px",
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px"
                        }}>
                          <div>
                            <span style={{ fontWeight: "500" }}>{nutrient.name}</span>
                            <div style={{ fontSize: "14px", color: "#6b7280" }}>
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
                              fontSize: "12px",
                              color: getStatusColor(nutrient.status)
                            }}>
                              {getStatusText(nutrient.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    backgroundColor: "#fef3c7", 
                    border: "1px solid #f59e0b",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#92400e", marginBottom: "8px" }}>
                      💡 오늘의 영양 조언
                    </h4>
                    <ul style={{ fontSize: "14px", color: "#92400e", margin: 0, paddingLeft: "16px" }}>
                      <li>비타민 C가 부족합니다. 오렌지나 키위를 드셔보세요</li>
                      <li>칼슘 섭취를 늘리려면 유제품을 추가해보세요</li>
                      <li>오메가-3을 위해 생선이나 견과류를 드시는 것을 추천합니다</li>
                    </ul>
                  </div>

                  <Link
                    href="/coaching"
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      textAlign: "center",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "600"
                    }}
                  >
                    🤖 영양 코치와 상담하기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}