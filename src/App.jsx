import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import BackgroundCanvas from "./components/BackgroundCanvas";
import CustomCursor from "./components/CustomCursor";
import GNB from "./components/GNB";
import TextTicker from "./components/TextTicker";
import FloatingMenu from "./components/FloatingMenu";
import AboutCards from "./components/AboutCards";
import WorksCards from "./components/WorksCards";
import WorksArchive from "./components/WorksArchive";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import Admin from "./components/Admin";
import { projects } from "./data/projectsData";

// GSAP ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigateTo = (path) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    // 페이지 이동 시 즉시 최상단 스크롤 초기화
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const isAdmin = currentPath === "/admin";
  const isArchive = currentPath.startsWith("/works");

  const line1Ref = useRef(null);
  const tickerContainerRef = useRef(null);
  const line2Ref = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const worksSectionRef = useRef(null);
  const worksContainerRef = useRef(null);
  const worksServicesWrapperRef = useRef(null);

  useEffect(() => {
    if (currentPath === "/admin") return;

    // --- Lenis Smooth Scroll 초기화 ---
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    // 아카이브(/works) 페이지에서는 메인 홈 애니메이션을 실행하지 않고 스무스 스크롤만 활성화
    if (currentPath.startsWith("/works")) {
      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }

    // --- GSAP Hero Reveal Animation (비대칭 레이아웃 연출) ---
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // 1. 자이언트 타이포 페이드인 (좌측 상단 라인)
    tl.to(line1Ref.current, {
      duration: 1.3,
      opacity: 1,
      delay: 0.4
    });

    // 2. 중앙 텍스트 티커 페이드 인 및 확장
    tl.to(tickerContainerRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.out"
    }, "-=0.8");

    // 3. 우측 하단 라인 페이드인
    tl.to(line2Ref.current, {
      duration: 1.3,
      opacity: 1
    }, "-=1.1");

    // 4. 우측 스크롤 가이드 등장
    tl.to(scrollIndicatorRef.current, {
      opacity: 1,
      duration: 0.8
    }, "-=0.8");

    let mm = gsap.matchMedia();

    // ==========================================
    // 1. About Us Section ScrollTrigger Setup
    // ==========================================
    // PC & Tablet (> 600px): Pin + 3D Card Stack Slider
    mm.add("(min-width: 601px)", () => {
      if (card1Ref.current && card2Ref.current && card3Ref.current) {
        gsap.set(card1Ref.current, { y: 0, opacity: 1, scale: 1 });
        gsap.set(card2Ref.current, { y: 200, opacity: 0, scale: 0.95 });
        gsap.set(card3Ref.current, { y: 400, opacity: 0, scale: 0.95 });

        const tlSlider = gsap.timeline({
          scrollTrigger: {
            trigger: "#about",
            start: "top top",
            end: "+=1500",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        tlSlider.to(card1Ref.current, {
          y: -200,
          opacity: 0,
          scale: 0.95,
          ease: "power2.inOut"
        }, 0.1)
        .to(card2Ref.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.inOut"
        }, 0.1);

        tlSlider.to(card2Ref.current, {
          y: -200,
          opacity: 0,
          scale: 0.95,
          ease: "power2.inOut"
        }, 0.5)
        .to(card3Ref.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.inOut"
        }, 0.5);
      }
    });

    // Mobile (≤ 600px): Fade-in Stack without Pin
    mm.add("(max-width: 600px)", () => {
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
      cards.forEach((card) => {
        if (!card) return;
        gsap.set(card, { y: 40, opacity: 0 });
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    });

    // ==========================================
    // 2. Works Section ScrollTrigger Setup
    // ==========================================
    // PC & Mobile: Horizontal Scroll with Pin on works-services-wrapper
    // (PC/Mobile 모두 동일한 가로스크롤 로직이므로 matchMedia 없이 단일 등록)
    if (worksServicesWrapperRef.current && worksContainerRef.current && worksSectionRef.current) {
      gsap.to(worksContainerRef.current, {
        x: () => -(worksContainerRef.current.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: worksSectionRef.current,
          pin: worksServicesWrapperRef.current,
          scrub: 1,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${worksContainerRef.current.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true
        }
      });
    }

    // Force ScrollTrigger to refresh its calculations after layout renders
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimeout);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      mm.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, projects]);

  return (
    <>
      {/* 3D Twinkling Star Particles 배경 */}
      <BackgroundCanvas />

      {/* 커스텀 마그네틱 블렌딩 커서 - 어드민 페이지에서는 비활성화 */}
      {currentPath !== "/admin" && <CustomCursor />}

      {/* 라우팅 및 조건별 렌더링 분기 */}
      {isAdmin && <Admin navigateTo={navigateTo} />}

      {isArchive && <WorksArchive navigateTo={navigateTo} />}

      {!isAdmin && !isArchive && (
        <main style={{ width: "100%", minHeight: "200vh", paddingTop: 0, position: "relative", zIndex: 10 }}>
        
        {/* 1. Hero Section (비대칭 좌측 상단 & 우측 하단 배치) */}
        <section
          id="home"
          className="hero-section"
        >
          {/* [확정] 은은한 1번 오로라 배경 이미지 레이어 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "url(/images/bg_aurora.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.22,
              mixBlendMode: "screen",
              zIndex: -1,
              pointerEvents: "none"
            }}
          />

          {/* 공통 헤더 네비게이션을 히어로 섹션 내부 최상단 UI로 직접 편입 */}
          <GNB />

          {/* [상단 영역] LINE 1 */}
          <div className="hero-line-1">
            <h1
              ref={line1Ref}
              style={{
                fontSize: "clamp(32px, 5.5vw, 76px)",
                fontFamily: "var(--font-headline)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.0,
                color: "var(--color-white)",
                textTransform: "uppercase",
                opacity: 0
              }}
            >
              VISUALIZING EMOTION,
            </h1>
          </div>

          {/* Chipsa 스타일의 MENU 버튼을 히어로 내 좌측 여백(헤드라인1과 티커 사이)에 편입 */}
          <div className="hero-menu-container">
            <FloatingMenu navigateTo={navigateTo} />
          </div>

          {/* [중앙 영역] OPTION 1: 텍스트 티커 루프 */}
          <div 
            ref={tickerContainerRef}
            className="hero-ticker-container"
            style={{ 
              position: "absolute",
              top: "53%",
              left: 0,
              width: "100%",
              transform: "translateY(-50%)",
              opacity: 0,
              zIndex: 5
            }}
          >
            <TextTicker />
          </div>

          {/* [하단 영역] LINE 2 (한글 슬로건 제외) */}
          <div className="hero-line-2">
            <div style={{ overflow: "hidden", paddingBottom: "15px", width: "100%" }}>
              <h1
                ref={line2Ref}
                style={{
                  fontSize: "clamp(32px, 5.5vw, 76px)",
                  fontFamily: "var(--font-headline)",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.0,
                  textTransform: "uppercase",
                  opacity: 0
                }}
              >
                INTEGRATING <span className="gradient-text-pink-yellow">INNOVATION.</span>
              </h1>
            </div>
          </div>

          {/* [좌측 하단 배치] 스크롤 다운 인디케이터 (대각선 대칭 완성) */}
          <div
            ref={scrollIndicatorRef}
            className="hero-scroll-indicator"
            style={{
              opacity: 0
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sub)",
                fontSize: "10px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                letterSpacing: "3px"
              }}
            >
              SCROLL DOWN
            </span>
            <div
              style={{
                width: "2px",
                height: "40px",
                background: "linear-gradient(to bottom, var(--color-pink), transparent)",
                animation: "pulse 2s infinite"
              }}
            />
          </div>
        </section>

        {/* 2. [3단계] About Me (소개 및 AI 스펙트럼 3D 대칭 겹침 카드 구현) */}
        <section
          id="about"
          style={{
            minHeight: "100vh",
            padding: "160px 100px 100px",
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          {/* 상단 중앙 영역 번호 및 타이틀 */}
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span style={{
              fontFamily: "var(--font-sub)",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--color-pink)",
              letterSpacing: "3px"
            }}>
              PHASE 02
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
              ABOUT US
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
              Bridging creative design with solid engineering to build the next generation of web products.
            </p>
          </div>

          {/* 중앙 정렬된 3D 겹침 카드 컨테이너 */}
          <div style={{ width: "100%", maxWidth: "680px", position: "relative" }}>
            <AboutCards card1Ref={card1Ref} card2Ref={card2Ref} card3Ref={card3Ref} />
          </div>
        </section>

        {/* Works & Services Pin Wrapper (모바일에서 자연스러운 여백 상태로 걸쳐두기 위해 핀 처리 공유) */}
        <div
          ref={worksServicesWrapperRef}
          className="works-services-wrapper"
          style={{ width: "100%", position: "relative" }}
        >
          {/* 3. [4단계] Works (프로젝트 가로 스크롤 및 마그네틱 틸트 카드) */}
          <section
            ref={worksSectionRef}
            id="works"
            style={{
              minHeight: "100vh",
              width: "100%",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "var(--bg-base)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "100px 0"
            }}
          >
            {/* Works 섹션의 상단 중앙 고정 번호 및 타이틀 영역 */}
            <div 
              className="works-title-area"
              style={{ 
                textAlign: "center",
                marginBottom: "50px",
                width: "100%",
                zIndex: 5
              }}
            >
              <span style={{ fontFamily: "var(--font-sub)", fontSize: "12px", fontWeight: 500, color: "var(--color-pink)", letterSpacing: "3px" }}>
                PHASE 03
              </span>
              <h2 
                style={{ 
                  fontFamily: "var(--font-headline)",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 4.5vw, 56px)", 
                  color: "var(--color-white)",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  marginTop: "8px",
                  lineHeight: 1.2
                }}
              >
                <span className="gradient-text-pink-yellow">PROJECTS</span>
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
                A curated showcase of interactive web applications, visual design, and digital platforms.
              </p>
            </div>

            {/* 카드들만 들어있는 가로 스크롤 컨테이너 트랙 */}
            <div 
              ref={worksContainerRef}
              className="works-track"
            >
              {/* 비대칭 프로젝트 카드 나열 컴포넌트 */}
              <WorksCards navigateTo={navigateTo} />
            </div>
          </section>

          {/* 4. [5단계] Services (1px 미니멀 네온 아코디언) */}
          <ServicesSection />
        </div>

        {/* 5. [5단계] Contact (EmailJS 글로잉 의뢰 폼) */}
        <ContactSection />
      </main>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </>
  );
}

export default App;
