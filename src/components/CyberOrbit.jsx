import React, { useState } from "react";

const CyberOrbit = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "350px",
        height: "350px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1000px", // 3D 입체감을 위한 원근법 설정
        pointerEvents: "auto", // 마우스 호버 트래킹 허용
        zIndex: 5
      }}
    >
      {/* 3D 궤도 콘테이너 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.5s ease"
        }}
      >
        {/* 1. 외부 대형 궤도 링 (X축 회전) */}
        <div
          style={{
            position: "absolute",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            border: `1px solid ${isHovered ? "var(--color-pink)" : "rgba(255, 45, 120, 0.15)"}`,
            transform: "rotateX(70deg) rotateY(10deg)",
            boxShadow: isHovered ? "0 0 20px rgba(255, 45, 120, 0.3), inset 0 0 20px rgba(255, 45, 120, 0.1)" : "none",
            animation: `spinX ${isHovered ? "8s" : "15s"} linear infinite`,
            transition: "border-color 0.4s ease, box-shadow 0.4s ease"
          }}
        />

        {/* 2. 중간 궤도 링 (Y축 회전) */}
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: `1px dashed ${isHovered ? "var(--color-yellow)" : "rgba(255, 224, 0, 0.15)"}`,
            transform: "rotateX(20deg) rotateY(70deg)",
            boxShadow: isHovered ? "0 0 15px rgba(255, 224, 0, 0.2)" : "none",
            animation: `spinY ${isHovered ? "6s" : "12s"} linear infinite`,
            transition: "border-color 0.4s ease, box-shadow 0.4s ease"
          }}
        />

        {/* 3. 내부 소형 궤도 링 (Z축 회전) */}
        <div
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: `1.5px solid ${isHovered ? "var(--color-pink)" : "rgba(255, 45, 120, 0.25)"}`,
            transform: "rotateX(45deg) rotateY(-45deg)",
            boxShadow: isHovered ? "0 0 25px rgba(255, 45, 120, 0.4)" : "none",
            animation: `spinZ ${isHovered ? "4s" : "8s"} linear infinite`,
            transition: "border-color 0.4s ease, box-shadow 0.4s ease"
          }}
        />

        {/* 4. 중앙 AI 스마트 코어 (깜빡이는 핫핑크/네온옐로우 글로우 노드) */}
        <div
          style={{
            position: "absolute",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: isHovered ? "var(--color-yellow)" : "var(--color-pink)",
            boxShadow: isHovered 
              ? "0 0 30px var(--color-yellow), 0 0 60px var(--color-yellow)" 
              : "0 0 20px var(--color-pink), 0 0 40px var(--color-pink)",
            animation: "pulseCore 2s infinite ease-in-out",
            transformStyle: "preserve-3d",
            transition: "background-color 0.4s ease, box-shadow 0.4s ease"
          }}
        >
          {/* 코어를 도는 위성 노드 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "var(--color-white)",
              boxShadow: "0 0 8px var(--color-white)",
              animation: "orbitNode 2.5s infinite linear",
              transformOrigin: "-20px 0px"
            }}
          />
        </div>
      </div>

      {/* 회전 애니메이션 정의 */}
      <style>{`
        @keyframes spinX {
          0% { transform: rotateX(70deg) rotateY(10deg) rotateZ(0deg); }
          100% { transform: rotateX(70deg) rotateY(10deg) rotateZ(360deg); }
        }
        @keyframes spinY {
          0% { transform: rotateX(20deg) rotateY(70deg) rotateZ(360deg); }
          100% { transform: rotateX(20deg) rotateY(70deg) rotateZ(0deg); }
        }
        @keyframes spinZ {
          0% { transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg); }
          100% { transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg); }
        }
        @keyframes pulseCore {
          0%, 100% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes orbitNode {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CyberOrbit;
