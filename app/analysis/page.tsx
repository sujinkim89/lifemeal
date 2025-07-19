"use client";

import { useEffect, useState } from "react";
import { useUser, NutrientStatus } from "@/lib/contexts/UserContext";
import { nutrients } from "@/lib/data/nutrients";
import { ArrowRight, Download, Share2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const router = useRouter();
  const { userInfo, setNutrientStatus } = useUser();
  const [loading, setLoading] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push("/onboarding");
      return;
    }

    // 분석 시뮬레이션
    const analyzeNutrients = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 주요 영양소 28개만 표시 (실제로는 400여개 분석)
      const status: NutrientStatus[] = nutrients.map((nutrient, index) => {
        // 고정된 시드값을 사용하여 일관된 결과 생성
        const seed = nutrient.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const randomPercentage = ((seed * 7 + index * 13) % 100) + 20; // 20-120%
        let statusType: NutrientStatus["status"];
        
        if (randomPercentage < 50) statusType = "deficient";
        else if (randomPercentage < 80) statusType = "low";
        else if (randomPercentage < 120) statusType = "normal";
        else if (randomPercentage < 150) statusType = "high";
        else statusType = "excess";

        return {
          nutrientId: nutrient.id,
          currentValue: (nutrient.dailyValue * randomPercentage) / 100,
          targetValue: nutrient.dailyValue,
          percentage: randomPercentage,
          status: statusType,
        };
      });

      setNutrientStatus(status);
      setLoading(false);
      setAnalysisComplete(true);
    };

    analyzeNutrients();
  }, [userInfo, router, setNutrientStatus]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(to bottom, #eff6ff, #ffffff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ 
              width: "128px", 
              height: "128px", 
              margin: "0 auto",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                inset: "0",
                border: "8px solid #dbeafe",
                borderRadius: "50%"
              }}></div>
              <div style={{
                position: "absolute",
                inset: "0",
                border: "8px solid #2563eb",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
            </div>
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
            영양 상태를 분석하고 있습니다
          </h2>
          <p style={{ color: "#6b7280" }}>
            400여 가지 영양소를 종합적으로 검토중이에요...
          </p>
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

  const { nutrientStatus } = useUser();
  
  const deficientNutrients = nutrients.filter(n => {
    const status = nutrientStatus.find(s => s.nutrientId === n.id);
    return status?.status === "deficient" || status?.status === "low";
  });

  const wellBalancedNutrients = nutrients.filter(n => {
    const status = nutrientStatus.find(s => s.nutrientId === n.id);
    return status?.status === "normal";
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "32px 0" }}>
      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 16px" }}>
        {/* 헤더 */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          padding: "32px",
          marginBottom: "32px"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            marginBottom: "24px"
          }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
              {userInfo?.name}님의 영양 분석 결과
            </h1>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}>
                <Share2 style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                공유
              </button>
              <button style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}>
                <Download style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                다운로드
              </button>
            </div>
          </div>

          {/* 요약 정보 */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            marginBottom: "32px"
          }}>
            <div style={{ 
              backgroundColor: "#fef2f2", 
              padding: "24px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <AlertCircle style={{ 
                width: "48px", 
                height: "48px", 
                color: "#ef4444",
                margin: "0 auto 8px"
              }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#dc2626", marginBottom: "4px" }}>
                {deficientNutrients.length}개
              </div>
              <div style={{ color: "#6b7280" }}>부족한 영양소</div>
            </div>
            
            <div style={{ 
              backgroundColor: "#f0fdf4", 
              padding: "24px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <CheckCircle style={{ 
                width: "48px", 
                height: "48px", 
                color: "#10b981",
                margin: "0 auto 8px"
              }} />
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#059669", marginBottom: "4px" }}>
                {wellBalancedNutrients.length}개
              </div>
              <div style={{ color: "#6b7280" }}>적정 영양소</div>
            </div>
            
            <div style={{ 
              backgroundColor: "#eff6ff", 
              padding: "24px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", fontWeight: "bold", color: "#2563eb", marginBottom: "4px" }}>
                {Math.round((wellBalancedNutrients.length / nutrients.length) * 100)}%
              </div>
              <div style={{ color: "#6b7280" }}>영양 균형도</div>
            </div>
          </div>

          {/* 주요 메시지 */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            borderLeft: "4px solid #f59e0b",
            padding: "16px",
            marginBottom: "24px"
          }}>
            <p style={{ fontSize: "18px" }}>
              <span style={{ fontWeight: "600" }}>{userInfo?.name}님은 현재 </span>
              <span style={{ color: "#dc2626", fontWeight: "bold" }}>
                {deficientNutrients.slice(0, 3).map(n => n.koreanName).join(", ")}
              </span>
              {deficientNutrients.length > 3 && <span> 등</span>}
              <span style={{ fontWeight: "600" }}>이 부족한 상태입니다.</span>
            </p>
          </div>
        </div>

        {/* 부족한 영양소 상세 */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
            부족한 영양소 TOP 5
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {deficientNutrients.slice(0, 5).map((nutrient, index) => {
              const status = nutrientStatus.find(s => s.nutrientId === nutrient.id);
              if (!status) return null;
              
              return (
                <div key={nutrient.id} style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  padding: "24px" 
                }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: "32px", marginRight: "16px" }}>
                        {nutrient.character.emoji}
                      </span>
                      <div>
                        <h3 style={{ fontSize: "20px", fontWeight: "600" }}>
                          {nutrient.koreanName}
                        </h3>
                        <p style={{ color: "#6b7280" }}>{nutrient.character.name}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>
                        {Math.round(status.percentage)}%
                      </div>
                      <div style={{ fontSize: "14px", color: "#6b7280" }}>권장량 대비</div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "4px"
                    }}>
                      <span>현재: {status.currentValue.toFixed(1)}{nutrient.unit}</span>
                      <span>목표: {status.targetValue}{nutrient.unit}</span>
                    </div>
                    <div style={{ 
                      height: "16px", 
                      backgroundColor: "#e5e7eb", 
                      borderRadius: "9999px",
                      overflow: "hidden"
                    }}>
                      <div
                        style={{ 
                          height: "100%",
                          background: "linear-gradient(to right, #ef4444, #f97316)",
                          transition: "width 0.5s",
                          width: `${Math.min(status.percentage, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                    "{nutrient.character.personality}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 추천 플랜 */}
        <div style={{ 
          background: "linear-gradient(to right, #2563eb, #2563eb)",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          padding: "32px"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            맞춤 솔루션
          </h2>
          <p style={{ fontSize: "18px", marginBottom: "24px" }}>
            {userInfo?.name}님의 영양 상태를 개선하기 위한 밸런스밀 플랜을 추천합니다
          </p>
          
          <div style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
              추천 플랜: 밸런스밀 28일 프로그램
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <CheckCircle style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                부족한 영양소를 집중 보충하는 맞춤 식단
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <CheckCircle style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                매일 영양 코치의 1:1 피드백
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <CheckCircle style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                28일 후 영양 상태 재검사 무료 제공
              </li>
            </ul>
          </div>
          
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="/subscribe"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 32px",
                backgroundColor: "white",
                color: "#2563eb",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                transition: "background-color 0.2s"
              }}
            >
              밸런스밀 시작하기
              <ArrowRight style={{ width: "20px", height: "20px", marginLeft: "8px" }} />
            </Link>
            <Link
              href="/coaching"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 32px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                transition: "background-color 0.2s"
              }}
            >
              식단 코칭 받기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}