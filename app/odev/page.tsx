"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import Link from "next/link";

const PIECE_IMAGES: Record<string, string> = {
  wP: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
  wR: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
  wN: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
  wB: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
  wQ: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
  wK: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
  bP: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
  bR: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  bN: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  bB: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  bQ: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  bK: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
};

const SOUNDS = {
  move: "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3",
  capture: "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3",
  gameEnd: "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3",
};

// Haftalık Ödev Soruları (Mat Bulmacaları)
const ODEV_SORULARI = [
  {
    id: 1,
    title: "1. Görev: Çoban Matı Taktik Darbesi 🎯",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
    hint: "İpucu: Vezir zayıf f7 karesine saldırabilir!",
  },
  {
    id: 2,
    title: "2. Görev: Koridor Matı (Arka Sıra) 🏰",
    fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1",
    hint: "İpucu: Kaleyi en alt yataya (8. sıra) indir!",
  },
  {
    id: 3,
    title: "3. Görev: Vezir Dalışı 👑",
    fen: "r1b2rk1/ppp2ppp/2n5/3p4/7q/2B5/PPP1QPPP/2KR1B1R w - - 0 1",
    hint: "İpucu: Vezir e8 karesinden son sırayı vuruyor!",
  },
  {
    id: 4,
    title: "4. Görev: Zıplayan At Matı 🐴",
    fen: "6k1/5ppp/8/8/5N2/8/8/6K1 w - - 0 1",
    hint: "İpucu: At f4'ten e7'ye zıplayarak şaha kaçış bırakmıyor!",
  },
  {
    id: 5,
    title: "5. Görev: Merdiven Matı 🪜",
    fen: "7k/R7/8/8/8/8/1R6/6K1 w - - 0 1",
    hint: "İpucu: b2 kalesini b8'e indirerek mat et!",
  },
];

export default function OdevPage() {
  const [ogrenciAdi, setOgrenciAdi] = useState("");
  const [odevBasladi, setOdevBasladi] = useState(false);
  const [currentSoruIndex, setCurrentSoruIndex] = useState(0);
  const currentSoru = ODEV_SORULARI[currentSoruIndex];

  const [game, setGame] = useState(new Chess(currentSoru.fen));
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleSquares, setPossibleSquares] = useState<string[]>([]);
  const [durumMesaji, setDurumMesaji] = useState("Beyaz oynar, tek hamlede mat yapar!");
  const [hataliDenemeSayisi, setHataliDenemeSayisi] = useState(0);
  const [tamamlandi, setTamamlandi] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  function sesCal(tur: "move" | "capture" | "gameEnd") {
    try {
      const audio = new Audio(SOUNDS[tur]);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch {}
  }

  function handleSquareClick(square: string) {
    if (tamamlandi) return;

    if (!selectedSquare) {
      const piece = game.get(square as any);
      if (piece && piece.color === "w") {
        setSelectedSquare(square);
        const legalMoves = game.moves({ square: square as any, verbose: true });
        setPossibleSquares(legalMoves.map((m) => m.to));
        setDurumMesaji(`Seçildi: ${square.toUpperCase()} ➔ Hedefe dokun!`);
      }
      return;
    }

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: selectedSquare,
        to: square,
        promotion: "q",
      });

      if (move) {
        if (gameCopy.isCheckmate()) {
          setGame(gameCopy);
          setSelectedSquare(null);
          setPossibleSquares([]);
          sesCal("gameEnd");

          if (currentSoruIndex + 1 < ODEV_SORULARI.length) {
            setDurumMesaji("🌟 Tebrikler! Doğru hamle! 2 saniye sonra yeni soruya geçiliyor...");
            setTimeout(() => {
              const nextIndex = currentSoruIndex + 1;
              setCurrentSoruIndex(nextIndex);
              setGame(new Chess(ODEV_SORULARI[nextIndex].fen));
              setDurumMesaji("Beyaz oynar, tek hamlede mat yapar!");
            }, 1800);
          } else {
            // TÜM ÖDEV BİTTİ
            setTamamlandi(true);
            odeviSunucuyaGonder();
          }
        } else {
          setSelectedSquare(null);
          setPossibleSquares([]);
          setHataliDenemeSayisi((h) => h + 1);
          setDurumMesaji("❌ Bu hamle güzel ama mat yapmadı! Tekrar dene.");
          sesCal("move");
        }
      } else {
        setSelectedSquare(null);
        setPossibleSquares([]);
      }
    } catch {
      setSelectedSquare(null);
      setPossibleSquares([]);
      setHataliDenemeSayisi((h) => h + 1);
      setDurumMesaji("Geçersiz hamle! Tekrar dene.");
    }
  }

  async function odeviSunucuyaGonder() {
    setKaydediliyor(true);
    try {
      await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ogrenciAdi,
          toplamSoru: ODEV_SORULARI.length,
          dogruSayisi: ODEV_SORULARI.length,
          hataliHamleler: hataliDenemeSayisi,
        }),
      });
    } catch {}
    setKaydediliyor(false);
  }

  // 1. AŞAMA: ÖĞRENCİ İSİM GİRİŞ EKRANI
  if (!odevBasladi) {
    return (
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#fffbeb",
          padding: "24px",
          borderRadius: "24px",
          border: "4px solid #f59e0b",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
          margin: "20px auto",
        }}
      >
        <span style={{ fontSize: "48px" }}>📚</span>
        <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#78350f", margin: "10px 0 4px 0" }}>
          Haftalık Satranç Ödevi
        </h1>
        <p style={{ fontSize: "12px", color: "#92400e", marginBottom: "16px", fontWeight: "600" }}>
          Ödevini tamamladığında sonucun otomatik olarak öğretmenine iletilecektir!
        </p>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#78350f", marginBottom: "6px" }}>
            Adın ve Soyadın:
          </label>
          <input
            type="text"
            placeholder="Örn: Ali Yılmaz"
            value={ogrenciAdi}
            onChange={(e) => setOgrenciAdi(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "14px",
              border: "2px solid #fcd34d",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (ogrenciAdi.trim().length > 1) {
              setOdevBasladi(true);
            } else {
              alert("Lütfen adını ve soyadını yaz!");
            }
          }}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#10b981",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "14px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
          }}
        >
          Ödeve Başla 🚀
        </button>
      </div>
    );
  }

  // 3. AŞAMA: ÖDEV TAMAMLANDI TEBRİK EKRANI
  if (tamamlandi) {
    return (
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "24px",
          border: "4px solid #10b981",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          textAlign: "center",
          margin: "20px auto",
        }}
      >
        <span style={{ fontSize: "56px" }}>🎉</span>
        <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#1e293b", margin: "8px 0" }}>
          Harikasın, {ogrenciAdi}!
        </h2>
        <p style={{ fontSize: "13px", color: "#047857", fontWeight: "bold", margin: "0 0 16px 0" }}>
          Haftalık {ODEV_SORULARI.length} soruluk satranç ödevini başarıyla tamamladın! ⭐
        </p>

        <div
          style={{
            backgroundColor: "#f0fdf4",
            padding: "12px",
            borderRadius: "16px",
            border: "1px dashed #22c55e",
            marginBottom: "16px",
            fontSize: "12px",
            color: "#166534",
            fontWeight: "700",
          }}
        >
          {kaydediliyor ? (
            "Ödev sonucu öğretmenine iletiliyor... ⏳"
          ) : (
            "✅ Ödev sonucun başarıyla öğretmenin paneline kaydedildi!"
          )}
        </div>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#f59e0b",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "13px",
            borderRadius: "14px",
            textDecoration: "none",
          }}
        >
          🏠 Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // 2. AŞAMA: SORU ÇÖZME TAHTASI
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        backgroundColor: "#fffbeb",
        borderRadius: "24px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
        maxWidth: "400px",
        width: "100%",
        border: "4px solid #fcd34d",
        boxSizing: "border-box",
        userSelect: "none",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: "900", color: "#78350f" }}>
          👤 Öğrenci: {ogrenciAdi}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "900", color: "#d97706" }}>
          Soru: {currentSoruIndex + 1} / {ODEV_SORULARI.length}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "#fde68a",
          borderRadius: "9999px",
          textAlign: "center",
          fontWeight: "900",
          fontSize: "12px",
          color: "#451a03",
          marginBottom: "8px",
          minHeight: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {durumMesaji}
      </div>

      <div style={{ fontSize: "10px", color: "#92400e", textAlign: "center", fontStyle: "italic", marginBottom: "6px" }}>
        {currentSoru.hint}
      </div>

      {/* TAHTA */}
      <div
        style={{
          width: "352px",
          height: "352px",
          display: "grid",
          gridTemplateColumns: "repeat(8, 44px)",
          gridTemplateRows: "repeat(8, 44px)",
          borderRadius: "16px",
          overflow: "hidden",
          border: "4px solid #78350f",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
          backgroundColor: "#78350f",
        }}
      >
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${rank}`;
            const piece = game.get(square as any);
            const isDark = (rankIndex + fileIndex) % 2 === 1;
            const isSelected = selectedSquare === square;
            const isPossibleTarget = possibleSquares.includes(square);

            const pieceKey = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;
            const pieceImgUrl = pieceKey ? PIECE_IMAGES[pieceKey] : null;

            return (
              <button
                key={square}
                type="button"
                onClick={() => handleSquareClick(square)}
                style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0",
                  margin: "0",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#fde047" : isDark ? "#b58863" : "#f0d9b5",
                  outline: isSelected ? "3px solid #f59e0b" : "none",
                  zIndex: isSelected ? 5 : 1,
                }}
              >
                {pieceImgUrl && (
                  <img
                    src={pieceImgUrl}
                    alt={pieceKey || "piece"}
                    style={{ width: "36px", height: "36px", pointerEvents: "none", userSelect: "none" }}
                    draggable={false}
                  />
                )}

                {isPossibleTarget && !piece && (
                  <div
                    style={{
                      position: "absolute",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(5, 150, 105, 0.7)",
                      pointerEvents: "none",
                    }}
                  />
                )}
                {isPossibleTarget && piece && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "2px",
                      borderRadius: "50%",
                      border: "3px solid rgba(225, 29, 72, 0.8)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
