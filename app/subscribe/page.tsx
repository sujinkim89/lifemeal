"use client";

import { ArrowRight, Check, Coffee, Heart, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const weeklyChanges = [
  {
    week: "1주차",
    title: "소화 개선",
    description: "역류성 식도염과 소화 불량이 개선되며, 배변이 원활해집니다.",
    icon: "🌿",
    color: "bg-green-100 text-green-700"
  },
  {
    week: "2주차", 
    title: "디톡스 시작",
    description: "몸속의 염증과 비정상 세포가 배출되며, 건강이 회복되기 시작해요.",
    icon: "✨",
    color: "bg-blue-100 text-blue-700"
  },
  {
    week: "3-4주차",
    title: "피부 재생",
    description: "피부가 재생되면서, 톤이 밝아지고 면역력이 강화됩니다.",
    icon: "🌟",
    color: "bg-purple-100 text-purple-700"
  },
  {
    week: "5-8주차",
    title: "장-뇌 연결 개선",
    description: "장내 미생물 환경이 건강하게 바뀌고, 더 자주 행복함과 평온함을 느끼게 됩니다.",
    icon: "🧠",
    color: "bg-pink-100 text-pink-700"
  },
  {
    week: "9-12주차",
    title: "완전한 변화",
    description: "매일 에너지가 넘치고, 체중도 자연스럽게 유지되며, 매일이 새롭게 태어난 기분이에요!",
    icon: "🎯",
    color: "bg-orange-100 text-orange-700"
  }
];

const subscriptionPlans = [
  {
    name: "체험 팩",
    duration: "7일",
    price: "49,000",
    originalPrice: "58,000",
    features: [
      "밸런스밀 7팩",
      "영양 분석 리포트",
      "전문가 상담 1회"
    ],
    popular: false
  },
  {
    name: "정기 구독",
    duration: "28일",
    price: "174,000",
    originalPrice: "232,000",
    features: [
      "밸런스밀 28팩",
      "매주 영양 분석 리포트",
      "전문가 상담 무제한",
      "레시피북 제공",
      "무료 배송"
    ],
    popular: true,
    savings: "25% 할인"
  },
  {
    name: "프리미엄",
    duration: "84일",
    price: "468,000",
    originalPrice: "696,000",
    features: [
      "밸런스밀 84팩",
      "맞춤형 영양 플랜",
      "1:1 전담 코치",
      "혈액검사 2회",
      "VIP 커뮤니티",
      "무료 배송"
    ],
    popular: false,
    savings: "33% 할인"
  }
];

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState(1); // 기본으로 정기구독 선택

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)", padding: "64px 0" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: "bold", marginBottom: "24px" }}>
              상상해보세요
            </h1>
            <p style={{ fontSize: "20px", color: "#374151", maxWidth: "768px", margin: "0 auto", lineHeight: "1.75" }}>
              하루 1팩으로 <span style={{ fontWeight: "600", color: "#2563eb" }}>400여 가지 미량 영양소</span>를
              고르게 섭취할 수 있는 건강한 식사가 있습니다.
            </p>
          </div>

          {/* Benefits Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", marginBottom: "64px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: "box-shadow 0.3s" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>🥗</div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>다양한 섭취 방법</h3>
              <p style={{ color: "#4b5563" }}>그냥 먹어도, 다양한 요리와 함께 먹어도 환상적이에요!</p>
            </div>
            
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: "box-shadow 0.3s" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>🌿</div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>장 건강 개선</h3>
              <p style={{ color: "#4b5563" }}>장내 미생물이 건강해지고, 소화도 편안해지며 배변도 자연스럽게 조절됩니다.</p>
            </div>
            
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: "box-shadow 0.3s" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>⚖️</div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>균형잡힌 몸</h3>
              <p style={{ color: "#4b5563" }}>미각의 균형이 잡히고 가공식품과 멀어지며 체중도 자연스럽게 조절됩니다.</p>
            </div>
          </div>

          <div style={{ background: "linear-gradient(to right, #2563eb, #2563eb)", color: "white", borderRadius: "24px", padding: "32px", textAlign: "center" }}>
            <Coffee style={{ width: "48px", height: "48px", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>바쁜 아침 30초면 충분해요!</h2>
            <p style={{ fontSize: "18px" }}>몸과 마음의 균형을 찾을 수 있답니다</p>
          </div>
        </div>
      </section>

      {/* Weekly Changes Timeline */}
      <section style={{ padding: "64px 0", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
              몸의 변화, 하루 커피 한 잔 가격으로!
            </h2>
            <p style={{ fontSize: "20px", color: "#4b5563" }}>주차별로 경험하게 될 놀라운 변화들</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {weeklyChanges.map((change, index) => (
              <div 
                key={index}
                style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "24px", borderRadius: "16px", backgroundColor: "#f9fafb", transition: "background-color 0.3s" }}
              >
                <div style={{ flexShrink: 0, width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", backgroundColor: change.color.includes("green") ? "#dcfce7" : change.color.includes("blue") ? "#dbeafe" : change.color.includes("purple") ? "#f3e8ff" : change.color.includes("pink") ? "#fce7f3" : "#fed7aa", color: change.color.includes("green") ? "#15803d" : change.color.includes("blue") ? "#1d4ed8" : change.color.includes("purple") ? "#7c3aed" : change.color.includes("pink") ? "#be185d" : "#ea580c" }}>
                  {change.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <span className="font-bold text-lg mr-3">{change.week}</span>
                    <h3 className="text-xl font-semibold">{change.title}</h3>
                  </div>
                  <p className="text-gray-700">{change.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 bg-gray-50">
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 className="text-3xl font-bold mb-4">구독 플랜 선택하기</h2>
            <p className="text-xl text-gray-600">당신의 건강 여정을 시작하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 ${
                  plan.popular ? 'ring-2 ring-primary transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      가장 인기있는 플랜
                    </span>
                  </div>
                )}

                {plan.savings && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {plan.savings}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.duration}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    ₩{plan.price}
                  </div>
                  <div className="text-gray-500 line-through">
                    ₩{plan.originalPrice}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(index)}
                  className={`w-full py-4 rounded-lg font-semibold transition ${
                    selectedPlan === index
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === index ? '선택됨' : '선택하기'}
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Button */}
          <div className="mt-12 text-center">
            <Link
              href="/checkout"
              className="inline-flex items-center px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition"
            >
              선택한 플랜으로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section style={{ padding: "64px 0", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
              밸런스밀 제품 갤러리
            </h2>
            <p style={{ fontSize: "20px", color: "#4b5563" }}>
              400여 가지 영양소가 담긴 건강한 한 끼
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "48px" }}>
            <div style={{ backgroundColor: "#f9fafb", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <Image src="/KakaoTalk_Photo_2025-07-19-16-07-31 007.jpeg" alt="건강한 아침 식사" width={300} height={200} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>활력 넘치는 아침</h3>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>하루의 시작을 건강하게, 에너지 충전</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#f9fafb", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <Image src="/KakaoTalk_Photo_2025-07-19-16-07-31 008.jpeg" alt="운동과 영양" width={300} height={200} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>운동 후 회복</h3>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>근육 회복과 성장을 위한 완벽한 영양</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#f9fafb", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <Image src="/KakaoTalk_Photo_2025-07-19-16-07-31 009.jpeg" alt="가족 건강" width={300} height={200} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>온 가족 건강</h3>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>남녀노소 누구나 즐기는 건강한 한 끼</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#f9fafb", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <Image src="/KakaoTalk_Photo_2025-07-19-16-07-31 010.jpeg" alt="면역력 강화" width={300} height={200} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>면역력 증진</h3>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>400여 가지 영양소로 튼튼한 면역력</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Usage Examples */}
      <section style={{ padding: "64px 0", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
              고객님들의 실제 사용 모습
            </h2>
            <p style={{ fontSize: "20px", color: "#4b5563" }}>
              다양한 방법으로 즐기는 밸런스밀
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            {[
              { src: "/KakaoTalk_Photo_2025-07-19-16-07-30 001.jpeg", title: "아침 식사 대용", desc: "바쁜 아침, 밸런스밀로 든든하게" },
              { src: "/KakaoTalk_Photo_2025-07-19-16-07-30 002.jpeg", title: "간식으로 즐기기", desc: "건강한 간식으로 완벽한 선택" },
              { src: "/KakaoTalk_Photo_2025-07-19-16-07-30 003.jpeg", title: "요리 재료로 활용", desc: "다양한 요리에 영양을 더하세요" },
              { src: "/KakaoTalk_Photo_2025-07-19-16-07-31 004.jpeg", title: "운동 전후 섭취", desc: "운동과 함께하는 건강한 루틴" },
              { src: "/KakaoTalk_Photo_2025-07-19-16-07-31 005.jpeg", title: "가족과 함께", desc: "온 가족이 함께 즐기는 건강식" },
              { src: "/KakaoTalk_Photo_2025-07-19-16-07-31 006.jpeg", title: "직장에서 간편하게", desc: "사무실에서도 간편하게 영양 섭취" }
            ].map((item, index) => (
              <div key={index} style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                <Image src={item.src} alt={item.title} width={400} height={250} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px" }}>
          <h2 className="text-3xl font-bold text-center mb-12">
            실제 고객님들의 후기
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">
                "아침마다 속이 불편했는데, 밸런스밀을 먹고 나서 소화가 정말 편해졌어요. 
                피부도 맑아지고 활력이 넘쳐요!"
              </p>
              <p className="font-semibold">김○○님 (38세, 직장인)</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">
                "3개월째 구독 중인데 정말 만족해요. 특히 장 건강이 좋아지면서 
                전반적인 컨디션이 많이 개선됐습니다."
              </p>
              <p className="font-semibold">박○○님 (45세, 주부)</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">
                "바쁜 아침에 간편하게 영양을 챙길 수 있어서 좋아요. 
                체중 관리도 자연스럽게 되고 있습니다."
              </p>
              <p className="font-semibold">이○○님 (52세, 자영업)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">
            지금 시작하면 첫 구독 25% 할인!
          </h2>
          <p className="text-xl mb-8">
            건강한 변화는 작은 한 걸음부터 시작됩니다
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center px-8 py-4 bg-white text-primary text-lg font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            지금 바로 시작하기
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}