import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const services = [
    {
      id: "01",
      title: "DESIGN — UX/UI & BRAND IDENTITY",
      category: "디자인",
      desc: "감각적인 브랜드 시각 언어(Identity) 수립 및 웹의 물리적 깊이를 표현하는 마이크로 인터랙션 기획. 사용자의 시선을 단숨에 사로잡는 차별화된 비주얼과 모던한 타이포그래피 그리드를 설계합니다.",
      details: ["UX/UI Strategy", "Micro Interaction", "Brand Identity Design", "Typography Grid Layout"]
    },
    {
      id: "02",
      title: "WEB PUBLISHING — HIGH-END FRONT-END",
      category: "홈페이지 제작",
      desc: "비주얼 설계를 기반으로 오차 없는 정교한 웹 크리에이션. 마우스 스크롤의 관성 전환과 유체 역학 모션 배경을 적용한 최상위 퍼포먼스 퍼블리싱을 완수합니다.",
      details: ["Interactive Motion Design", "3D Web Graphics", "Custom Animation", "Responsive Fluid Layout"]
    },
    {
      id: "03",
      title: "WEB PUBLISHING & DEVELOPMENT — FULL-STACK",
      category: "홈페이지 제작 및 개발",
      desc: "디자인과 개발을 아우르는 풀스택 웹 크리에이션. 화려한 UI와 견고한 백엔드 시스템, 데이터베이스 연동 및 관리자 시스템을 통합 구축합니다.",
      details: ["Full-Stack Build", "Backend API System", "CMS & Admin Console", "Database Integration"]
    },
    {
      id: "04",
      title: "DEVELOPMENT & MAINTENANCE — SYSTEMS",
      category: "개발 및 유지보수",
      desc: "최신 AI 기술 연동 및 클라우드 서버 아키텍처 설계. 기존 서비스의 성능 최적화, 보안 강화 및 지속적인 운영 관리를 지원합니다.",
      details: ["AI Technology Integration", "Cloud Server Deployment", "Performance Optimization", "Ongoing Maintenance"]
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="services"
      className="services-section"
      style={{
        minHeight: "100vh",
        padding: "160px 100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "var(--bg-base)",
        position: "relative",
        zIndex: 10
      }}
    >
      {/* GNB/히어로 100px 그리드 가이드라인을 유지하는 가로 폭 제한 컨테이너 */}
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        
        {/* 상단 타이틀 */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <span style={{
            fontFamily: "var(--font-sub)",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--color-pink)",
            letterSpacing: "3px"
          }}>
            PHASE 04
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
            SERVICES
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
            High-end creative solutions spanning design systems, frontend publishing, and full-stack logic.
          </p>
        </div>

        {/* 아코디언 리스트 컨테이너 */}
        <div 
          style={{ 
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            width: "100%"
          }}
        >
          {services.map((service, index) => {
            const isOpen = activeIndex === index;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  borderBottom: isHovered || isOpen 
                    ? "1px solid var(--color-pink)" 
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "border-color 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  cursor: "none" // 마그네틱 커서 활용
                }}
                className="hover-target" // 커서 반응 대상 추가
              >
                {/* 헤더 버튼 영역 */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="service-header-btn"
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "36px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    color: "var(--color-white)",
                    cursor: "none"
                  }}
                >
                  <div className="service-header-left" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                    {/* 서비스 넘버 */}
                    <span 
                      style={{
                        fontFamily: "var(--font-sub)",
                        fontSize: "14px",
                        color: isHovered || isOpen ? "var(--color-pink)" : "var(--text-muted)",
                        transition: "color 0.3s ease"
                      }}
                    >
                      {service.id}
                    </span>
                    {/* 서비스 타이틀 */}
                    <h3 
                      style={{
                        fontSize: "clamp(18px, 2.5vw, 24px)",
                        fontWeight: 800,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                        color: isHovered || isOpen ? "var(--color-pink)" : "var(--color-white)",
                        transition: "color 0.3s ease"
                      }}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* 플러스/마이너스 네온 아이콘 회전 모션 */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isOpen ? "var(--color-yellow)" : "var(--color-pink)"
                    }}
                  >
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </motion.div>
                </button>

                {/* 슬라이드 웅크림 아코디언 패널 (Framer Motion) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div 
                        className="service-content-inner"
                        style={{ 
                          paddingBottom: "36px", 
                          paddingLeft: "60px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px"
                        }}
                      >
                        {/* 설명 본문 */}
                        <p 
                          style={{ 
                            fontSize: "16px", 
                            color: "var(--text-secondary)", 
                            lineHeight: "1.8", 
                            maxWidth: "760px",
                            wordBreak: "keep-all"
                          }}
                        >
                          {service.desc}
                        </p>

                        {/* 상세 기술 뱃지 피드 */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {service.details.map((detail, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: "11px",
                                fontFamily: "var(--font-sub)",
                                color: "var(--color-yellow)",
                                border: "1px solid rgba(255, 224, 0, 0.2)",
                                background: "rgba(255, 224, 0, 0.03)",
                                borderRadius: "4px",
                                padding: "4px 10px",
                                letterSpacing: "1px"
                              }}
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
