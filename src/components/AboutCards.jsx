import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- Framer Motion 기반 3D 탄성 틸트 카드 컴포넌트 ---
export function TiltCard({ children, style, className }) {
  const cardRef = useRef(null);

  // 마우스 좌표를 모션 값으로 관리 (-0.5 ~ 0.5 범위)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 디자인 가이드 V3.1 사양: stiffness: 280, damping: 18, mass: 0.8
  const springConfig = { stiffness: 280, damping: 18, mass: 0.8 };
  
  // X축, Y축 3D 회전각 스프링 처리
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  // 마우스 궤적에 반응하여 반짝이는 네온 라이트 그라데이션 위치 제어
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), springConfig);
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // 카드의 중심 기준 상대 마우스 위치
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        ...style
      }}
      className={`liquid-glass glow-card ${className || ""}`}
    >
      {/* translateZ를 주어 3D 깊이감을 입체적으로 확보 */}
      <div 
        style={{ 
          transform: "translateZ(35px)", 
          transformStyle: "preserve-3d", 
          height: "100%", 
          width: "100%",
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1
        }}
      >
        {children}
      </div>

      {/* 마우스 따라 움직이는 은은한 Radial Neon Glow */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle 240px at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255, 45, 120, 0.12) 0%, rgba(255, 224, 0, 0.04) 60%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: "24px",
          // Framer Motion을 통해 CSS 변수를 실시간 바인딩
          "--glow-x": glowX,
          "--glow-y": glowY
        }}
      />
    </motion.div>
  );
}

// --- About Us 카드 모음 컴포넌트 ---
export default function AboutCards({ card1Ref, card2Ref, card3Ref }) {
  // 스택 배지용 스타일 (시원한 크기로 고도화)
  const tagPinkStyle = {
    background: "rgba(255, 45, 120, 0.06)",
    border: "1px solid rgba(255, 45, 120, 0.25)",
    color: "#FF2D78",
    textShadow: "0 0 5px rgba(255, 45, 120, 0.3)",
    borderRadius: "99px",
    padding: "8px 16px",
    fontSize: "13px",
    fontFamily: "var(--font-sub)",
    letterSpacing: "1px",
    display: "inline-block",
    whiteSpace: "nowrap"
  };

  const tagYellowStyle = {
    background: "rgba(255, 224, 0, 0.06)",
    border: "1px solid rgba(255, 224, 0, 0.25)",
    color: "#FFE000",
    textShadow: "0 0 5px rgba(255, 224, 0, 0.3)",
    borderRadius: "99px",
    padding: "8px 16px",
    fontSize: "13px",
    fontFamily: "var(--font-sub)",
    letterSpacing: "1px",
    display: "inline-block",
    whiteSpace: "nowrap"
  };

  return (
    <div className="about-cards-container">
      {/* Card 1: Intro Card (z-index: 20) */}
      <div 
        ref={card1Ref}
        className="about-card-wrapper card-1"
        style={{ zIndex: 20 }}
      >
        <TiltCard style={{ padding: "48px", borderColor: "rgba(255, 45, 120, 0.2)", minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "28px" }}>
            <span style={{ fontSize: "13px", fontFamily: "var(--font-sub)", letterSpacing: "2px", color: "var(--color-pink)" }}>
              CORE PROFILE
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-sub)" }}>
              YEAR 2026
            </span>
          </div>

          <h3 style={{ fontSize: "clamp(26px, 3.5vw, 32px)", fontWeight: 800, marginBottom: "20px", color: "var(--color-white)", letterSpacing: "-0.02em" }}>
            HYBRID WEB ARCHITECT
          </h3>

          <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "var(--text-secondary)", lineHeight: "1.8", wordBreak: "keep-all" }}>
            디자이너의 감각적인 눈과 개발자의 논리적인 설계를 모두 갖추고 있습니다. 브랜드 아이덴티티 수립과 그리드 레이아웃 디자인부터 고난도 모션 퍼블리싱, 그리고 생성형 AI API를 결합한 풀스택 시스템 아키텍처 구축까지 전체 웹 제품 빌딩 프로세스를 단절 없이 유연하게 완수합니다. 사용자가 마주하는 첫 순간의 시각적 경이로움과 보이지 않는 백엔드 서버의 안정성을 하나로 결합한 최상의 디지털 경험을 신속하게 구현합니다.
          </p>
        </TiltCard>
      </div>

      {/* Card 2: Adaptable Role Spectrum Card (z-index: 15) */}
      <div 
        ref={card2Ref}
        className="about-card-wrapper card-2"
        style={{ zIndex: 15 }}
      >
        <TiltCard style={{ padding: "48px", borderColor: "rgba(255, 255, 255, 0.08)", minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "28px" }}>
            <span style={{ fontSize: "13px", fontFamily: "var(--font-sub)", letterSpacing: "2px", color: "var(--text-secondary)" }}>
              THE CO-CREATORS WITHIN
            </span>
          </div>

          <h3 style={{ fontSize: "clamp(26px, 3.5vw, 32px)", fontWeight: 800, marginBottom: "24px", color: "var(--color-white)", letterSpacing: "-0.02em" }}>
            THE EXPERTS
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <span style={tagPinkStyle}>UI/UX Designer</span>
            <span style={tagPinkStyle}>Interaction Designer</span>
            <span style={tagPinkStyle}>High-End Web Publisher</span>
            <span style={tagPinkStyle}>Frontend Developer</span>
            <span style={tagYellowStyle}>Backend Developer</span>
            <span style={tagYellowStyle}>AI Integration Engineer</span>
            <span style={tagYellowStyle}>DevOps & Systems Specialist</span>
          </div>
        </TiltCard>
      </div>

      {/* Card 3: Client-Centric Execution Card (z-index: 10) */}
      <div 
        ref={card3Ref}
        className="about-card-wrapper card-3"
        style={{ zIndex: 10 }}
      >
        <TiltCard style={{ padding: "48px", borderColor: "rgba(255, 224, 0, 0.15)", minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
            <span style={{ fontSize: "13px", fontFamily: "var(--font-sub)", letterSpacing: "2px", color: "var(--color-yellow)" }}>
              CLIENT-CENTRIC VISION
            </span>
            {/* Neon Yellow 1% 포인트 배지 */}
            <span 
              style={{ 
                fontSize: "11px", 
                color: "var(--color-yellow)", 
                fontFamily: "var(--font-sub)", 
                fontWeight: 700,
                border: "1px solid var(--color-yellow)",
                padding: "3px 10px",
                borderRadius: "4px",
                textShadow: "0 0 5px rgba(255, 224, 0, 0.4)",
                background: "rgba(255, 224, 0, 0.1)"
              }}
            >
              CLIENT FIRST
            </span>
          </div>

          <h3 style={{ fontSize: "clamp(24px, 3.2vw, 28px)", fontWeight: 800, marginBottom: "18px", color: "var(--color-white)", letterSpacing: "-0.01em" }}>
            RAPID & PERFECT BUILD
          </h3>

          <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "var(--text-secondary)", lineHeight: "1.8", wordBreak: "keep-all" }}>
            날카롭고 빠른 기획력과 결단력 있는 추진력을 바탕으로 프로젝트를 흔들림 없이 정확한 목적지까지 리드합니다. 비주얼 디자인부터 웹 퍼블리싱 빌드까지 모든 단계에서 고객의 니즈를 최우선 가치로 삼아 퍼펙트하게 실현합니다. 마지막 한 끗의 디테일까지 정성껏 다듬어, 비즈니스가 도달하고자 하는 최상의 퀄리티로 프로젝트를 완벽하게 완수합니다.
          </p>
        </TiltCard>
      </div>
    </div>
  );
}
