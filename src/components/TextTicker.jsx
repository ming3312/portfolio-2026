import React, { useEffect, useRef } from "react";

const TextTicker = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  // 티커 내용 정의
  const tickerItems = [
    "CREATIVE WEB DEVELOPER",
    "UI/UX DESIGNER",
    "AI FULLSTACK BUILDER",
    "AUTOMATION ARCHITECT",
    "KZOOCOMPANY / WEB"
  ];

  // 무한 롤링 시 끊김 없게 하기 위해 원본의 4배로 늘려 트랙을 채움
  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  useEffect(() => {
    let currentX = 0;
    let speed = 0.8; // 기본 흐름 속도 (픽셀/프레임)
    let targetSpeed = 0.8;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let animationFrameId;

    const track = trackRef.current;
    if (!track) return;

    // 스크롤 델타 감지 가속 연동
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      
      // 스크롤 변화량 비례 가속도 획득
      scrollVelocity += diff * 0.12; 
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const animate = () => {
      // 부드러운 감속 댐핑 처리
      scrollVelocity *= 0.94;
      targetSpeed = 0.8 + Math.min(scrollVelocity, 12); // 최대 가속 제한 (너무 안 튀게 12로 캡)

      // 부드럽게 속도 추종
      speed += (targetSpeed - speed) * 0.1;

      // 텍스트 이동
      currentX -= speed;

      // 화면에서 트랙 너비의 절반(즉 복제 전 원본 루프의 크기)을 넘어가는 시점에 원점 리셋해 무한 루프 형성
      const trackWidth = track.scrollWidth;
      const halfWidth = trackWidth / 2;

      if (Math.abs(currentX) >= halfWidth) {
        currentX = 0;
      }

      track.style.transform = `translateX(${currentX}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "18px 0",
        margin: "30px 0",
        position: "relative",
        userSelect: "none",
        pointerEvents: "none"
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          willChange: "transform",
          gap: "40px",
          alignItems: "center"
        }}
      >
        {repeatedItems.map((item, idx) => {
          // 아웃라인 서체와 채워진 서체를 번갈아 배치하여 리드미컬함 조성
          const isOutline = idx % 2 === 1;

          return (
            <div
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "40px",
                fontFamily: "var(--font-sub)",
                fontSize: "clamp(14px, 2vw, 18px)", // 너무 크지 않게 세련되게 축소
                fontWeight: isOutline ? 300 : 700,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: isOutline ? "transparent" : "var(--color-white)",
                WebkitTextStroke: isOutline ? "1px rgba(255, 255, 255, 0.35)" : "none",
              }}
            >
              <span>{item}</span>
              <span
                style={{
                  color: "var(--color-pink)",
                  fontSize: "12px",
                  display: "inline-block",
                  transform: "translateY(-1px)",
                  opacity: 0.9
                }}
              >
                ✦
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TextTicker;
