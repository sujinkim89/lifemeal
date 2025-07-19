"use client";

import { ArrowLeft, ArrowRight, Send, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useUser, UserInfo } from "@/lib/contexts/UserContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserInfo: setContextUserInfo } = useUser();
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    mealPattern: "",
    healthCheckup: "",
  });

  // 식단 채팅 관련 상태
  const [mealMessages, setMealMessages] = useState<{ id: string; type: "ai" | "user"; content: string; timestamp: Date }[]>([]);
  const [currentMealInput, setCurrentMealInput] = useState("");
  const [collectedMeals, setCollectedMeals] = useState<string[]>([]);
  const [mealStep, setMealStep] = useState(0); // 0: 아침, 1: 점심, 2: 저녁
  const [isWaitingForMeal, setIsWaitingForMeal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mealSteps = ["아침", "점심", "저녁"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mealMessages]);

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
      // 식단 입력 단계로 들어갈 때 초기 메시지 설정
      if (step === 5) {
        initializeMealChat();
      }
    } else {
      setContextUserInfo({
        ...userInfo,
        recentMeals: collectedMeals
      });
      router.push("/analysis");
    }
  };

  const initializeMealChat = () => {
    const welcomeMessage = {
      id: "welcome",
      type: "ai" as const,
      content: `안녕하세요, ${userInfo.name}님! 🍽️\n\n더 정확한 영양 분석을 위해 최근 드신 식단을 알려주세요.\n\n먼저 어제 ${mealSteps[0]}에 드신 음식을 알려주시겠어요?\n\n예시: "김치볶음밥과 계란국을 먹었어요"`,
      timestamp: new Date()
    };
    setMealMessages([welcomeMessage]);
    setIsWaitingForMeal(true);
  };

  const handleMealSubmit = () => {
    if (!currentMealInput.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user" as const,
      content: currentMealInput,
      timestamp: new Date()
    };

    setMealMessages(prev => [...prev, userMessage]);
    setCollectedMeals(prev => [...prev, currentMealInput]);
    setCurrentMealInput("");

    // AI 응답 생성
    setTimeout(() => {
      let aiResponse = "";
      const nextMealIndex = mealStep + 1;

      if (nextMealIndex < mealSteps.length) {
        aiResponse = `네, 잘 알겠습니다! 👍\n\n이제 어제 ${mealSteps[nextMealIndex]}에는 무엇을 드셨나요?`;
        setMealStep(nextMealIndex);
      } else {
        aiResponse = `훌륭해요! 🎉\n\n총 3끼 식단 정보를 모두 받았습니다:\n• 아침: ${collectedMeals[0]}\n• 점심: ${collectedMeals[1]}\n• 저녁: ${currentMealInput}\n\n이 정보를 바탕으로 400여 가지 영양소를 분석해드릴게요!`;
        setIsWaitingForMeal(false);
      }

      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: "ai" as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setMealMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / 6) * 100;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "32px 0" }}>
      <div style={{ maxWidth: "768px", margin: "0 auto", padding: "0 16px" }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <Link 
              href="/" 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                color: "#6b7280", 
                textDecoration: "none",
                fontSize: "14px"
              }}
            >
              <ArrowLeft style={{ width: "20px", height: "20px", marginRight: "8px" }} />
              처음으로
            </Link>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>{step} / 6</span>
          </div>
          <div style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
            <div 
              style={{ 
                height: "100%", 
                backgroundColor: "#2563eb", 
                transition: "width 0.3s",
                width: `${progress}%`
              }}
            />
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          padding: "32px"
        }}>
          {/* Step 1: 기본 정보 */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
                기본 정보를 입력해주세요
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                    이름
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                      outline: "none"
                    }}
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                    성별
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <button
                      onClick={() => handleInputChange("gender", "male")}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `2px solid ${userInfo.gender === "male" ? "#2563eb" : "#d1d5db"}`,
                        backgroundColor: userInfo.gender === "male" ? "#dbeafe" : "white",
                        color: userInfo.gender === "male" ? "#2563eb" : "#374151",
                        cursor: "pointer",
                        fontSize: "16px"
                      }}
                    >
                      남성
                    </button>
                    <button
                      onClick={() => handleInputChange("gender", "female")}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `2px solid ${userInfo.gender === "female" ? "#2563eb" : "#d1d5db"}`,
                        backgroundColor: userInfo.gender === "female" ? "#dbeafe" : "white",
                        color: userInfo.gender === "female" ? "#2563eb" : "#374151",
                        cursor: "pointer",
                        fontSize: "16px"
                      }}
                    >
                      여성
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                    나이
                  </label>
                  <input
                    type="number"
                    value={userInfo.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                      outline: "none"
                    }}
                    placeholder="30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 신체 정보 */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
                신체 정보를 입력해주세요
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                    키 (cm)
                  </label>
                  <input
                    type="number"
                    value={userInfo.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                      outline: "none"
                    }}
                    placeholder="170"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                    체중 (kg)
                  </label>
                  <input
                    type="number"
                    value={userInfo.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                      outline: "none"
                    }}
                    placeholder="65"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 라이프스타일 */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
                라이프스타일을 알려주세요
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "12px" }}>
                    평소 활동량은 어느 정도인가요?
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { value: "low", label: "낮음 (주로 앉아서 생활)" },
                      { value: "medium", label: "보통 (가벼운 활동)" },
                      { value: "high", label: "높음 (규칙적인 운동)" },
                      { value: "very-high", label: "매우 높음 (강도 높은 운동)" }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange("activityLevel", option.value)}
                        style={{
                          textAlign: "left",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: `2px solid ${userInfo.activityLevel === option.value ? "#2563eb" : "#d1d5db"}`,
                          backgroundColor: userInfo.activityLevel === option.value ? "#dbeafe" : "white",
                          color: userInfo.activityLevel === option.value ? "#2563eb" : "#374151",
                          cursor: "pointer",
                          fontSize: "16px"
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: 건강 검진 */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
                최근 건강검진 정보
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "12px" }}>
                    최근 1년 이내 건강검진을 받으셨나요?
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <button
                      onClick={() => handleInputChange("healthCheckup", "yes")}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `2px solid ${userInfo.healthCheckup === "yes" ? "#2563eb" : "#d1d5db"}`,
                        backgroundColor: userInfo.healthCheckup === "yes" ? "#dbeafe" : "white",
                        color: userInfo.healthCheckup === "yes" ? "#2563eb" : "#374151",
                        cursor: "pointer",
                        fontSize: "16px"
                      }}
                    >
                      예
                    </button>
                    <button
                      onClick={() => handleInputChange("healthCheckup", "no")}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `2px solid ${userInfo.healthCheckup === "no" ? "#2563eb" : "#d1d5db"}`,
                        backgroundColor: userInfo.healthCheckup === "no" ? "#dbeafe" : "white",
                        color: userInfo.healthCheckup === "no" ? "#2563eb" : "#374151",
                        cursor: "pointer",
                        fontSize: "16px"
                      }}
                    >
                      아니오
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: 확인 */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
                입력하신 정보를 확인해주세요
              </h2>
              
              <div style={{ 
                backgroundColor: "#f9fafb", 
                borderRadius: "8px", 
                padding: "24px",
                marginBottom: "24px"
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>이름</span>
                    <span style={{ fontWeight: "500" }}>{userInfo.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>성별</span>
                    <span style={{ fontWeight: "500" }}>
                      {userInfo.gender === "male" ? "남성" : "여성"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>나이</span>
                    <span style={{ fontWeight: "500" }}>{userInfo.age}세</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>키/체중</span>
                    <span style={{ fontWeight: "500" }}>
                      {userInfo.height}cm / {userInfo.weight}kg
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ textAlign: "center", color: "#6b7280" }}>
                입력하신 정보를 바탕으로 400여 가지 영양소 분석을 시작합니다
              </p>
            </div>
          )}

          {/* Step 6: 식단 입력 채팅 */}
          {step === 6 && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
                최근 식단 정보 입력
              </h2>
              
              {/* 채팅 컨테이너 */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}>
                {/* 채팅 메시지 영역 */}
                <div style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  {mealMessages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        display: "flex",
                        justifyContent: message.type === "user" ? "flex-end" : "flex-start"
                      }}
                    >
                      <div style={{ maxWidth: "80%" }}>
                        {message.type === "ai" && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <div style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#2563eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px"
                            }}>
                              🤖
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                              영양 분석 AI
                            </span>
                          </div>
                        )}
                        <div
                          style={{
                            padding: "12px 16px",
                            borderRadius: "16px",
                            backgroundColor: message.type === "user" ? "#2563eb" : "#f3f4f6",
                            color: message.type === "user" ? "white" : "#374151",
                            whiteSpace: "pre-line",
                            fontSize: "14px",
                            lineHeight: "1.5"
                          }}
                        >
                          {message.content}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          marginTop: "4px",
                          textAlign: message.type === "user" ? "right" : "left"
                        }}>
                          {message.timestamp.toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                {isWaitingForMeal && (
                  <div style={{
                    borderTop: "1px solid #e5e7eb",
                    padding: "16px",
                    backgroundColor: "#f9fafb"
                  }}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleMealSubmit();
                      }}
                      style={{ display: "flex", gap: "8px" }}
                    >
                      <input
                        type="text"
                        value={currentMealInput}
                        onChange={(e) => setCurrentMealInput(e.target.value)}
                        placeholder={`어제 ${mealSteps[mealStep]}에 드신 음식을 알려주세요...`}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "24px",
                          fontSize: "14px",
                          outline: "none"
                        }}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!currentMealInput.trim()}
                        style={{
                          padding: "12px 16px",
                          backgroundColor: !currentMealInput.trim() ? "#9ca3af" : "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "20px",
                          cursor: !currentMealInput.trim() ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Send style={{ width: "16px", height: "16px" }} />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* 진행 상태 표시 */}
              <div style={{
                marginTop: "16px",
                padding: "12px 16px",
                backgroundColor: "#f0f9ff",
                borderRadius: "8px",
                border: "1px solid #0ea5e9"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#0c4a6e", fontWeight: "500" }}>
                    식단 입력 진행도
                  </span>
                  <span style={{ fontSize: "14px", color: "#0c4a6e" }}>
                    {collectedMeals.length} / 3
                  </span>
                </div>
                <div style={{
                  marginTop: "8px",
                  height: "4px",
                  backgroundColor: "#e0f2fe",
                  borderRadius: "2px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    backgroundColor: "#0ea5e9",
                    width: `${(collectedMeals.length / 3) * 100}%`,
                    transition: "width 0.3s"
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
            <button
              onClick={handleBack}
              disabled={step === 1}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 24px",
                borderRadius: "8px",
                backgroundColor: step === 1 ? "#f3f4f6" : "#e5e7eb",
                color: step === 1 ? "#9ca3af" : "#374151",
                border: "none",
                cursor: step === 1 ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              <ArrowLeft style={{ width: "20px", height: "20px", marginRight: "8px" }} />
              이전
            </button>

            <button
              onClick={handleNext}
              disabled={step === 6 && collectedMeals.length < 3}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 24px",
                backgroundColor: (step === 6 && collectedMeals.length < 3) ? "#9ca3af" : "#2563eb",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: (step === 6 && collectedMeals.length < 3) ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              {step === 5 ? "식단 입력하기" : step === 6 ? "분석 시작" : "다음"}
              <ArrowRight style={{ width: "20px", height: "20px", marginLeft: "8px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}