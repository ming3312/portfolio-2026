import { useEffect, useRef } from "react";

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // 화면 크기 설정 (레티나 디스플레이 대응)
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 파티클 생성
    // 화면 크기보다 넓게 배치하여 마우스 패럴랙스 이동 시 여백이 생기지 않도록 함
    const margin = 100;
    const particleCount = 140; // 너무 복잡하지 않게 140개 정도로 제한하여 쾌적하게 배치
    const particles = [];

    const colors = [
      "rgba(255, 255, 255, ",
      "rgba(248, 250, 252, ", // --text-primary 계열
      "rgba(154, 140, 144, "  // --text-secondary 계열 (웜 그레이)
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width + margin * 2) - margin,
        y: Math.random() * (height + margin * 2) - margin,
        size: Math.random() * 0.9 + 0.5, // 0.5px ~ 1.4px로 극도로 미세하게
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.8 + Math.random() * 1.2, // 천천히 반짝이는 주기 속도
        offset: Math.random() * Math.PI * 2, // 주기 오프셋
        baseOpacity: 0.15 + Math.random() * 0.45, // 기본 불투명도 (낮게 설정하여 은은하게)
      });
    }

    // 마우스 패럴랙스 값
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      // 마우스가 화면 중심으로부터 얼마나 떨어져 있는지 비율 계산 (-0.5 ~ 0.5)
      targetX = (e.clientX / window.innerWidth - 0.5) * 25; // 최대 25px 이동
      targetY = (e.clientY / window.innerHeight - 0.5) * 25;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = (time) => {
      const seconds = time * 0.001;

      // 마우스 감쇠 연산
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. 미세 입자 그리기
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const alpha = p.baseOpacity * (0.15 + 0.85 * (0.5 + 0.5 * Math.sin(seconds * p.speed + p.offset)));
        const depth = 0.2 + (i % 4) * 0.25; // 0.2, 0.45, 0.7, 0.95 가중치
        const renderX = p.x - mouseX * depth;
        const renderY = p.y - mouseY * depth;

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.colorPrefix + alpha + ")";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        display: "block"
      }}
    />
  );
};

export default BackgroundCanvas;
