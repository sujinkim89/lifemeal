"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Google 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", padding: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
            HolyFit 로그인
          </h1>
          <p style={{ color: "#6b7280" }}>
            건강한 영양 관리를 시작하세요
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
              이메일
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px", color: "#9ca3af" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 44px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none"
                }}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
              비밀번호
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px", color: "#9ca3af" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 44px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none"
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af"
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: "20px", height: "20px" }} />
                ) : (
                  <Eye style={{ width: "20px", height: "20px" }} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: "#fef2f2", 
              border: "1px solid #fecaca", 
              borderRadius: "8px", 
              padding: "12px", 
              color: "#dc2626", 
              fontSize: "14px" 
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div style={{ position: "relative", textAlign: "center", margin: "16px 0" }}>
            <div style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%", height: "1px", backgroundColor: "#e5e7eb" }}></div>
            </div>
            <div style={{ position: "relative", backgroundColor: "white", padding: "0 16px" }}>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>또는</span>
            </div>
          </div>

{/* Google 로그인은 OAuth 설정 후 활성화 예정 */}
          {false && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "white",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                style={{ width: "20px", height: "20px" }}
              />
              Google로 로그인
            </button>
          )}
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            계정이 없으신가요?{" "}
            <Link 
              href="/auth/signup" 
              style={{ color: "#2563eb", textDecoration: "none", fontWeight: "500" }}
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}