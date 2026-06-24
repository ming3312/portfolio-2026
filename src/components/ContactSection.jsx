import React, { useState, useRef } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 초기화 (Vite 환경 변수 사용)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ContactSection = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "디자인",
    message: ""
  });
  
  const [focusedField, setFocusedField] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("모든 필수 입력 필드를 기입해 주세요.");
      return;
    }

    setIsSending(true);

    try {
      // Supabase contacts 테이블에 데이터 실시간 삽입
      const { error } = await supabase
        .from("contacts")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            category: formData.category,
            message: formData.message
          }
        ]);

      if (error) {
        throw error;
      }

      setIsSending(false);
      setIsSent(true);
      setFormData({ name: "", email: "", category: "Web Development", message: "" });
      
      // 5초 후 성공 팝업 리셋
      setTimeout(() => setIsSent(false), 5000);

    } catch (error) {
      console.error("데이터베이스 전송 실패:", error);
      setIsSending(false);
      alert("데이터베이스 전송에 실패하였습니다. 다시 시도해 주세요.");
    }
  };

  // 포커스 시 핫핑크 네온 글로잉 스타일 생성 도우미
  const getGlowingStyle = (fieldName) => {
    const isFocused = focusedField === fieldName;
    return {
      width: "100%",
      backgroundColor: "rgba(16, 17, 22, 0.4)",
      border: isFocused ? "1px solid var(--color-pink)" : "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      padding: "16px",
      color: "var(--color-white)",
      fontFamily: "var(--font-body)",
      fontSize: "15px",
      outline: "none",
      boxShadow: isFocused 
        ? "0 0 15px rgba(255, 45, 120, 0.25), inset 0 0 5px rgba(255, 45, 120, 0.1)" 
        : "none",
      transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
      cursor: "none"
    };
  };

  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        minHeight: "100vh",
        padding: "160px 100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--bg-base)",
        position: "relative",
        zIndex: 10
      }}
    >
      <div style={{ width: "100%", maxWidth: "700px" }}>
        
        {/* 상단 타이틀 */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{
            fontFamily: "var(--font-sub)",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--color-pink)",
            letterSpacing: "3px"
          }}>
            PHASE 05
          </span>
          <h2 style={{
            fontFamily: "var(--font-headline)",
            fontWeight: 800,
            fontSize: "clamp(36px, 4.5vw, 56px)",
            color: "var(--color-white)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            marginTop: "8px"
          }}>
            START A PROJECT
          </h2>
          <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: "15px", marginTop: "14px", opacity: 0.8 }}>
            세련된 디자인과 튼튼한 기술의 융합. 새로운 차원의 웹 프로젝트 의뢰를 시작해보세요.
          </p>
        </div>

        {/* 글로잉 의뢰 폼 카드 */}
        <div 
          className="liquid-glass glow-card contact-form-container"
          style={{
            padding: "50px 40px",
            position: "relative",
            width: "100%",
            borderColor: "rgba(255, 45, 120, 0.1)"
          }}
        >
          {isSent ? (
            /* 전송 성공 시 Neon 축하 화면 */
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 0",
                textAlign: "center"
              }}
            >
              <CheckCircle2 size={54} color="var(--color-yellow)" style={{ filter: "drop-shadow(0 0 8px rgba(255,224,0,0.6))", marginBottom: "20px" }} />
              <h3 style={{ fontSize: "24px", color: "var(--color-white)", fontWeight: 800, marginBottom: "12px" }}>
                MESSAGE SENT SUCCESSFULLY!
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", maxWidth: "400px" }}>
                의뢰 정보가 안전하게 전달되었습니다. 작성해 주신 연락처로 신속하게 답변드리겠습니다.
              </p>
            </div>
          ) : (
            /* 실제 폼 입력 영역 */
            <form ref={formRef} onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* 1. 성함 필드 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-sub)", letterSpacing: "1.5px", fontWeight: 600 }}>
                  YOUR NAME <span style={{ color: "var(--color-pink)" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="성함을 입력해 주세요."
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={getGlowingStyle("name")}
                  className="hover-target"
                />
              </div>

              {/* 2. 이메일 필드 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-sub)", letterSpacing: "1.5px", fontWeight: 600 }}>
                  YOUR EMAIL ADDRESS <span style={{ color: "var(--color-pink)" }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="답변 받으실 이메일을 입력해 주세요."
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={getGlowingStyle("email")}
                  className="hover-target"
                />
              </div>

              {/* 3. 카테고리 필드 (의뢰 종류) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-sub)", letterSpacing: "1.5px", fontWeight: 600 }}>
                  PROJECT CATEGORY
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("category")}
                  onBlur={() => setFocusedField(null)}
                  style={getGlowingStyle("category")}
                  className="hover-target"
                >
                  <option value="디자인">디자인 (UX/UI & Brand Design)</option>
                  <option value="홈페이지 제작">홈페이지 제작 (Web Publishing)</option>
                  <option value="홈페이지 제작 및 개발">홈페이지 제작 및 개발 (Full-Stack Build)</option>
                  <option value="개발 및 유지보수">개발 및 유지보수 (Systems & Maintenance)</option>
                </select>
              </div>

              {/* 4. 내용 필드 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-sub)", letterSpacing: "1.5px", fontWeight: 600 }}>
                  PROJECT DESCRIPTION <span style={{ color: "var(--color-pink)" }}>*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="의뢰 목적, 대략적인 프로젝트 기간 및 예산을 적어주시면 상세한 컨설팅에 큰 도움이 됩니다."
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...getGlowingStyle("message"), resize: "none" }}
                  className="hover-target"
                />
              </div>

              {/* 전송 버튼 */}
              <button
                type="submit"
                disabled={isSending}
                style={{
                  marginTop: "12px",
                  padding: "16px 32px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: isSending ? "rgba(255, 45, 120, 0.4)" : "var(--color-pink)",
                  color: "var(--color-white)",
                  fontFamily: "var(--font-sub)",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "1.5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: isSending ? "none" : "0 0 20px rgba(255, 45, 120, 0.35)",
                  transition: "transform 0.2s ease, background-color 0.2s ease",
                  cursor: "none"
                }}
                onMouseEnter={(e) => { if(!isSending) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                className="hover-target"
              >
                {isSending ? (
                  <span>SENDING...</span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send size={16} />
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
