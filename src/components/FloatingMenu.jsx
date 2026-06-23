import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const menuItemsRef = useRef([]);

  const menuLinks = [
    { num: "01", label: "HOME", href: "#home" },
    { num: "02", label: "ABOUT", href: "#about" },
    { num: "03", label: "WORKS", href: "#works" },
    { num: "04", label: "SERVICES", href: "#services" },
    { num: "05", label: "CONTACT", href: "#contact" }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "30% top", // 히어로 섹션의 30% 수준(버튼 원래 자리)을 지나는 시점에 정밀 활성화/해제
      onToggle: (self) => {
        setIsSticky(!self.isActive);
      }
    });

    // 스크롤이 맨 위(0)에 도달 시 sticky 강제 해제하는 이중 방어막
    const handleScrollReset = () => {
      if (window.scrollY === 0) {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScrollReset);

    return () => {
      trigger.kill();
      window.removeEventListener("scroll", handleScrollReset);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // 1. 백드롭 페이드 인
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.4
      });

      // 2. 왼쪽 메뉴 패널 슬라이드 인 (x: 0%)
      gsap.to(panelRef.current, {
        x: "0%",
        duration: 0.65,
        ease: "power3.out"
      });

      // 3. 메뉴 항목 솟아오름 stagger
      gsap.fromTo(
        menuItemsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out", delay: 0.2 }
      );
    } else {
      // 닫힐 때
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.4
      });

      gsap.to(panelRef.current, {
        x: "-100%",
        duration: 0.55,
        ease: "power3.inOut"
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* 1. Chipsa 스타일 MENU 토글 버튼 (히어로 내 좌측 중간 배치) */}
      <button
        onClick={toggleMenu}
        className={`floating-menu-btn ${isSticky ? "is-sticky" : ""}`}
        style={{
          zIndex: 1000, // 팝업 패널(999) 위에 그대로 보이도록 1000 적용
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 20px",
          borderRadius: "12px",
          backgroundColor: isOpen ? "var(--color-pink)" : "rgba(20, 21, 26, 0.75)",
          backdropFilter: "blur(12px)",
          border: isOpen ? "1px solid var(--color-pink)" : "1px solid rgba(255, 255, 255, 0.1)",
          color: "var(--color-white)",
          cursor: "pointer",
          transition: "background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, opacity 0.3s ease",
          boxShadow: isOpen 
            ? "0 0 25px rgba(255, 45, 120, 0.4)" 
            : "0 10px 30px rgba(0, 0, 0, 0.3)",
          alignSelf: "flex-start",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          if (!isOpen) e.currentTarget.style.borderColor = "var(--color-pink)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          if (!isOpen) e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }}
      >
        {/* Chipsa 특유의 X/십자 형태 인터랙티브 아이콘 */}
        <div
          style={{
            width: "14px",
            height: "14px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isOpen ? "rotate(135deg)" : "rotate(0deg)",
            transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)"
          }}
        >
          <span style={{ position: "absolute", width: "100%", height: "1.5px", backgroundColor: "#ffffff" }} />
          <span style={{ position: "absolute", width: "1.5px", height: "100%", backgroundColor: "#ffffff" }} />
        </div>

        {/* MENU / CLOSE 텍스트 */}
        <span
          style={{
            fontFamily: "var(--font-sub)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase"
          }}
        >
          {isOpen ? "CLOSE" : "MENU"}
        </span>
      </button>

      {/* 2. 패널 바깥 빈 영역(우측 여백) 클릭 시 닫히도록 돕는 백드롭 레이어 */}
      <div
        ref={backdropRef}
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // 팝업 외부 화면 포커싱용 어두운 오버레이
          backdropFilter: "blur(4px)",
          opacity: 0,
          zIndex: 998,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s ease"
        }}
      />

      {/* 3. Chipsa 스타일 가로 폭 620px 세로 메뉴 패널 */}
      <div
        ref={panelRef}
        className="floating-menu-panel"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "620px", // 좌우 대칭 여백(왼쪽 100px - 오른쪽 100px 이상) 확보를 위해 620px로 조정
          maxWidth: "90vw",
          height: "100vh",
          backgroundColor: "#0A0A0D",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 999,
          transform: "translateX(-100%)", // 디폴트로 화면 왼쪽 밖에 숨김
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "180px 40px", // 상하 180px 패딩으로 위아래 넓은 여백 확보
          boxShadow: "20px 0 50px rgba(0, 0, 0, 0.5)",
          willChange: "transform"
        }}
      >
        {/* 메뉴 항목 */}
        <nav
          className="floating-menu-nav"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px", // 세로 공간 채움 gap 유지
            alignItems: "flex-start", // 좌측 정렬 복구
            justifyContent: "center",
            height: "100%",
            width: "100%",
            paddingLeft: "clamp(200px, 15vw, 260px)" // 메뉴 버튼(left 100px + 버튼 가로폭 약 120px) 우측으로 배치되도록 패딩 조정
          }}
        >
          {menuLinks.map((link, idx) => {
            return (
              <div
                key={idx}
                ref={(el) => (menuItemsRef.current[idx] = el)}
                style={{ overflow: "hidden", display: "flex", alignItems: "baseline", gap: "20px" }}
              >
                {/* 일련번호 */}
                <span
                  style={{
                    fontFamily: "var(--font-sub)",
                    fontSize: "13px",
                    color: "var(--color-pink)",
                    fontWeight: 500,
                    letterSpacing: "1px"
                  }}
                >
                  {link.num}
                </span>

                {/* 26px보다 더 큼직하고 시각적 무게감 있는 40px 타이포 */}
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "clamp(28px, 3.8vw, 40px)",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    color: "var(--color-white)",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    display: "inline-block",
                    transition: "color 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-pink)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-white)";
                  }}
                >
                  {link.label}
                </a>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default FloatingMenu;
