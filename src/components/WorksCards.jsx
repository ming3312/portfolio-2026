import React, { useState } from "react";
import { TiltCard } from "./AboutCards";
import { projects } from "../data/projectsData";

// --- 브라우저 자동 스크롤 목업 컴포넌트 ---
const BrowserMockup = ({ projectColor, projectTitle, techStack, projectImage }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="browser-mockup"
      style={{
        width: "100%",
        height: "220px",
        borderRadius: "12px",
        backgroundColor: "#0B0C10",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* 1. 브라우저 헤더 바 */}
      <div 
        style={{
          height: "24px",
          backgroundColor: "#101116",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          zIndex: 3
        }}
      >
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sub)", letterSpacing: "1px", textTransform: "uppercase" }}>
          {projectTitle} // PREVIEW
        </span>
      </div>

      {/* 2. 자동 스크롤 목업 이미지/콘텐츠 홀더 */}
      <div 
        className="mockup-content-viewport"
        style={{
          width: "100%",
          flexGrow: 1,
          overflow: "hidden",
          position: "relative"
        }}
      >
        {projectImage && !imageError ? (
          /* 실제 업로드된 이미지가 제공되고 로드 오류가 없을 경우 */
          <img 
            className="mockup-scroll-image"
            src={projectImage}
            alt={projectTitle}
            onError={() => setImageError(true)} // 이미지 로드 실패 시 가상 뼈대로 자동 스왑
            style={{
              width: "100%",
              height: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              transition: "transform 4s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          />
        ) : (
          /* 이미지가 없거나 로드에 실패했을 때의 가상 웹 레이아웃 (Fallback) */
          <div 
            className="mockup-scroll-page"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "500px", // 뷰포트보다 긴 높이로 페이지 연출
              background: `linear-gradient(to bottom, #101116 0%, ${projectColor} 30%, #050508 70%, #101116 100%)`,
              transition: "transform 4s cubic-bezier(0.25, 1, 0.5, 1)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            <div style={{ height: "40px", width: "80%", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.08)", padding: "10px" }}>
              <div style={{ width: "30%", height: "8px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.2)" }} />
            </div>
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              <div style={{ height: "80px", flex: 1, borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }} />
              <div style={{ height: "80px", flex: 1, borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }} />
            </div>
            <div style={{ height: "120px", width: "100%", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "16px", color: "var(--color-white)", fontWeight: 900, fontFamily: "var(--font-headline)", letterSpacing: "1px", opacity: 0.7 }}>
                {projectTitle}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* 호버 시 자동 아래로 스크롤하는 연출 클래스 */
        .works-card-hover:hover .mockup-scroll-page {
          transform: translateY(-240px); 
        }
        .works-card-hover:hover .mockup-scroll-image {
          transform: translateY(calc(-100% + 196px)); /* 뷰포트 높이 196px 보정 끝 정렬 */
        }
        /* 전체보기 카드 호버 모션 */
        .works-viewall-hover:hover .view-all-inner-card {
          border-color: var(--color-pink) !important;
          background: rgba(255, 45, 120, 0.05) !important;
          box-shadow: 0 0 20px rgba(255, 45, 120, 0.1) !important;
        }
        .works-viewall-hover:hover .arrow-circle {
          transform: translateX(6px) scale(1.05);
          box-shadow: 0 0 25px rgba(255, 45, 120, 0.6) !important;
          background: var(--color-pink) !important;
        }
        .works-viewall-hover:hover .arrow-circle svg path {
          stroke: var(--color-white) !important;
        }
      `}</style>
    </div>
  );
};

// --- Works 리스트 카드 컴포넌트 ---
const WorksCards = ({ navigateTo }) => {
  // textOnly가 아닌 주요 프로젝트들 중 처음 3개 표시
  const displayProjects = projects.filter((proj) => !proj.textOnly).slice(0, 3);

  const getOffsetY = (idx) => {
    if (idx % 3 === 0) return "0px";
    if (idx % 3 === 1) return "140px";
    return "70px";
  };

  return (
    <div 
      className="works-cards-inner"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "100px", // 카드 간 넓은 가로 여백
        paddingRight: "200px", // 끝 도달 시 여유 폭
        position: "relative"
      }}
    >
      {displayProjects.map((proj, idx) => {
        const offsetY = getOffsetY(idx);
        return (
          <div
            key={proj.id}
            className="works-card-hover"
            onClick={() => navigateTo(`/works?id=${proj.id}`)}
            style={{
              flex: "0 0 520px", // 가로 슬라이더 내 카드 크기 고정
              marginTop: offsetY, // 비대칭 엇갈림 마진 부여
              transformStyle: "preserve-3d",
              position: "relative",
              cursor: "none"
            }}
          >
            {/* 카드 뒷편 Chipsa 스타일의 정교한 1px 수직/수평 데코 레이어선 */}
            <div 
              style={{
                position: "absolute",
                top: "-40px",
                left: "-40px",
                right: "-40px",
                bottom: "-40px",
                pointerEvents: "none",
                zIndex: 0
              }}
            >
              {/* 십자 데코 라인 */}
              <div style={{ position: "absolute", top: "40px", left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />
              <div style={{ position: "absolute", left: "40px", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent)" }} />
            </div>

            <TiltCard style={{ padding: "40px", borderColor: proj.borderColor, position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
              {/* 상단 메타 영역 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", fontFamily: "var(--font-sub)", color: proj.badgeColor, letterSpacing: "2px", fontWeight: 700 }}>
                  {proj.id} // WORK
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-sub)" }}>
                  {proj.role}
                </span>
              </div>

              {/* 브라우저 자동 스크롤 목업 탑재 */}
              <BrowserMockup projectColor={proj.color} projectTitle={proj.projectName || proj.title} techStack={proj.techStack} projectImage={proj.projectThumb || proj.projectImage} />

              {/* 타이틀 및 설명 */}
              <h3 style={{ fontSize: "22px", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-white)", letterSpacing: "-0.01em" }}>
                {proj.title}
              </h3>

              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: "1.7",
                wordBreak: "keep-all",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {proj.desc}
              </p>
            </TiltCard>
          </div>
        );
      })}

      {/* 4번째 전체보기 액션 카드 */}
      <div
        className="works-viewall-hover"
        onClick={() => navigateTo("/works")}
        style={{
          flex: "0 0 520px", // 일반 프로젝트 카드와 크기 일체화로 그리드 통일성 유지
          marginTop: "50px", // 비대칭 마진 부여
          transformStyle: "preserve-3d",
          position: "relative",
          cursor: "none"
        }}
      >
        <div 
          style={{
            position: "absolute",
            top: "-40px",
            left: "-40px",
            right: "-40px",
            bottom: "-40px",
            pointerEvents: "none",
            zIndex: 0
          }}
        >
          {/* 십자 데코 라인 */}
          <div style={{ position: "absolute", top: "40px", left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />
          <div style={{ position: "absolute", left: "40px", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent)" }} />
        </div>

        <TiltCard style={{ padding: "40px", borderColor: "rgba(255, 45, 120, 0.15)", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          <div 
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed rgba(255, 45, 120, 0.3)",
              borderRadius: "12px",
              background: "rgba(255, 45, 120, 0.02)",
              textAlign: "center",
              padding: "20px",
              cursor: "none",
              transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
            className="view-all-inner-card"
          >
            {/* 핫핑크 네온 원형 아이콘 */}
            <div 
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: "1.5px solid var(--color-pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                boxShadow: "0 0 15px rgba(255, 45, 120, 0.2)",
                background: "rgba(5, 5, 8, 0.6)",
                transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
              }}
              className="arrow-circle"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="var(--color-pink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="var(--color-pink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-white)", letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>
              VIEW ALL WORKS
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-sub)", letterSpacing: "1.5px" }}>
              EXPLORE THE COMPLETE ARCHIVE
            </p>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};

export default WorksCards;
