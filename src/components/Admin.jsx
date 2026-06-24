import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Unlock, 
  MessageSquare, 
  Calendar, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Search, 
  Filter, 
  BarChart3, 
  LogOut, 
  Mail, 
  User, 
  Tag,
  AlertCircle,
  Phone
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 초기화
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Admin = ({ navigateTo }) => {
  // --- 상태 관리 ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'messages'
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // 상세 모달 상태
  const [selectedContact, setSelectedContact] = useState(null);

  // --- 비밀번호 확인 ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // 환경변수 VITE_ADMIN_PASSWORD가 설정되어 있으면 사용하고, 없으면 기본값 '1234'로 검증
    const targetPassword = import.meta.env.VITE_ADMIN_PASSWORD || "1234";

    if (passcode === targetPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setLoginError("");
    } else {
      setLoginError("비밀번호가 일치하지 않습니다. 다시 입력해 주세요.");
      setPasscode("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    setPasscode("");
  };

  // --- Supabase 데이터 패치 ---
  const fetchContacts = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      console.error("데이터 패치 실패:", err);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [isAuthenticated]);

  // --- 데이터 삭제 ---
  const handleDeleteContact = async (id) => {
    if (!window.confirm("정말로 이 문의 내역을 영구 삭제하시겠습니까?")) return;
    
    setIsDeletingId(id);
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // 삭제 성공 후 프론트엔드 상태 업데이트 및 상세 모달 열려있으면 닫기
      setContacts(prev => prev.filter(item => item.id !== id));
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 처리에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // --- 통계 가공 ---
  const totalCount = contacts.length;
  
  const todayCount = contacts.filter(item => {
    const todayStr = new Date().toISOString().split("T")[0];
    const createdStr = new Date(item.created_at).toISOString().split("T")[0];
    return todayStr === createdStr;
  }).length;

  const categoryStats = {
    "디자인": 0,
    "홈페이지 제작": 0,
    "홈페이지 제작 및 개발": 0,
    "개발 및 유지보수": 0
  };

  contacts.forEach(item => {
    let cat = item.category;
    // 이전 영문 더미/테스트 데이터 매핑 지원
    if (cat === "Branding & Design") cat = "디자인";
    if (cat === "Web Development") cat = "홈페이지 제작";
    if (cat === "AI & Full-Stack") cat = "홈페이지 제작 및 개발";
    if (cat === "Consulting & Etc") cat = "개발 및 유지보수";
    
    if (!cat) cat = "디자인";

    if (categoryStats[cat] !== undefined) {
      categoryStats[cat] += 1;
    } else {
      categoryStats["디자인"] += 1;
    }
  });

  // --- 필터링 처리 ---
  const filteredContacts = contacts.filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // 포맷팅 헬퍼
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  // --- 1. 로그인 인증 화면 (Lock Screen) ---
  if (!isAuthenticated) {
    return (
      <div 
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 20
        }}
      >
        <div 
          className="liquid-glass glow-card"
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "40px",
            textAlign: "center",
            borderColor: "rgba(255, 45, 120, 0.15)"
          }}
        >
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "1.5px solid var(--color-pink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 15px rgba(255, 45, 120, 0.25)",
            background: "rgba(5, 5, 8, 0.6)"
          }}>
            <Lock size={24} color="var(--color-pink)" />
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-white)", letterSpacing: "1px", marginBottom: "8px" }}>
            ADMIN ACCESS CONTROL
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "30px" }}>
            관리자 보안 인증이 필요합니다.
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input 
              type="password"
              placeholder="보안 코드를 입력해 주세요."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              autoFocus
              style={{
                width: "100%",
                backgroundColor: "rgba(16, 17, 22, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "14px 16px",
                color: "var(--color-white)",
                fontSize: "14px",
                textAlign: "center",
                letterSpacing: "4px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--color-pink)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.08)"}
            />

            {loginError && (
              <p style={{ color: "var(--color-pink)", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <AlertCircle size={14} />
                {loginError}
              </p>
            )}

            <button 
              type="submit"
              className="hover-target"
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--color-pink)",
                color: "var(--color-white)",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(255, 45, 120, 0.3)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              인증 및 접속
            </button>
          </form>

          <button
            onClick={() => navigateTo("/")}
            style={{
              marginTop: "24px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "13px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              opacity: 0.7
            }}
          >
            <ArrowLeft size={14} /> 포트폴리오 사이트로 이동
          </button>
        </div>
      </div>
    );
  }

  // --- 2. 인증 성공 후 관리자 대시보드 화면 ---
  return (
    <div 
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#050508",
        position: "relative",
        zIndex: 20,
        fontFamily: "Pretendard, sans-serif",
        color: "var(--color-white)"
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-main-content {
            margin-left: 0 !important;
            padding: 30px 20px !important;
          }
          .admin-metric-cards {
            grid-template-columns: 1fr !important;
          }
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-mobile-header {
            display: flex !important;
          }
        }
        .admin-mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(11, 12, 16, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 14px 20px;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>

      {/* 모바일 전용 상단 헤더 */}
      <div className="admin-mobile-header">
        <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "1px" }}>
          Maison <span style={{ color: "var(--color-pink)" }}>▪</span>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 400, marginLeft: "6px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setActiveTab("dashboard")} style={{ border: "none", background: activeTab === "dashboard" ? "rgba(255,45,120,0.1)" : "transparent", color: activeTab === "dashboard" ? "var(--color-pink)" : "var(--text-secondary)", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>대시보드</button>
          <button onClick={() => setActiveTab("messages")} style={{ border: "none", background: activeTab === "messages" ? "rgba(255,45,120,0.1)" : "transparent", color: activeTab === "messages" ? "var(--color-pink)" : "var(--text-secondary)", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>문의</button>
          <button onClick={handleLogout} style={{ border: "none", background: "transparent", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}>로그아웃</button>
        </div>
      </div>
      {/* ── 좌측 사이드바 ── */}
      <aside 
        className="admin-sidebar"
        style={{
          width: "280px",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          backgroundColor: "rgba(11, 12, 16, 0.8)",
          backdropFilter: "blur(20px)",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 10
        }}
      >
        {/* 로고 영역 */}
        <div style={{ marginBottom: "50px" }}>
          <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-white)" }}>
            Maison <span style={{ color: "var(--color-pink)", fontSize: "16px" }}>▪</span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "2.5px", marginTop: "4px" }}>
            Admin Console
          </div>
        </div>

        {/* 네비게이션 */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", padding: "10px 12px 6px", textTransform: "uppercase" }}>
            메인 관리
          </div>
          
          <button 
            onClick={() => setActiveTab("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "dashboard" ? 700 : 500,
              color: activeTab === "dashboard" ? "var(--color-white)" : "var(--text-secondary)",
              backgroundColor: activeTab === "dashboard" ? "rgba(255, 45, 120, 0.1)" : "transparent",
              borderLeft: activeTab === "dashboard" ? "3px solid var(--color-pink)" : "3px solid transparent",
              transition: "all 0.2s"
            }}
          >
            <BarChart3 size={16} color={activeTab === "dashboard" ? "var(--color-pink)" : "currentColor"} />
            대시보드 요약
          </button>

          <button 
            onClick={() => setActiveTab("messages")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === "messages" ? 700 : 500,
              color: activeTab === "messages" ? "var(--color-white)" : "var(--text-secondary)",
              backgroundColor: activeTab === "messages" ? "rgba(255, 45, 120, 0.1)" : "transparent",
              borderLeft: activeTab === "messages" ? "3px solid var(--color-pink)" : "3px solid transparent",
              transition: "all 0.2s"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MessageSquare size={16} color={activeTab === "messages" ? "var(--color-pink)" : "currentColor"} />
              문의 내역 관리
            </span>
            {totalCount > 0 && (
              <span 
                style={{ 
                  fontSize: "10px", 
                  backgroundColor: "var(--color-pink)", 
                  color: "var(--color-white)", 
                  padding: "2px 6px", 
                  borderRadius: "10px",
                  fontWeight: "bold",
                  boxShadow: "0 0 10px rgba(255,45,120,0.4)"
                }}
              >
                {totalCount}
              </span>
            )}
          </button>
        </nav>

        {/* 하단 푸터 (로그아웃 및 사이트 이동) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px" }}>
          <button
            onClick={() => navigateTo("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "transparent",
              color: "var(--color-white)",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-pink)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <ArrowLeft size={14} /> 사이트 바로가기
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "rgba(255, 45, 120, 0.05)",
              color: "var(--color-pink)",
              fontSize: "13px",
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          >
            <LogOut size={14} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* ── 우측 메인 콘텐츠 영역 ── */}
      <main className="admin-main-content" style={{ flexGrow: 1, marginLeft: "280px", padding: "50px 60px", minHeight: "100vh" }}>
        
        {/* 상단 헤더 */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--color-white)" }}>
              {activeTab === "dashboard" ? "DASHBOARD SUMMARY" : "CONTACT MESSAGES"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
              {activeTab === "dashboard" 
                ? "고객 문의 내역 현황 및 통계입니다." 
                : "Supabase 실시간 데이터베이스 문의 테이블 관리 페이지입니다."}
            </p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", backgroundColor: "rgba(255,255,255,0.03)", padding: "8px 16px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
              계정: <strong style={{ color: "var(--color-pink)" }}>Administrator</strong>
            </span>
          </div>
        </header>

        {/* ── [탭 1] 대시보드 요약 화면 ── */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            
            {/* 요약 메트릭 카드 */}
            <div className="admin-metric-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {/* 카드 1 */}
              <div className="liquid-glass" style={{ padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  누적 문의 개수
                </div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--color-white)", marginTop: "12px", display: "flex", alignItems: "baseline", gap: "4px" }}>
                  {totalCount} <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-muted)" }}>건</span>
                </div>
              </div>

              {/* 카드 2 */}
              <div className="liquid-glass" style={{ padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 224, 0, 0.15)" }}>
                <div style={{ color: "var(--color-yellow)", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  오늘 들어온 문의
                </div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--color-white)", marginTop: "12px", display: "flex", alignItems: "baseline", gap: "4px" }}>
                  {todayCount} <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-muted)" }}>건</span>
                </div>
              </div>

              {/* 카드 3 */}
              <div className="liquid-glass" style={{ padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 45, 120, 0.15)" }}>
                <div style={{ color: "var(--color-pink)", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  시스템 연동 상태
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#27C93F", marginTop: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27C93F", display: "inline-block", boxShadow: "0 0 10px #27C93F" }} />
                  Supabase Live Online
                </div>
              </div>
            </div>

            {/* 통계 그래프 & 최신 요약 */}
            <div className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "24px" }}>
              
              {/* 분야별 비중 */}
              <div className="liquid-glass" style={{ padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "24px", letterSpacing: "0.5px" }}>프로젝트 카테고리별 비중</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {Object.entries(categoryStats).map(([catName, count]) => {
                    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                    return (
                      <div key={catName}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                          <span style={{ color: "var(--text-secondary)" }}>{catName}</span>
                          <span style={{ fontWeight: "bold" }}>{count}건 ({percentage}%)</span>
                        </div>
                        {/* 게이지 바 */}
                        <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                          <div 
                            style={{ 
                              width: `${percentage}%`, 
                              height: "100%", 
                              backgroundColor: catName.includes("제작") ? "var(--color-pink)" : "var(--color-yellow)",
                              borderRadius: "3px",
                              boxShadow: `0 0 8px ${catName.includes("제작") ? "rgba(255,45,120,0.5)" : "rgba(255,224,0,0.5)"}`
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 최근 문의 요약 리스트 */}
              <div className="liquid-glass" style={{ padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800 }}>최근 들어온 문의 (최대 3건)</h3>
                  <button 
                    onClick={() => setActiveTab("messages")}
                    style={{ fontSize: "12px", color: "var(--color-pink)", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
                  >
                    전체 보기
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1 }}>
                  {contacts.length === 0 ? (
                    <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "14px", minHeight: "150px" }}>
                      데이터가 존재하지 않습니다.
                    </div>
                  ) : (
                    contacts.slice(0, 3).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedContact(item)}
                        style={{
                          padding: "16px",
                          backgroundColor: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255, 45, 120, 0.3)";
                          e.currentTarget.style.backgroundColor = "rgba(255, 45, 120, 0.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--color-white)" }}>{item.name}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatDate(item.created_at)}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--color-pink)", fontWeight: 600, marginBottom: "4px" }}>
                          {item.category}
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                          {item.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── [탭 2] 문의 내역 목록 조회 화면 ── */}
        {activeTab === "messages" && (
          <div className="liquid-glass" style={{ padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
            
            {/* 검색 및 필터 컨트롤바 */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "24px" }}>
              
              {/* 검색 인풋 */}
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input 
                  type="text"
                  placeholder="이름, 연락처, 내용으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(16, 17, 22, 0.5)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    padding: "12px 16px 12px 42px",
                    color: "var(--color-white)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-pink)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              {/* 카테고리 필터 드롭다운 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    backgroundColor: "rgba(16, 17, 22, 0.5)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "var(--color-white)",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="All">카테고리 전체</option>
                  <option value="디자인">디자인 (Design)</option>
                  <option value="홈페이지 제작">홈페이지 제작 (Publishing)</option>
                  <option value="홈페이지 제작 및 개발">홈페이지 제작 및 개발 (Design & Build)</option>
                  <option value="개발 및 유지보수">개발 및 유지보수 (Maintenance)</option>
                </select>
              </div>

            </div>

            {/* 테이블 뷰포트 */}
            <div style={{ overflowX: "auto" }}>
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
                  데이터 로딩 중...
                </div>
              ) : filteredContacts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                  검색 결과 조건에 맞는 문의 내역이 없습니다.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}>
                      <th style={{ padding: "16px 20px" }}>접수 날짜</th>
                      <th style={{ padding: "16px 20px" }}>이름</th>
                      <th style={{ padding: "16px 20px" }}>연락처</th>
                      <th style={{ padding: "16px 20px" }}>카테고리</th>
                      <th style={{ padding: "16px 20px" }}>메시지 내용</th>
                      <th style={{ padding: "16px 20px", textAlign: "center" }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((item) => (
                      <tr 
                        key={item.id}
                        onClick={() => setSelectedContact(item)}
                        style={{ 
                          borderBottom: "1px solid rgba(255,255,255,0.04)", 
                          transition: "background-color 0.2s",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 45, 120, 0.03)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <td style={{ padding: "18px 20px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                          {formatDate(item.created_at)}
                        </td>
                        <td style={{ padding: "18px 20px", fontWeight: "bold", whiteSpace: "nowrap" }}>
                          {item.name}
                        </td>
                        <td style={{ padding: "18px 20px" }}>
                          {item.phone || item.email || "-"}
                        </td>
                        <td style={{ padding: "18px 20px", color: "var(--color-pink)", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {item.category}
                        </td>
                        <td style={{ padding: "18px 20px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                          {item.message}
                        </td>
                        <td style={{ padding: "18px 20px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", gap: "10px" }}>
                            {/* 상세조회 버튼 - row onClick과 동일하나 명시적 UX를 위해 유지 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContact(item);
                              }}
                              title="상세보기"
                              style={{
                                border: "none",
                                background: "rgba(255,255,255,0.05)",
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "var(--color-white)",
                                transition: "background-color 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                            >
                              <Eye size={14} />
                            </button>
                            
                            {/* 삭제 버튼 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteContact(item.id);
                              }}
                              disabled={isDeletingId === item.id}
                              title="내역 삭제"
                              style={{
                                border: "none",
                                background: "rgba(255, 45, 120, 0.1)",
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "var(--color-pink)",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-pink)"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 45, 120, 0.1)"}
                            >
                              <Trash2 size={14} color={isDeletingId === item.id ? "#888" : "currentColor"} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ── 3. 문의 내용 상세보기 모달 (Detail Modal) ── */}
      {selectedContact && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100
          }}
          onClick={() => setSelectedContact(null)} // 여백 클릭 시 모달 닫기
        >
          <div 
            className="liquid-glass glow-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "40px",
              position: "relative",
              borderColor: "rgba(255, 45, 120, 0.2)",
              animation: "fadeIn 0.25s ease-out"
            }}
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
          >
            {/* 상단 메타 정보 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "12px", fontFamily: "var(--font-sub)", color: "var(--color-pink)", letterSpacing: "1.5px", fontWeight: 700 }}>
                INQUIRY DETAIL
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {formatDate(selectedContact.created_at)}
              </span>
            </div>

            {/* 필드 정보 나열 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* 이름 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <User size={16} color="var(--text-muted)" />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", width: "80px" }}>성함</span>
                <span style={{ fontSize: "15px", fontWeight: "bold" }}>{selectedContact.name}</span>
              </div>

              {/* 연락처 / 이메일 (하이브리드 대응) */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {selectedContact.phone ? (
                  <Phone size={16} color="var(--text-muted)" />
                ) : (
                  <Mail size={16} color="var(--text-muted)" />
                )}
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", width: "80px" }}>
                  {selectedContact.phone ? "연락처" : "이메일"}
                </span>
                {selectedContact.phone ? (
                  <a href={`tel:${selectedContact.phone}`} style={{ fontSize: "15px", color: "var(--color-yellow)", textDecoration: "underline" }}>
                    {selectedContact.phone}
                  </a>
                ) : (
                  <a href={`mailto:${selectedContact.email}`} style={{ fontSize: "15px", color: "var(--color-yellow)", textDecoration: "underline" }}>
                    {selectedContact.email}
                  </a>
                )}
              </div>

              {/* 카테고리 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Tag size={16} color="var(--text-muted)" />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", width: "80px" }}>프로젝트 분야</span>
                <span style={{ fontSize: "15px", color: "var(--color-pink)", fontWeight: 700 }}>{selectedContact.category}</span>
              </div>

              {/* 내용 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <MessageSquare size={16} color="var(--text-muted)" />
                  <span>의뢰 설명 내용</span>
                </div>
                <div 
                  style={{ 
                    fontSize: "14px", 
                    color: "var(--text-secondary)", 
                    backgroundColor: "rgba(255,255,255,0.02)", 
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "20px",
                    lineHeight: "1.7",
                    maxHeight: "300px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all"
                  }}
                >
                  {selectedContact.message}
                </div>
              </div>

            </div>

            {/* 하단 제어 버튼 */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", gap: "16px" }}>
              <button
                onClick={() => handleDeleteContact(selectedContact.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "rgba(255, 45, 120, 0.1)",
                  color: "var(--color-pink)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 45, 120, 0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 45, 120, 0.1)"}
              >
                <Trash2 size={14} /> 문의 삭제
              </button>

              <button
                onClick={() => setSelectedContact(null)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--color-white)",
                  color: "#050508",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 모달 페이드인 애니메이션 스타일 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </div>
  );
};

export default Admin;
