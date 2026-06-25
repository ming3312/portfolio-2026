import { useState, useRef, useEffect } from "react";
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
    phone: "",
    category: "디자인",
    message: ""
  });
  
  const [focusedField, setFocusedField] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { value: "디자인", label: "디자인 (UX/UI & Brand Design)" },
    { value: "홈페이지 제작", label: "홈페이지 제작 (Web Publishing)" },
    { value: "홈페이지 제작 및 개발", label: "홈페이지 제작 및 개발 (Full-Stack Build)" },
    { value: "개발 및 유지보수", label: "개발 및 유지보수 (Systems & Maintenance)" }
  ];

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
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
            phone: formData.phone,
            category: formData.category,
            message: formData.message
          }
        ]);

      if (error) {
        throw error;
      }

      setIsSending(false);
      setIsSent(true);
      setFormData({ name: "", phone: "", category: "디자인", message: "" });
      
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
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginTop: "16px",
            letterSpacing: "0.5px",
            opacity: 0.8,
            lineHeight: 1.6,
            maxWidth: "540px",
            margin: "16px auto 0",
            wordBreak: "keep-all"
          }}>
            Let's build something exceptional together. Get in touch to start your next digital milestone.
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

              {/* 2. 연락처 필드 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-sub)", letterSpacing: "1.5px", fontWeight: 600 }}>
                  YOUR PHONE NUMBER <span style={{ color: "var(--color-pink)" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="연락받으실 전화번호를 입력해 주세요."
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  style={getGlowingStyle("phone")}
                  className="hover-target"
                />
              </div>

              {/* 3. 카테고리 필드 (의뢰 종류 - 커스텀 드롭다운) */}
              <div 
                ref={dropdownRef}
                style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}
              >
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-sub)", letterSpacing: "1.5px", fontWeight: 600 }}>
                  PROJECT CATEGORY
                </label>
                
                {/* 커스텀 셀렉트 헤더 버튼 */}
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onFocus={() => setFocusedField("category")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...getGlowingStyle("category"),
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    position: "relative"
                  }}
                  className="hover-target"
                >
                  <span style={{ fontSize: "14px" }}>
                    {categories.find(c => c.value === formData.category)?.label || formData.category}
                  </span>
                  <span style={{
                    transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    display: "inline-block",
                    fontSize: "10px",
                    opacity: 0.6
                  }}>
                    ▼
                  </span>
                </div>

                {/* 커스텀 옵션 목록 드롭다운 */}
                {isDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      width: "100%",
                      backgroundColor: "#050508", // 더 깊고 진한 블랙 색상 적용
                      border: "1px solid rgba(255, 45, 120, 0.25)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      zIndex: 100,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 45, 120, 0.15)",
                      display: "flex",
                      flexDirection: "column",
                      animation: "dropdownFadeIn 0.2s cubic-bezier(0.25, 1, 0.5, 1)"
                    }}
                  >
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        onClick={() => {
                          setFormData({ ...formData, category: cat.value });
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: "14px 18px", // 여유로운 패딩값 부여
                          color: formData.category === cat.value ? "var(--color-pink)" : "var(--color-white)",
                          backgroundColor: formData.category === cat.value ? "rgba(255, 45, 120, 0.05)" : "transparent",
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.02)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 45, 120, 0.08)";
                          e.currentTarget.style.color = "var(--color-pink)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = formData.category === cat.value ? "rgba(255, 45, 120, 0.05)" : "transparent";
                          e.currentTarget.style.color = formData.category === cat.value ? "var(--color-pink)" : "var(--color-white)";
                        }}
                      >
                        {cat.label}
                      </div>
                    ))}
                  </div>
                )}
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

      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    </section>
  );
};

export default ContactSection;
