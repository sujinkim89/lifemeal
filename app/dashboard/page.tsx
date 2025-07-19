"use client";

import { Camera, MessageCircle, TrendingUp, Settings, Plus, Calendar, Target } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/contexts/UserContext";
import { nutrients, getNutrientById } from "@/lib/data/nutrients";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { userInfo, nutrientStatus } = useUser();

  useEffect(() => {
    if (!userInfo) {
      router.push("/onboarding");
    }
  }, [userInfo, router]);

  if (!userInfo) {
    return null;
  }

  // 부족한 영양소 상위 3개
  const topDeficientNutrients = nutrientStatus
    .filter(s => s.status === "deficient" || s.status === "low")
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)
    .map(status => {
      const nutrient = getNutrientById(status.nutrientId);
      return { ...status, nutrient };
    });

  // 전체 영양 균형도
  const balanceScore = Math.round(
    (nutrientStatus.filter(s => s.status === "normal").length / nutrients.length) * 100
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <header style={{ backgroundColor: "white", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                안녕하세요, {userInfo.name}님! 👋
              </h1>
              <p style={{ color: "#6b7280", marginTop: "4px" }}>오늘도 건강한 하루 보내세요</p>
            </div>
            <Link
              href="/settings"
              style={{
                padding: "8px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background-color 0.2s"
              }}
            >
              <Settings style={{ width: "24px", height: "24px", color: "#6b7280" }} />
            </Link>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
          <Link
            href="/coaching"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              textDecoration: "none",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.2s",
              textAlign: "center",
              color: "inherit"
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              transition: "background-color 0.2s"
            }}>
              <Camera style={{ width: "28px", height: "28px", color: "#2563eb" }} />
            </div>
            <h3 style={{ fontWeight: "600", color: "#111827" }}>식단 기록 & 분석</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>사진으로 간편하게</p>
          </Link>

          <Link
            href="/coaching"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              textDecoration: "none",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.2s",
              textAlign: "center",
              color: "inherit"
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#dcfce7",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              transition: "background-color 0.2s"
            }}>
              <MessageCircle style={{ width: "28px", height: "28px", color: "#16a34a" }} />
            </div>
            <h3 style={{ fontWeight: "600", color: "#111827" }}>영양 코칭</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>AI 코치와 대화</p>
          </Link>

          <Link
            href="/analysis"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              textDecoration: "none",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.2s",
              textAlign: "center",
              color: "inherit"
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#f3e8ff",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              transition: "background-color 0.2s"
            }}>
              <TrendingUp style={{ width: "28px", height: "28px", color: "#9333ea" }} />
            </div>
            <h3 style={{ fontWeight: "600", color: "#111827" }}>분석 결과</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>영양 상태 확인</p>
          </Link>

          <Link
            href="/subscribe"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              textDecoration: "none",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.2s",
              textAlign: "center",
              color: "inherit"
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#fed7aa",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              transition: "background-color 0.2s"
            }}>
              <Plus style={{ width: "28px", height: "28px", color: "#ea580c" }} />
            </div>
            <h3 style={{ fontWeight: "600", color: "#111827" }}>밸런스밀</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>구독 관리</p>
          </Link>
        </div>
      </section>

      {/* Nutrition Overview */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{
          background: "linear-gradient(to right, #2563eb, #3b82f6)",
          color: "white",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>오늘의 영양 상태</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar style={{ width: "20px", height: "20px" }} />
              <span style={{ fontSize: "14px" }}>오늘</span>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>{balanceScore}%</div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>영양 균형도</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>{topDeficientNutrients.length}</div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>부족 영양소</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>B+</div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>건강 등급</div>
            </div>
          </div>
        </div>
      </section>

      {/* Deficient Nutrients Alert */}
      {topDeficientNutrients.length > 0 && (
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
            ⚠️ 주의가 필요한 영양소
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {topDeficientNutrients.map((item) => (
              <div
                key={item.nutrientId}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "32px" }}>{item.nutrient?.character.emoji}</div>
                  <div>
                    <h3 style={{ fontWeight: "600", color: "#111827" }}>
                      {item.nutrient?.koreanName}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>
                      권장량의 {Math.round(item.percentage)}% 섭취 중
                    </p>
                  </div>
                </div>
                <Link
                  href={`/coaching?coach=${item.nutrientId}`}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    textDecoration: "none",
                    transition: "background-color 0.2s"
                  }}
                >
                  개선방법 보기
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Goals */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
        <h2 style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center"
        }}>
          <Target style={{ width: "20px", height: "20px", marginRight: "8px" }} />
          오늘의 목표
        </h2>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  💧
                </div>
                <div>
                  <p style={{ fontWeight: "500" }}>물 8잔 마시기</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>현재 3잔 완료</p>
                </div>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>3/8</div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#dcfce7",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  🥗
                </div>
                <div>
                  <p style={{ fontWeight: "500" }}>채소 5접시 섭취</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>다양한 색깔의 채소로</p>
                </div>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a" }}>2/5</div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f3e8ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  🍖
                </div>
                <div>
                  <p style={{ fontWeight: "500" }}>단백질 목표 달성</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>체중 1kg당 1g</p>
                </div>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#9333ea" }}>45%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTop: "1px solid #e5e7eb"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 0" }}>
            <Link
              href="/dashboard"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: "#2563eb"
              }}
            >
              <div style={{ width: "24px", height: "24px" }}>🏠</div>
              <span style={{ fontSize: "12px", fontWeight: "500" }}>홈</span>
            </Link>
            <Link
              href="/coaching"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: "#6b7280"
              }}
            >
              <Camera style={{ width: "24px", height: "24px" }} />
              <span style={{ fontSize: "12px" }}>기록</span>
            </Link>
            <Link
              href="/coaching"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: "#6b7280"
              }}
            >
              <MessageCircle style={{ width: "24px", height: "24px" }} />
              <span style={{ fontSize: "12px" }}>코칭</span>
            </Link>
            <Link
              href="/analysis"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: "#6b7280"
              }}
            >
              <TrendingUp style={{ width: "24px", height: "24px" }} />
              <span style={{ fontSize: "12px" }}>분석</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Bottom padding for navigation */}
      <div style={{ height: "80px" }}></div>
    </div>
  );
}