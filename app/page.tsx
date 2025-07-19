import { ArrowRight, CheckCircle, Heart, Shield, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            backgroundColor: "#dbeafe", 
            padding: "8px 16px", 
            borderRadius: "9999px", 
            marginBottom: "32px",
            color: "#1d4ed8",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            <Shield style={{ marginRight: "8px", width: "16px", height: "16px" }} />
            의사가 개발한 과학적 영양 솔루션
          </div>
          
          <h1 style={{ 
            marginBottom: "24px", 
            fontSize: "48px", 
            fontWeight: "bold", 
            color: "#111827",
            lineHeight: "1.2"
          }}>
            진짜 건강은
            <span style={{ display: "block", color: "#2563eb" }}>400여 가지 영양소 균형</span>
            에서 시작됩니다
          </h1>
          
          <p style={{ 
            margin: "0 auto 40px", 
            maxWidth: "512px", 
            fontSize: "20px", 
            color: "#6b7280"
          }}>
            단순한 탄단지 계산을 넘어, 현대인에게 부족한 400여 가지 미량 영양소를
            과학적으로 분석하고 맞춤 솔루션을 제공합니다.
          </p>
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "16px", 
            marginBottom: "64px"
          }}>
            <Link 
              href="/auth/signup" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer"
              }}
            >
              무료 회원가입
              <ArrowRight style={{ marginLeft: "8px", width: "20px", height: "20px" }} />
            </Link>
            <Link 
              href="/auth/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "white",
                color: "#2563eb",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "600",
                border: "2px solid #2563eb",
                cursor: "pointer"
              }}
            >
              로그인
            </Link>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>400+</div>
              <div style={{ color: "#6b7280" }}>미량 영양소 분석</div>
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>30,000+</div>
              <div style={{ color: "#6b7280" }}>건강 개선 사례</div>
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>98%</div>
              <div style={{ color: "#6b7280" }}>재구독률</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: "80px 0", backgroundColor: "#f3f4f6" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
              왜 '탄단지'만으로는 부족할까요?
            </h2>
            <p style={{ fontSize: "20px", color: "#6b7280" }}>
              칼로리만 계산하다 놓치게 되는 중요한 영양소들이 있습니다
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "12px", 
              padding: "24px", 
              textAlign: "center",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ marginBottom: "16px", fontSize: "32px" }}>⚠️</div>
              <h3 style={{ marginBottom: "12px", fontSize: "20px", fontWeight: "bold" }}>영양 불균형</h3>
              <p style={{ color: "#6b7280" }}>
                칼로리와 3대 영양소만 신경쓰다 보면 비타민, 미네랄 등 필수 영양소가 부족해집니다
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "12px", 
              padding: "24px", 
              textAlign: "center",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ marginBottom: "16px", fontSize: "32px" }}>😰</div>
              <h3 style={{ marginBottom: "12px", fontSize: "20px", fontWeight: "bold" }}>만성 피로</h3>
              <p style={{ color: "#6b7280" }}>
                영양소 부족은 피로, 면역력 저하, 피부 트러블 등 다양한 건강 문제로 이어집니다
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "12px", 
              padding: "24px", 
              textAlign: "center",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ marginBottom: "16px", fontSize: "32px" }}>📊</div>
              <h3 style={{ marginBottom: "12px", fontSize: "20px", fontWeight: "bold" }}>개인차 무시</h3>
              <p style={{ color: "#6b7280" }}>
                나이, 성별, 생활습관에 따라 필요한 영양소가 다른데 획일적인 기준만 따르고 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "80px 0", backgroundColor: "#2563eb", color: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "bold" }}>
            지금 바로 당신의 영양 상태를 확인해보세요
          </h2>
          <p style={{ marginBottom: "32px", fontSize: "20px", opacity: 0.9 }}>
            3분 진단으로 400여 가지 영양소 분석 리포트를 받아보실 수 있습니다
          </p>
          <Link 
            href="/onboarding" 
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "white",
              color: "#2563eb",
              padding: "16px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer"
            }}
          >
            무료 진단 시작하기
            <ArrowRight style={{ marginLeft: "8px", width: "20px", height: "20px" }} />
          </Link>
        </div>
      </section>
    </div>
  );
}