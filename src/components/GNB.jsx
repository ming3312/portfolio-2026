import { useState, useEffect } from "react";

const GNB = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 슬로건을 바탕으로 구성한 Buzzworthy 스타일 회전 텍스트 목록 (영문 대문자, 자간 극대화 매칭)
  const slideTexts = [
    "CRAFTING HIGH-END BRAND IDENTITY",
    "INTEGRATING AI & ROBUST SERVER INFRA",
    "SPARKING COLLABORATIVE ENERGY",
    "BUILDING HYPER-INTERACTIVE WEB"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slideTexts.length);
    }, 3000);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [slideTexts.length]);

  return (
    <header
      style={{
        position: "relative", // relative로 변경하여 부모 히어로 섹션 내의 자연스러운 첫 번째 UI 요소로 동작하게 함
        width: "100%",
        height: "100px", // 상하 높이 유지
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        backgroundColor: "transparent",
        backdropFilter: "none",
        borderBottom: "none",
        padding: 0 // 좌우 패딩을 0으로 만들어, 부모인 히어로 섹션의 패딩(100px)과 로고 시작선을 완벽하게 일치시킴
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}
      >
        {/* 1. 좌측 영역 (로고 + 브랜드 명칭 또는 모바일 WE 슬라이더) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: windowWidth <= 600 ? "16px" : (windowWidth > 768 ? "48px" : "16px")
          }}
        >
          <a
            href="#home"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center"
            }}
          >
            {/* 메인 Ming 텍스트 로고 (Playfair Display 폰트, i만 메인 핑크 및 이탤릭) */}
            <span
              style={{
                fontFamily: "var(--font-logo)",
                fontSize: windowWidth <= 600 ? "24px" : "22px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                display: "inline-block"
              }}
            >
              <span style={{ color: "var(--color-white)" }}>M</span>
              <span style={{ color: "var(--color-pink)", fontStyle: "italic" }}>i</span>
              <span style={{ color: "var(--color-white)" }}>ng</span>
            </span>
          </a>

          {/* 브랜드 명칭 (데스크톱 및 태블릿에서만 노출, 모바일(<=600)에서는 감춤) */}
          {windowWidth > 600 && windowWidth > 768 && (
            <span
              style={{
                fontFamily: "var(--font-sub)", // Space Grotesk
                fontSize: "11px",              // 11px
                fontWeight: 300,               // 300
                letterSpacing: "2px",          // 2px
                color: "var(--color-white)",   // 화이트로 변경
                textTransform: "uppercase"
              }}
            >
              KZOOCOMPANY / WEB
            </span>
          )}

          {/* 모바일(<=600) 전용: KZOOCOMPANY / WEB 대신 로고 옆에 WE 슬라이더 배치 */}
          {windowWidth <= 600 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-sub)",
                fontSize: "10.5px",
                fontWeight: 400,
                letterSpacing: "0.5px",
                color: "var(--text-primary)"
              }}
            >
              {/* WE 고정 텍스트 */}
              <span style={{ color: "var(--color-white)", fontWeight: 500 }}>WE</span>

              {/* 깜빡이는 빨간(핫핑크) 닷 */}
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-pink)",
                  animation: "blink 1.5s infinite",
                  boxShadow: "0 0 10px var(--color-pink)"
                }}
              />

              {/* 슬라이딩 텍스트 콘테이너 */}
              <div
                style={{
                  height: "20px",
                  overflow: "hidden",
                  position: "relative",
                  width: "200px"
                }}
              >
                {slideTexts.map((text, idx) => {
                  const isCurrent = idx === slideIndex;
                  return (
                    <div
                      key={text}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        transform: isCurrent ? "translateY(0)" : "translateY(100%)",
                        opacity: isCurrent ? 1 : 0,
                        transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.6s ease",
                        color: isCurrent ? "var(--color-white)" : "var(--text-secondary)",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. 우측 Buzzworthy 스타일 슬라이딩 인포 텍스트 (모바일(<=600)이 아닐 때만 우측 표시) */}
        {windowWidth > 600 && windowWidth > 480 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontFamily: "var(--font-sub)", // 미래지향적 폰트 (Space Grotesk)
              fontSize: "11px",
              fontWeight: 300, 
              letterSpacing: "2px", // 자간을 2px로 좁힘
              color: "var(--text-primary)"
            }}
          >
            {/* WE 고정 텍스트 (화이트로 변경) */}
            <span style={{ color: "var(--color-white)" }}>WE</span>

            {/* 깜빡이는 빨간(핫핑크) 닷 */}
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--color-pink)",
                animation: "blink 1.5s infinite",
                boxShadow: "0 0 10px var(--color-pink)",
                margin: "0 2px"
              }}
            />

            {/* 슬라이딩 텍스트 콘테이너 (화면 너비에 맞춰 가변 폭 적용) */}
            <div
              style={{
                height: "20px",
                overflow: "hidden",
                position: "relative",
                width: windowWidth > 768 ? "280px" : "180px" // 태블릿/작은데스크톱 이하에서는 너비를 줄임
              }}
            >
              {slideTexts.map((text, idx) => {
                const isCurrent = idx === slideIndex;
                
                return (
                  <div
                    key={text}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      transform: isCurrent ? "translateY(0)" : "translateY(100%)",
                      opacity: isCurrent ? 1 : 0,
                      transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.6s ease",
                      color: isCurrent ? "var(--color-white)" : "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </header>
  );
};

export default GNB;
