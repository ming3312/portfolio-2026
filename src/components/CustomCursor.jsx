import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isWorksHovered, setIsWorksHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 터치 지원 및 마우스 포인터가 coarse(터치)인지 체크하여 터치 디바이스 판정
    const checkTouchDevice = () => {
      const hasTouch = window.matchMedia("(pointer: coarse)").matches || 
                       ("ontouchstart" in window) || 
                       (navigator.maxTouchPoints > 0);
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);
    return () => window.removeEventListener("resize", checkTouchDevice);
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // 초기 상태 숨김 처리
    gsap.set([dot, ring], { opacity: 0 });

    const moveCursor = (e) => {
      setIsHidden(false);
      
      // GSAP을 이용한 실시간 마우스 좌표 매핑
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        opacity: 1,
        ease: "power2.out"
      });

      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        opacity: 1,
        ease: "power3.out"
      });
    };

    // 모바일 터치 트래킹 지원
    const moveTouch = (e) => {
      if (e.touches.length === 0) return;
      setIsHidden(false);
      const touch = e.touches[0];
      
      gsap.to(dot, {
        x: touch.clientX,
        y: touch.clientY,
        duration: 0.05,
        opacity: 1,
        ease: "power2.out"
      });

      gsap.to(ring, {
        x: touch.clientX,
        y: touch.clientY,
        duration: 0.3,
        opacity: 1,
        ease: "power3.out"
      });
    };

    const handleTouchStart = (e) => {
      setIsHidden(false);
      moveTouch(e);
    };

    const handleTouchEnd = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.4 });
    };

    // 화면 밖으로 나갔을 때 커서 숨김
    const handleMouseLeave = () => {
      setIsHidden(true);
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("touchmove", moveTouch);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    // --- 호버 대상 요소 트래킹 및 이벤트 설정 ---
    const updateHoverEvents = () => {
      const hoverables = document.querySelectorAll(
        "a, button, input, select, textarea, .hover-target, [role='button']"
      );
      const worksHoverables = document.querySelectorAll(".works-card-hover");
      const viewAllHoverables = document.querySelectorAll(".works-viewall-hover");

      const onMouseEnter = () => {
        setIsHovered(true);
        // 일반 호버 시 링 크기를 2.2배 확대 및 면 채움
        gsap.to(ring, {
          scale: 2.2,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderWidth: "0px",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.2
        });
      };

      const onMouseLeave = () => {
        setIsHovered(false);
        // 원래 크기로 복원
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "transparent",
          borderWidth: "1.5px",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.2
        });
      };

      const onWorksEnter = () => {
        setIsWorksHovered(true);
        setCursorText("VIEW PROJECT");
        // 웍스 카드 호버 시 링을 4배 크기로 확대하고 다크 배경 테두리 지정
        gsap.to(ring, {
          scale: 4,
          backgroundColor: "rgba(5, 5, 8, 0.8)",
          borderColor: "var(--color-pink)",
          borderWidth: "1px",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.2
        });
      };

      const onWorksLeave = () => {
        setIsWorksHovered(false);
        setCursorText("");
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "var(--color-pink)",
          borderWidth: "1.5px",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.2
        });
      };

      const onViewAllEnter = () => {
        setIsWorksHovered(true);
        setCursorText("VIEW ALL");
        // 전체보기 카드 호버 시 링을 4배 크기로 확대하고 다크 배경 테두리 지정
        gsap.to(ring, {
          scale: 4,
          backgroundColor: "rgba(5, 5, 8, 0.8)",
          borderColor: "var(--color-pink)",
          borderWidth: "1px",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.2
        });
      };

      const onViewAllLeave = () => {
        setIsWorksHovered(false);
        setCursorText("");
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "var(--color-pink)",
          borderWidth: "1.5px",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.2
        });
      };

      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnter);
        el.addEventListener("mouseleave", onMouseLeave);
      });

      worksHoverables.forEach((el) => {
        el.addEventListener("mouseenter", onWorksEnter);
        el.addEventListener("mouseleave", onWorksLeave);
        el.addEventListener("touchstart", onWorksEnter);
        el.addEventListener("touchend", onWorksLeave);
      });

      viewAllHoverables.forEach((el) => {
        el.addEventListener("mouseenter", onViewAllEnter);
        el.addEventListener("mouseleave", onViewAllLeave);
        el.addEventListener("touchstart", onViewAllEnter);
        el.addEventListener("touchend", onViewAllLeave);
      });

      return () => {
        hoverables.forEach((el) => {
          el.removeEventListener("mouseenter", onMouseEnter);
          el.removeEventListener("mouseleave", onMouseLeave);
        });
        worksHoverables.forEach((el) => {
          el.removeEventListener("mouseenter", onWorksEnter);
          el.removeEventListener("mouseleave", onWorksLeave);
          el.removeEventListener("touchstart", onWorksEnter);
          el.removeEventListener("touchend", onWorksLeave);
        });
        viewAllHoverables.forEach((el) => {
          el.removeEventListener("mouseenter", onViewAllEnter);
          el.removeEventListener("mouseleave", onViewAllLeave);
          el.removeEventListener("touchstart", onViewAllEnter);
          el.removeEventListener("touchend", onViewAllLeave);
        });
      };
    };

    // 가상 DOM 변경 대응을 위해 MutationObserver로 호버 리스너를 실시간 재감지하여 바인딩
    let cleanHoverEvents = updateHoverEvents();

    const observer = new MutationObserver(() => {
      cleanHoverEvents();
      cleanHoverEvents = updateHoverEvents();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("touchmove", moveTouch);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      observer.disconnect();
      cleanHoverEvents();
    };
  }, []);

  return (
    <>
      {/* 1. 중심 핫핑크 도트 */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: -4,
          left: -4,
          width: "8px",
          height: "8px",
          backgroundColor: "var(--color-pink)",
          borderRadius: "50%",
          zIndex: 9999,
          pointerEvents: "none",
          transformOrigin: "center center",
          boxShadow: "0 0 8px var(--color-pink)"
        }}
      />
      {/* 2. 외부 스무스 링 */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: -16,
          left: -16,
          width: "32px",
          height: "32px",
          border: "1.5px solid var(--color-pink)",
          borderRadius: "50%",
          zIndex: 9998,
          pointerEvents: "none",
          transformOrigin: "center center",
          mixBlendMode: isHovered ? "difference" : "normal", // 일반 호버 시 반전, 웍스 호버 시 normal
          boxShadow: (isHovered || isWorksHovered) ? "none" : "0 0 10px rgba(255, 45, 120, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {isWorksHovered && (
          <span
            style={{
              color: "var(--color-yellow)",
              fontSize: "6px",
              fontWeight: 900,
              fontFamily: "var(--font-sub)",
              letterSpacing: "0.5px",
              textAlign: "center",
              textShadow: "0 0 4px var(--color-yellow)",
              whiteSpace: "nowrap"
            }}
          >
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
