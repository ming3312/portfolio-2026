/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { projects } from "../data/projectsData";

const WorksArchive = ({ navigateTo }) => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activePopupProj, setActivePopupProj] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeViewMode, setActiveViewMode] = useState("PC");

  // 1. 카테고리 종류 정의 (등록된 프로젝트가 존재하는 카테고리만 노출)
  const categories = ["ALL", "BRAND", "E COMMERCE", "CAMPAGIN", "OTHER"].filter(
    (cat) => cat === "ALL" || projects.some((p) => p.category === cat)
  );

  // 3. 현재 카테고리에 해당하는 프로젝트 필터링
  const filteredProjects = activeCategory === "ALL"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  // 4. 이미지+텍스트 카드형 프로젝트 (textOnly: false)
  const gridProjects = filteredProjects.filter((p) => !p.textOnly);

  // 5. 텍스트 전용 프로젝트 (textOnly: true)
  const listProjects = filteredProjects.filter((p) => p.textOnly);

  // 6. URL 쿼리 파라미터(?id=01) 파싱 및 감지
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const proj = projects.find((p) => p.id === id);
      if (proj) {
        setActivePopupProj(proj);
        setActiveViewMode("PC");
      }
    } else {
      setActivePopupProj(null);
    }
  }, [window.location.search]);

  // 창 크기 조절 감지
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 팝업 열기/닫기 제어
  const openPopup = (proj) => {
    navigateTo(`/works?id=${proj.id}`);
  };

  const closePopup = () => {
    navigateTo("/works");
  };

  // 팝업 내 이전/다음 슬라이드 제어
  const handlePrev = (e) => {
    e.stopPropagation();
    if (!activePopupProj) return;
    
    // 전체 리스트 기준 순환
    const currentIndex = projects.findIndex((p) => p.id === activePopupProj.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    navigateTo(`/works?id=${projects[prevIndex].id}`);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!activePopupProj) return;

    const currentIndex = projects.findIndex((p) => p.id === activePopupProj.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    navigateTo(`/works?id=${projects[nextIndex].id}`);
  };

  // 키보드 Esc 및 방향키 지원
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activePopupProj) return;
      if (e.key === "Escape") closePopup();
      if (e.key === "ArrowLeft") handlePrev(e);
      if (e.key === "ArrowRight") handleNext(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePopupProj]);

  // 팝업 활성화 시 배경 스크롤 방지
  useEffect(() => {
    if (activePopupProj) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePopupProj]);

  const isMobileView = activeViewMode === "Mobile" || (activePopupProj && activePopupProj.mobileOnly);
  const imgMaxWidth = isMobileView ? "420px" : "1600px";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050508",
        color: "var(--color-white)",
        paddingTop: "140px",
        paddingBottom: "160px",
        position: "relative",
        zIndex: 10,
        fontFamily: "var(--font-sub)"
      }}
    >
      {/* 뒤로가기 헤더 바 */}
      <div
        style={{
          position: "fixed",
          top: "40px",
          left: "5%",
          right: "5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100
        }}
      >
        <button
          onClick={() => navigateTo("/")}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "12px 24px",
            borderRadius: "30px",
            color: "var(--color-white)",
            fontFamily: "var(--font-sub)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
          className="back-btn-hover"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          BACK TO HOME
        </button>
        
        <span 
          style={{
            fontFamily: "var(--font-sub)",
            fontSize: "12px",
            color: "var(--color-pink)",
            letterSpacing: "3px",
            fontWeight: 700
          }}
        >
          ARCHIVE / WORKS LIST
        </span>
      </div>

      {/* 메인 레이아웃 컨테이너 (좌우 분할) */}
      <div
        style={{
          width: "90%",
          maxWidth: "1300px",
          margin: "0 auto",
          display: "flex",
          flexDirection: windowWidth <= 768 ? "column" : "row",
          gap: "60px",
          marginTop: "40px"
        }}
      >
        {/* ==================================================== */}
        {/* 좌측 사이드바 영역 */}
        {/* ==================================================== */}
        <div
          style={{
            flex: windowWidth <= 768 ? "none" : "0 0 280px",
            borderRight: windowWidth <= 768 ? "none" : "1px solid rgba(255,255,255,0.06)",
            paddingRight: windowWidth <= 768 ? 0 : "40px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          {/* 타이틀 명시 */}
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "11px", color: "var(--color-pink)", fontWeight: 700, letterSpacing: "3px" }}>
              CATEGORIES
            </span>
          </div>

          {/* 카테고리 메뉴 목록 */}
          <div
            style={{
              display: "flex",
              flexDirection: windowWidth <= 768 ? "row" : "column",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "flex-start"
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    color: isActive ? "var(--color-white)" : "rgba(255, 255, 255, 0.4)",
                    fontFamily: "var(--font-headline)",
                    fontSize: "16px",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    position: "relative",
                    display: "flex",
                    alignItems: "center"
                  }}
                  className="sidebar-category-btn"
                >
                  <span
                    style={{
                      borderBottom: isActive ? "2px solid var(--color-pink)" : "none",
                      paddingBottom: "4px"
                    }}
                  >
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 우측 작품 리스트/그리드 영역 */}
        {/* ==================================================== */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "80px" }}>
          
          {/* 1) 카드 그리드형 리스트 (textOnly: false) */}
          {/* 1) 카드 그리드형 리스트 (textOnly: false) */}
          {gridProjects.length > 0 && (
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-headline)",
                  fontWeight: 800,
                  fontSize: "18px",
                  letterSpacing: "2px",
                  color: "var(--color-white)",
                  marginBottom: "32px",
                  textTransform: "uppercase"
                }}
              >
                Projects
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: windowWidth <= 1024 ? "1fr" : "1fr 1fr",
                  gap: "30px"
                }}
              >
                {gridProjects.map((proj) => {
                  const hoverColor = proj.badgeColor || "#FF2D78";
                  const hoverBg = hoverColor === "#FF2D78" ? "rgba(255, 45, 120, 0.03)" : "rgba(255, 224, 0, 0.02)";
                  const hoverShadow = hoverColor === "#FF2D78" ? "rgba(255, 45, 120, 0.15)" : "rgba(255, 224, 0, 0.15)";
                  return (
                    <div
                      key={proj.id}
                      onClick={() => openPopup(proj)}
                      style={{
                        display: "flex",
                        flexDirection: windowWidth <= 600 ? "column" : "row",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "12px",
                        padding: windowWidth <= 600 ? "16px" : "24px",
                        gap: "20px",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                        position: "relative",
                        overflow: "hidden",
                        "--card-hover-border": hoverColor,
                        "--card-hover-bg": hoverBg,
                        "--card-hover-shadow": hoverShadow
                      }}
                      className="archive-grid-card"
                    >
                      {/* 카드 좌측: 이미지 썸네일 */}
                      <div
                        style={{
                          flex: windowWidth <= 600 ? "none" : "0 0 150px",
                          width: windowWidth <= 600 ? "100%" : "150px",
                          height: windowWidth <= 600 ? "180px" : "100px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#000",
                          border: "1px solid rgba(255,255,255,0.05)",
                          position: "relative"
                        }}
                      >
                        <img
                          src={proj.projectThumb || proj.projectImage}
                          alt={proj.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease"
                          }}
                          className="card-thumb-image"
                        />
                      </div>
                      {/* 카드 우측: 제목 및 설명 */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
                        {/* 우측 상단 '+' 아이콘 */}
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "20px",
                            fontWeight: 300,
                            color: "rgba(255,255,255,0.3)",
                            lineHeight: 1,
                            transition: "color 0.3s ease"
                          }}
                          className="plus-icon"
                        >
                          +
                        </span>
                        
                        <div style={{ paddingRight: "20px" }}>
                          <h3
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              fontFamily: "var(--font-headline)",
                              color: "var(--color-white)",
                              letterSpacing: "-0.01em",
                              marginBottom: "8px",
                              textTransform: "uppercase"
                            }}
                          >
                            {proj.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                              lineHeight: "1.6",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordBreak: "keep-all"
                            }}
                          >
                            {proj.desc}
                          </p>
                        </div>

                        {/* 하단 카테고리 태그 */}
                        <div style={{ marginTop: "12px" }}>
                          <span
                            style={{
                              fontSize: "9.5px",
                              fontFamily: "var(--font-sub)",
                              color: proj.badgeColor,
                              border: `1px solid ${proj.borderColor}`,
                              backgroundColor: "rgba(255,255,255,0.02)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              letterSpacing: "0.5px"
                            }}
                          >
                            {proj.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2) 텍스트 전용 리스트형 (textOnly: true) */}
          {listProjects.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-headline)",
                  fontWeight: 800,
                  fontSize: "18px",
                  letterSpacing: "2px",
                  color: "var(--color-white)",
                  marginBottom: "24px",
                  textTransform: "uppercase"
                }}
              >
                Other Works
              </h2>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {listProjects.map((proj) => {
                  const hoverColor = proj.badgeColor || "#FFE000";
                  const hoverBg = hoverColor === "#FF2D78" ? "rgba(255, 45, 120, 0.02)" : "rgba(255, 224, 0, 0.02)";
                  return (
                    <div
                      key={proj.id}
                      onClick={() => openPopup(proj)}
                      style={{
                        display: "flex",
                        flexDirection: windowWidth <= 600 ? "column" : "row",
                        alignItems: windowWidth <= 600 ? "flex-start" : "center",
                        justifyContent: "flex-start",
                        padding: "24px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        gap: windowWidth <= 600 ? "8px" : "40px",
                        "--row-hover-color": hoverColor,
                        "--row-hover-bg": hoverBg
                      }}
                      className="archive-list-row"
                    >
                      {/* 리스트 좌측: 프로젝트명 */}
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "10px",
                          flex: windowWidth <= 600 ? "none" : "0 0 320px"
                        }}
                      >
                        <span style={{ color: hoverColor, fontSize: "14px" }}>•</span>
                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            fontFamily: "var(--font-headline)",
                            color: "var(--color-white)",
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase"
                          }}
                        >
                          {proj.title}
                        </h3>
                      </div>

                      {/* 리스트 우측: 프로젝트 설명 */}
                      <div style={{ flex: 1, maxWidth: "700px" }}>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            lineHeight: "1.5",
                            textAlign: "left",
                            wordBreak: "keep-all",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                          className="row-desc-text"
                        >
                          {proj.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 🔴 전면 라이트박스 팝업 모달 (흰색 배경, 100% 스크린) */}
      {/* ==================================================== */}
      {activePopupProj && (
        <div
          onClick={closePopup}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#FFFFFF",
            color: "#111116",
            zIndex: 1000,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "80px 24px 100px 24px"
          }}
          className="modal-backdrop-fade"
        >
          {/* 닫기 버튼 */}
          <button
            onClick={closePopup}
            style={{
              position: "fixed",
              top: "30px",
              right: "40px",
              background: "rgba(0, 0, 0, 0.03)",
              border: "none",
              color: "#111116",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 1010,
              transition: "all 0.3s ease"
            }}
            className="modal-close-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 이전 슬라이드 화살표 */}
          <button
            onClick={handlePrev}
            style={{
              position: "fixed",
              left: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 1010,
              transition: "all 0.3s ease",
              color: "#111116"
            }}
            className="modal-nav-btn-light"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 중앙 콘텐츠 영역 */}
          <div
            onClick={(e) => e.stopPropagation()} // 클릭 버블링 차단
            style={{
              width: "100%",
              maxWidth: imgMaxWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              animation: "zoomIn 0.35s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          >
            {/* 카테고리 및 역할 태그 */}
            <span
              style={{
                fontSize: "11px",
                color: "var(--color-pink)",
                fontFamily: "var(--font-sub)",
                letterSpacing: "2px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "12px",
                display: "inline-block"
              }}
            >
              {activePopupProj.category} / {activePopupProj.role}
            </span>

            {/* 프로젝트 제목 */}
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 800,
                fontFamily: "var(--font-headline)",
                color: "#111116",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                textTransform: "uppercase",
                margin: "0 0 16px 0",
                maxWidth: "800px"
              }}
            >
              {activePopupProj.title}
            </h2>

            {/* 프로젝트 설명 */}
            <p
              style={{
                fontSize: "15px",
                color: "#55555C",
                lineHeight: "1.6",
                margin: "0 0 24px 0",
                maxWidth: "700px",
                wordBreak: "keep-all"
              }}
            >
              {activePopupProj.desc}
            </p>

            {/* 라이브 링크 버튼 */}
            {activePopupProj.liveUrl && (
              <a
                href={activePopupProj.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "#FFFFFF",
                  backgroundColor: "#111116",
                  padding: "12px 28px",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  transition: "all 0.3s ease",
                  marginBottom: "32px",
                  cursor: "pointer"
                }}
                className="modal-header-live-link"
              >
                VIEW LIVE SITE ↗
              </a>
            )}

            {/* PC / MOBILE 보기 버튼 (서로 다를 경우에만 렌더링) */}
            {activePopupProj.projectImageMobile && (
              <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
                <button
                  onClick={() => setActiveViewMode("PC")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    border: "1.5px solid #111116",
                    backgroundColor: activeViewMode === "PC" ? "#111116" : "transparent",
                    color: activeViewMode === "PC" ? "#FFFFFF" : "#111116",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.5px"
                  }}
                >
                  PC VERSION
                </button>
                <button
                  onClick={() => setActiveViewMode("Mobile")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    border: "1.5px solid #111116",
                    backgroundColor: activeViewMode === "Mobile" ? "#111116" : "transparent",
                    color: activeViewMode === "Mobile" ? "#FFFFFF" : "#111116",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.5px"
                  }}
                >
                  MOBILE VERSION
                </button>
              </div>
            )}
            {/* 이미지 뷰포트 영역 */}
            {activePopupProj.projectImage && (
              <div
                style={{
                  width: "100%",
                  maxWidth: imgMaxWidth,
                  borderRadius: "16px",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  overflow: "hidden",
                  backgroundColor: "#F9F9FB",
                  transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
                }}
              >
                {activePopupProj.liveUrl ? (
                  <a
                    href={activePopupProj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", cursor: "pointer", width: "100%" }}
                  >
                    <img
                      src={activePopupProj.projectImageMobile && activeViewMode === "Mobile" ? activePopupProj.projectImageMobile : activePopupProj.projectImage}
                      alt={activePopupProj.title}
                      style={{
                        width: "100%",
                        maxWidth: imgMaxWidth,
                        height: "auto",
                        display: "block"
                      }}
                    />
                  </a>
                ) : (
                  <img
                    src={activePopupProj.projectImageMobile && activeViewMode === "Mobile" ? activePopupProj.projectImageMobile : activePopupProj.projectImage}
                    alt={activePopupProj.title}
                    style={{
                      width: "100%",
                      maxWidth: imgMaxWidth,
                      height: "auto",
                      display: "block"
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* 다음 슬라이드 화살표 */}
          <button
            onClick={handleNext}
            style={{
              position: "fixed",
              right: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 1010,
              transition: "all 0.3s ease",
              color: "#111116"
            }}
            className="modal-nav-btn-light"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* 커스텀 호버 이펙트 CSS */}
      <style>{`
        .back-btn-hover:hover {
          background: rgba(255, 45, 120, 0.1) !important;
          border-color: var(--color-pink) !important;
          color: var(--color-white) !important;
          box-shadow: 0 0 15px rgba(255, 45, 120, 0.2);
        }
        
        /* 카테고리 사이드바 호버 */
        .sidebar-category-btn:hover {
          color: var(--color-white) !important;
        }

        /* 아카이브 카드 호버 이펙트 */
        .archive-grid-card:hover {
          border-color: var(--card-hover-border) !important;
          background-color: var(--card-hover-bg) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 0 20px var(--card-hover-shadow) !important;
          transform: translateY(-4px);
        }
        .archive-grid-card:hover .card-thumb-image {
          transform: scale(1.05);
        }
        .archive-grid-card:hover .plus-icon {
          color: var(--card-hover-border) !important;
        }

        /* 아카이브 텍스트 행 호버 */
        .archive-list-row:hover {
          border-bottom-color: var(--row-hover-color) !important;
          background-color: var(--row-hover-bg) !important;
          padding-left: 10px !important;
        }
        .archive-list-row:hover h3 {
          color: var(--row-hover-color) !important;
        }
        .archive-list-row:hover .row-desc-text {
          color: var(--color-white) !important;
        }

        /* 팝업 내비 버튼 호버 (라이트 테마) */
        .modal-nav-btn-light:hover {
          background-color: #111116 !important;
          border-color: #111116 !important;
          color: #FFFFFF !important;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .modal-close-btn:hover {
          background-color: #111116 !important;
          color: #FFFFFF !important;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .modal-header-live-link:hover {
          background-color: var(--color-pink) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 45, 120, 0.25);
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 768px) {
          .modal-nav-btn-light {
            display: none !important; /* 모바일 화면에서는 화살표 생략 */
          }
        }
      `}</style>
    </div>
  );
};

export default WorksArchive;
