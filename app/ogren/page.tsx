"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PieceInfo {
  id: string;
  name: string;
  points: string;
  avatar: string;
  image: string;
  colorBg: string;
  movement: string;
  superPower: string;
  tip: string;
  animDesc: string;
  // 5x5 grid koordinatları [satır, sütun] (0-4)
  startPos: [number, number];
  endPos: [number, number];
  pathType: "L" | "straight" | "diagonal" | "step";
  targetSquares: [number, number][];
}

const PIECES: PieceInfo[] = [
  {
    id: "pawn",
    name: "Piyon (Cesur Asker)",
    points: "1 Puan",
    avatar: "♟️",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
    colorBg: "#fef3c7",
    movement: "İlk hamlesinde 2, sonra hep 1 adım düz gider. Taşları ise 1 kare çapraz yer!",
    superPower: "En son sıraya vardığında Vezir veya Kaleye dönüşebilir! (Terfi)",
    tip: "Küçük görünür ama birlikte durduklarında aşılmaz bir duvar olurlar!",
    animDesc: "Piyon 1 adım ileri gider, çaprazdaki kareyi tehdit eder!",
    startPos: [3, 2],
    endPos: [2, 2],
    pathType: "step",
    targetSquares: [[2, 2], [1, 1], [1, 3]],
  },
  {
    id: "knight",
    name: "At (Zıp Zıp Süvari)",
    points: "3 Puan",
    avatar: "🐴",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
    colorBg: "#fce7f3",
    movement: "'L' harfi şeklinde zıplar: 2 kare düz + 1 kare yana!",
    superPower: "Tahtada diğer taşların üzerinden atlayabilen TEK taştır!",
    tip: "Merkezdeki bir at aynı anda 8 farklı kareye birden tehdit savurur.",
    animDesc: "At engelleri aşar ve 'L' çizerek hedefe sıçrar!",
    startPos: [3, 2],
    endPos: [1, 3],
    pathType: "L",
    targetSquares: [[1, 3], [1, 1], [2, 4], [4, 4]],
  },
  {
    id: "bishop",
    name: "Fil (Çapraz Büyücü)",
    points: "3 Puan",
    avatar: "🧙‍♂️",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
    colorBg: "#dcfce7",
    movement: "Sadece kendi rengindeki karelerde sonsuz çapraz gider.",
    superPower: "Uzak diyarlardan tahtanın öbür ucundaki kareleri gözler.",
    tip: "Beyaz karede başlayan fil hayatı boyunca hep beyaz karelerde uçar!",
    animDesc: "Fil çapraz yol boyunca hızla kayar!",
    startPos: [3, 1],
    endPos: [1, 3],
    pathType: "diagonal",
    targetSquares: [[0, 4], [1, 3], [2, 2], [4, 0]],
  },
  {
    id: "rook",
    name: "Kale (Güçlü Kule)",
    points: "5 Puan",
    avatar: "🏰",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
    colorBg: "#e0f2fe",
    movement: "İleri, geri, sağa ve sola dümdüz çizgiler halinde uçar.",
    superPower: "Şahı korumak için onunla 'Rok' adında özel bir takas hamlesi yapar.",
    tip: "Açık yolları çok sever, oyun sonlarında durdurulamaz bir güç olur.",
    animDesc: "Kale düz bir hat boyunca kayar!",
    startPos: [3, 2],
    endPos: [0, 2],
    pathType: "straight",
    targetSquares: [[0, 2], [1, 2], [2, 2], [4, 2], [3, 0], [3, 4]],
  },
  {
    id: "queen",
    name: "Vezir (Süper Kahraman)",
    points: "9 Puan",
    avatar: "👑",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
    colorBg: "#fef08a",
    movement: "Hem Kale hem Fil gibidir! Düz ve çapraz her yöne uçar.",
    superPower: "Tahtanın en hareketli ve en güçlü generali odur.",
    tip: "Çok güçlüdür ama erkenden tek başına rakip orduya daldırmamalısın!",
    animDesc: "Vezir hem düz hem çapraz tüm kareleri fetheder!",
    startPos: [3, 1],
    endPos: [0, 4],
    pathType: "diagonal",
    targetSquares: [[0, 4], [1, 3], [2, 2], [3, 4], [0, 1]],
  },
  {
    id: "king",
    name: "Şah (Ordunun Kalbi)",
    points: "Sonsuz Puan",
    avatar: "🤴",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    colorBg: "#ffedd5",
    movement: "Her yöne sadece ve sadece 1 adım gidebilir.",
    superPower: "Asla yenilip tahtadan çıkmaz, tehdit edilince korunmalıdır!",
    tip: "Oyunun başında köşede rok yaparak saklanmalı, sonlarda sahneye çıkmalıdır.",
    animDesc: "Şah dikkatli adımlarla çevresindeki 1 kareye ilerler.",
    startPos: [2, 2],
    endPos: [1, 2],
    pathType: "step",
    targetSquares: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2], [3, 3]],
  },
];

export default function OgrenPage() {
  const [selectedPieceId, setSelectedPieceId] = useState<string>("knight");
  const [animStep, setAnimStep] = useState<number>(0);

  const activePiece = PIECES.find((p) => p.id === selectedPieceId) || PIECES[1];

  // Otomatik animasyon döngüsü (taş startPos ile endPos arasında hareket eder)
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimStep((prev) => (prev === 0 ? 1 : 0));
    }, 1400);
    return () => clearInterval(timer);
  }, [selectedPieceId]);

  const currentPos = animStep === 0 ? activePiece.startPos : activePiece.endPos;

  return (
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        paddingBottom: "40px",
      }}
    >
      <div style={{ textAlign: "center", marginTop: "4px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#78350f", margin: "0 0 4px 0" }}>
          🏰 Taşları ve Hareketlerini Öğren!
        </h1>
        <p style={{ fontSize: "12px", color: "#92400e", margin: 0, fontWeight: "600" }}>
          Bir taşa tıkla, nasıl hareket ettiğini canlı animasyonla izle! ✨
        </p>
      </div>

      {/* CANLI ANİMASYONLU MİNİ TAHTA ALANI */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "16px",
          border: "4px solid #f59e0b",
          boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "24px" }}>{activePiece.avatar}</span>
          <span style={{ fontSize: "15px", fontWeight: "900", color: "#1e293b" }}>
            {activePiece.name} Hareketi
          </span>
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#047857",
            backgroundColor: "#d1fae5",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontWeight: "800",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          🎬 {activePiece.animDesc}
        </div>

        {/* 5x5 Mini Tahta */}
        <div
          style={{
            width: "220px",
            height: "220px",
            display: "grid",
            gridTemplateColumns: "repeat(5, 44px)",
            gridTemplateRows: "repeat(5, 44px)",
            borderRadius: "14px",
            overflow: "hidden",
            border: "3px solid #78350f",
            backgroundColor: "#78350f",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            position: "relative",
          }}
        >
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => {
              const isDark = (r + c) % 2 === 1;
              const isTarget = activePiece.targetSquares.some(([tr, tc]) => tr === r && tc === c);
              const isStart = activePiece.startPos[0] === r && activePiece.startPos[1] === c;

              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: isDark ? "#b58863" : "#f0d9b5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {/* Başlangıç Noktası İzi */}
                  {isStart && (
                    <div
                      style={{
                        position: "absolute",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(245, 158, 11, 0.4)",
                      }}
                    />
                  )}

                  {/* Hedef Kare Işıkları */}
                  {isTarget && (
                    <div
                      style={{
                        position: "absolute",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(16, 185, 129, 0.7)",
                        boxShadow: "0 0 6px rgba(16, 185, 129, 0.9)",
                      }}
                    />
                  )}
                </div>
              );
            })
          )}

          {/* Hareket Eden Animasyonlu Taş */}
          <div
            style={{
              position: "absolute",
              width: "44px",
              height: "44px",
              top: `${currentPos[0] * 44}px`,
              left: `${currentPos[1] * 44}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                activePiece.pathType === "L"
                  ? "top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  : "all 0.8s ease-in-out",
              zIndex: 10,
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
            }}
          >
            <img
              src={activePiece.image}
              alt={activePiece.name}
              style={{
                width: "36px",
                height: "36px",
                transform: animStep === 1 ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
        </div>

        <span style={{ fontSize: "10px", color: "#64748b", marginTop: "8px", fontWeight: "bold" }}>
          Yeşil noktalar taşın gidebileceği kareleri gösterir ⭐
        </span>
      </div>

      {/* TAŞ SEÇİM KARTLARI LİSTESİ */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        {PIECES.map((piece) => {
          const isSelected = selectedPieceId === piece.id;

          return (
            <div
              key={piece.id}
              onClick={() => {
                setSelectedPieceId(piece.id);
                setAnimStep(0);
              }}
              style={{
                backgroundColor: piece.colorBg,
                borderRadius: "20px",
                padding: "14px",
                border: isSelected ? "3px solid #f59e0b" : "2px solid #fde68a",
                boxShadow: isSelected ? "0 6px 16px rgba(245, 158, 11, 0.25)" : "0 2px 6px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                cursor: "pointer",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={piece.image}
                    alt={piece.name}
                    style={{ width: "38px", height: "38px", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.15))" }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "900", color: "#1e293b" }}>
                      {piece.name}
                    </h3>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#d97706" }}>
                      ⭐ Değeri: {piece.points}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: isSelected ? "#f59e0b" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#78350f",
                    fontSize: "11px",
                    fontWeight: "900",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {isSelected ? "🎬 Oynatılıyor" : "✨ Hareketi Gör"}
                </button>
              </div>

              <div style={{ fontSize: "12px", color: "#334155", lineHeight: "1.4" }}>
                <strong>🚶 Nasıl Gider?</strong> {piece.movement}
              </div>

              <div style={{ fontSize: "12px", color: "#15803d", lineHeight: "1.4" }}>
                <strong>⚡ Süper Gücü:</strong> {piece.superPower}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "#78350f",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  padding: "6px 10px",
                  borderRadius: "10px",
                  fontStyle: "italic",
                }}
              >
                💡 <strong>İpucu:</strong> {piece.tip}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sayfa Altı Butonu */}
      <Link
        href="/"
        style={{
          marginTop: "8px",
          padding: "12px 28px",
          backgroundColor: "#10b981",
          color: "#ffffff",
          borderRadius: "16px",
          textDecoration: "none",
          fontWeight: "900",
          fontSize: "14px",
          boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
          textAlign: "center",
        }}
      >
        🎮 Öğrendim! Şimdi Oyuna Dön ➔
      </Link>
    </div>
  );
}
