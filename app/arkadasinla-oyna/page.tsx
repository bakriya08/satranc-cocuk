"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";

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
  check: "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3",
  gameEnd: "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3",
};

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 100,
};

const PRESET_OPTIONS = [
  { id: "none", label: "Süresiz ♾️", minutes: 0, increment: 0 },
  { id: "3+2", label: "3+2 ⚡", minutes: 3, increment: 2 },
  { id: "5+3", label: "5+3 ⭐", minutes: 5, increment: 3 },
  { id: "10+5", label: "10+5 ⏳", minutes: 10, increment: 5 },
];

export default function ArkadasinlaOynaPage() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleSquares, setPossibleSquares] = useState<string[]>([]);
  const [durumMesaji, setDurumMesaji] = useState("Sıra Beyaz Oyuncuda! (🦁)");
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);

  // Zaman Sayacı Durumları
  const [selectedPresetId, setSelectedPresetId] = useState<string>("5+3");
  const [incrementSeconds, setIncrementSeconds] = useState<number>(3);
  const [whiteTime, setWhiteTime] = useState<number>(300);
  const [blackTime, setBlackTime] = useState<number>(300);
  const [isClockRunning, setIsClockRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Manuel Ayar Paneli
  const [showCustomPanel, setShowCustomPanel] = useState<boolean>(false);
  const [customWhiteMinutes, setCustomWhiteMinutes] = useState<number>(5);
  const [customBlackMinutes, setCustomBlackMinutes] = useState<number>(5);
  const [customIncrement, setCustomIncrement] = useState<number>(3);

  const defaultFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const defaultRanks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const files = isFlipped ? [...defaultFiles].reverse() : defaultFiles;
  const ranks = isFlipped ? [...defaultRanks].reverse() : defaultRanks;

  const currentTurn = game.turn(); // 'w' veya 'b'

  function sesCal(tur: "move" | "capture" | "check" | "gameEnd") {
    try {
      const audio = new Audio(SOUNDS[tur]);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch {}
  }

  // ZAMAN SAYACI DÖNGÜSÜ
  useEffect(() => {
    if ((whiteTime === 0 && blackTime === 0) || !isClockRunning || isPaused || game.isGameOver()) {
      return;
    }

    const interval = setInterval(() => {
      if (currentTurn === "w" && whiteTime > 0) {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            sesCal("gameEnd");
            setDurumMesaji("⏱️ Süre bitti! 🐯 Siyah Oyuncu Kazandı! 🏆");
            return 0;
          }
          return prev - 1;
        });
      } else if (currentTurn === "b" && blackTime > 0) {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            sesCal("gameEnd");
            setDurumMesaji("⏱️ Süre bitti! 🦁 Beyaz Oyuncu Kazandı! 🏆");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockRunning, isPaused, currentTurn, game, whiteTime, blackTime]);

  function formatTime(seconds: number) {
    if (seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  const whiteScore = capturedByWhite.reduce((acc, p) => acc + (PIECE_VALUES[p.toLowerCase()] || 0), 0);
  const blackScore = capturedByBlack.reduce((acc, p) => acc + (PIECE_VALUES[p.toLowerCase()] || 0), 0);

  function handleSquareClick(square: string) {
    if (game.isGameOver()) return;
    const hasTimer = whiteTime > 0 || blackTime > 0;
    if (hasTimer && isClockRunning && ((currentTurn === "w" && whiteTime === 0) || (currentTurn === "b" && blackTime === 0) || isPaused)) {
      return;
    }

    if (!selectedSquare) {
      const piece = game.get(square as any);
      if (piece && piece.color === currentTurn) {
        setSelectedSquare(square);
        const legalMoves = game.moves({ square: square as any, verbose: true });
        setPossibleSquares(legalMoves.map((m) => m.to));
        setDurumMesaji(`Seçildi: ${square.toUpperCase()} ➔ Hedefe dokun!`);
      } else if (piece) {
        setDurumMesaji(`Sıra ${currentTurn === "w" ? "Beyaz" : "Siyah"} oyuncuda!`);
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
        // Hamle yapıldığında saate saniye ekleme (Fischer Increment)
        if (isClockRunning && incrementSeconds > 0) {
          if (currentTurn === "w") {
            setWhiteTime((t) => t + incrementSeconds);
          } else {
            setBlackTime((t) => t + incrementSeconds);
          }
        }

        // İlk geçerli hamlede saati başlat
        if (!isClockRunning && (whiteTime > 0 || blackTime > 0)) {
          setIsClockRunning(true);
        }

        setGame(gameCopy);
        setSelectedSquare(null);
        setPossibleSquares([]);

        if (move.captured) {
          if (currentTurn === "w") {
            setCapturedByWhite((prev) => [...prev, String(move.captured)]);
          } else {
            setCapturedByBlack((prev) => [...prev, String(move.captured)]);
          }
          sesCal("capture");
        } else if (gameCopy.inCheck()) {
          sesCal("check");
        } else {
          sesCal("move");
        }

        if (gameCopy.isGameOver()) {
          sesCal("gameEnd");
          if (gameCopy.isCheckmate()) {
            const kazanan = currentTurn === "w" ? "🦁 Beyaz" : "🐯 Siyah";
            setDurumMesaji(`🎉 ŞAH MAT! ${kazanan} Oyuncu Kazandı! 🏆`);
          } else {
            setDurumMesaji("Oyun berabere bitti! 🤝");
          }
          return;
        }

        const nextPlayer = gameCopy.turn() === "w" ? "Beyaz (🦁)" : "Siyah (🐯)";
        const sah = gameCopy.inCheck() ? " (ŞAH ÇEKİLDİ! ⚠️)" : "";
        setDurumMesaji(`Sıra ${nextPlayer}'da!${sah}`);

        if (autoFlip) {
          setIsFlipped(gameCopy.turn() === "b");
        }
      } else {
        const piece = game.get(square as any);
        if (piece && piece.color === currentTurn) {
          setSelectedSquare(square);
          const legalMoves = game.moves({ square: square as any, verbose: true });
          setPossibleSquares(legalMoves.map((m) => m.to));
          setDurumMesaji(`Seçildi: ${square.toUpperCase()} ➔ Hedefe dokun!`);
        } else {
          setSelectedSquare(null);
          setPossibleSquares([]);
          setDurumMesaji("Oraya gidemezsin!");
        }
      }
    } catch {
      setSelectedSquare(null);
      setPossibleSquares([]);
      setDurumMesaji("Geçersiz hamle!");
    }
  }

  function hamleGeriAl() {
    const gameCopy = new Chess(game.fen());
    const undone = gameCopy.undo();
    if (undone) {
      setGame(gameCopy);
      setSelectedSquare(null);
      setPossibleSquares([]);
      const player = gameCopy.turn() === "w" ? "Beyaz (🦁)" : "Siyah (🐯)";
      setDurumMesaji(`Son hamle geri alındı. Sıra ${player}'da.`);
      if (autoFlip) {
        setIsFlipped(gameCopy.turn() === "b");
      }
    }
  }

  function oyunuSifirla(yeniBeyaz?: number, yeniSiyah?: number, yeniInc?: number) {
    const w = yeniBeyaz !== undefined ? yeniBeyaz : whiteTime;
    const b = yeniSiyah !== undefined ? yeniSiyah : blackTime;
    if (yeniInc !== undefined) setIncrementSeconds(yeniInc);
    setGame(new Chess());
    setSelectedSquare(null);
    setPossibleSquares([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setIsFlipped(false);
    setIsClockRunning(false);
    setIsPaused(false);
    setWhiteTime(w);
    setBlackTime(b);
    setDurumMesaji("Yeni oyun başladı! Sıra Beyaz Oyuncuda (🦁)");
  }

  function manuelSureyiUygula() {
    const wSeconds = Math.max(1, customWhiteMinutes) * 60;
    const bSeconds = Math.max(1, customBlackMinutes) * 60;
    setSelectedPresetId("custom");
    setShowCustomPanel(false);
    oyunuSifirla(wSeconds, bSeconds, customIncrement);
  }

  const hasTimer = whiteTime > 0 || blackTime > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "#fffbeb",
        borderRadius: "24px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
        maxWidth: "400px",
        width: "100%",
        border: "4px solid #93c5fd",
        boxSizing: "border-box",
        userSelect: "none",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h2 style={{ margin: "0 0 2px 0", fontSize: "18px", fontWeight: "900", color: "#1e3a8a" }}>
          👥 İki Kişilik Turnuva Modu
        </h2>
        <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "bold" }}>
          Dakika + Saniye Ekleme (İncrement) Destekli Saat ⏱️
        </span>
      </div>

      {/* TEMPO SEÇİM BARLARI */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          width: "100%",
          marginBottom: "6px",
          backgroundColor: "#f0fdf4",
          padding: "4px",
          borderRadius: "14px",
          border: "1px solid #bbf7d0",
        }}
      >
        {PRESET_OPTIONS.map((opt) => {
          const isSelected = selectedPresetId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelectedPresetId(opt.id);
                setShowCustomPanel(false);
                const secs = opt.minutes * 60;
                oyunuSifirla(secs, secs, opt.increment);
              }}
              style={{
                flex: 1,
                padding: "6px 2px",
                borderRadius: "10px",
                border: "none",
                fontSize: "10.5px",
                fontWeight: "900",
                cursor: "pointer",
                backgroundColor: isSelected ? "#10b981" : "transparent",
                color: isSelected ? "#ffffff" : "#166534",
                transition: "all 0.15s ease",
              }}
            >
              {opt.label}
            </button>
          );
        })}

        {/* Manuel Özel Ayar */}
        <button
          type="button"
          onClick={() => setShowCustomPanel(!showCustomPanel)}
          style={{
            flex: 1.1,
            padding: "6px 2px",
            borderRadius: "10px",
            border: "none",
            fontSize: "10.5px",
            fontWeight: "900",
            cursor: "pointer",
            backgroundColor: selectedPresetId === "custom" || showCustomPanel ? "#3b82f6" : "transparent",
            color: selectedPresetId === "custom" || showCustomPanel ? "#ffffff" : "#1e40af",
            transition: "all 0.15s ease",
          }}
        >
          Özel ⚙️
        </button>
      </div>

      {/* MANUEL DAKİKA + SANİYE AYARLAMA PANELİ */}
      {showCustomPanel && (
        <div
          style={{
            width: "100%",
            backgroundColor: "#eff6ff",
            border: "2px dashed #60a5fa",
            borderRadius: "16px",
            padding: "10px 12px",
            marginBottom: "8px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: "900", color: "#1e3a8a", textAlign: "center" }}>
            ⏱️ Dakika ve Hamle Başına Eklenecek Saniyeyi Seç:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {/* Beyaz Süresi */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff", padding: "6px", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#475569" }}>🦁 Beyaz (Dk)</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setCustomWhiteMinutes((m) => Math.max(1, m - 1))}
                  style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", backgroundColor: "#e2e8f0", fontWeight: "900", cursor: "pointer" }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customWhiteMinutes}
                  onChange={(e) => setCustomWhiteMinutes(parseInt(e.target.value) || 1)}
                  style={{ width: "34px", textAlign: "center", fontWeight: "900", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px" }}
                />
                <button
                  type="button"
                  onClick={() => setCustomWhiteMinutes((m) => m + 1)}
                  style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", backgroundColor: "#e2e8f0", fontWeight: "900", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Siyah Süresi */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff", padding: "6px", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#475569" }}>🐯 Siyah (Dk)</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setCustomBlackMinutes((m) => Math.max(1, m - 1))}
                  style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", backgroundColor: "#e2e8f0", fontWeight: "900", cursor: "pointer" }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customBlackMinutes}
                  onChange={(e) => setCustomBlackMinutes(parseInt(e.target.value) || 1)}
                  style={{ width: "34px", textAlign: "center", fontWeight: "900", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px" }}
                />
                <button
                  type="button"
                  onClick={() => setCustomBlackMinutes((m) => m + 1)}
                  style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", backgroundColor: "#e2e8f0", fontWeight: "900", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Hamle Başına Eklenecek Saniye (Increment) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff", padding: "6px 10px", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#1e3a8a" }}>➕ Hamle Başına Ekle:</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                type="button"
                onClick={() => setCustomIncrement((s) => Math.max(0, s - 1))}
                style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", backgroundColor: "#e2e8f0", fontWeight: "900", cursor: "pointer" }}
              >
                -
              </button>
              <span style={{ minWidth: "48px", textAlign: "center", fontWeight: "900", fontSize: "12px", color: "#047857" }}>
                +{customIncrement} sn
              </span>
              <button
                type="button"
                onClick={() => setCustomIncrement((s) => s + 1)}
                style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", backgroundColor: "#e2e8f0", fontWeight: "900", cursor: "pointer" }}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={manuelSureyiUygula}
            style={{
              padding: "7px 12px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: "900",
              fontSize: "11px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✅ Saat Ayarını Yükle ve Başla
          </button>
        </div>
      )}

      {/* SİYAH OYUNCU BİLGİ KARTI VE SAATİ */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: currentTurn === "b" ? "#fef08a" : "#f1f5f9",
          borderRadius: "16px",
          marginBottom: "8px",
          border: currentTurn === "b" ? "3px solid #eab308" : "1px solid #cbd5e1",
          boxSizing: "border-box",
          boxShadow: currentTurn === "b" ? "0 4px 10px rgba(234, 179, 8, 0.25)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "22px" }}>🐯</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "900", fontSize: "12px", color: "#0f172a" }}>
              2. Oyuncu (Siyah) {currentTurn === "b" && "👈"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
              {capturedByBlack.map((p, idx) => (
                <img key={idx} src={PIECE_IMAGES[`w${p.toUpperCase()}`]} alt={p} style={{ width: "16px", height: "16px" }} />
              ))}
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                ({blackScore} P)
              </span>
            </div>
          </div>
        </div>

        {hasTimer && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
            <div
              style={{
                padding: "4px 8px",
                backgroundColor: currentTurn === "b" ? (blackTime < 30 ? "#fee2e2" : "#dcfce7") : "#ffffff",
                color: blackTime < 30 ? "#dc2626" : "#0f172a",
                border: `2px solid ${currentTurn === "b" ? (blackTime < 30 ? "#ef4444" : "#22c55e") : "#cbd5e1"}`,
                borderRadius: "12px",
                fontWeight: "900",
                fontSize: "16px",
                fontFamily: "monospace",
                minWidth: "60px",
                textAlign: "center",
              }}
            >
              {formatTime(blackTime)}
            </div>
            {incrementSeconds > 0 && (
              <span style={{ fontSize: "9px", fontWeight: "800", color: "#047857" }}>
                +{incrementSeconds}sn
              </span>
            )}
          </div>
        )}
      </div>

      {/* DURUM MESAJI */}
      <div
        style={{
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "#dbeafe",
          borderRadius: "9999px",
          textAlign: "center",
          fontWeight: "900",
          fontSize: "12px",
          color: "#1e3a8a",
          marginBottom: "8px",
          minHeight: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          border: "2px solid #bfdbfe",
        }}
      >
        {isPaused ? "⏸️ OYUN DURAKLATILDI" : durumMesaji}
      </div>

      {/* SATRANÇ TAHTASI (352x352 px) */}
      <div
        style={{
          width: "352px",
          height: "352px",
          display: "grid",
          gridTemplateColumns: "repeat(8, 44px)",
          gridTemplateRows: "repeat(8, 44px)",
          borderRadius: "16px",
          overflow: "hidden",
          border: "4px solid #1e3a8a",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
          backgroundColor: "#1e3a8a",
          opacity: isPaused ? 0.6 : 1,
          pointerEvents: isPaused ? "none" : "auto",
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
                  backgroundColor: isSelected ? "#fde047" : isDark ? "#60a5fa" : "#eff6ff",
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
                      backgroundColor: "rgba(16, 185, 129, 0.7)",
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

      {/* BEYAZ OYUNCU BİLGİ KARTI VE SAATİ */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: currentTurn === "w" ? "#fef08a" : "#f1f5f9",
          borderRadius: "16px",
          marginTop: "8px",
          border: currentTurn === "w" ? "3px solid #eab308" : "1px solid #cbd5e1",
          boxSizing: "border-box",
          boxShadow: currentTurn === "w" ? "0 4px 10px rgba(234, 179, 8, 0.25)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "22px" }}>🦁</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "900", fontSize: "12px", color: "#0f172a" }}>
              1. Oyuncu (Beyaz) {currentTurn === "w" && "👈"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
              {capturedByWhite.map((p, idx) => (
                <img key={idx} src={PIECE_IMAGES[`b${p.toUpperCase()}`]} alt={p} style={{ width: "16px", height: "16px" }} />
              ))}
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                ({whiteScore} P)
              </span>
            </div>
          </div>
        </div>

        {hasTimer && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
            <div
              style={{
                padding: "4px 8px",
                backgroundColor: currentTurn === "w" ? (whiteTime < 30 ? "#fee2e2" : "#dcfce7") : "#ffffff",
                color: whiteTime < 30 ? "#dc2626" : "#0f172a",
                border: `2px solid ${currentTurn === "w" ? (whiteTime < 30 ? "#ef4444" : "#22c55e") : "#cbd5e1"}`,
                borderRadius: "12px",
                fontWeight: "900",
                fontSize: "16px",
                fontFamily: "monospace",
                minWidth: "60px",
                textAlign: "center",
              }}
            >
              {formatTime(whiteTime)}
            </div>
            {incrementSeconds > 0 && (
              <span style={{ fontSize: "9px", fontWeight: "800", color: "#047857" }}>
                +{incrementSeconds}sn
              </span>
            )}
          </div>
        )}
      </div>

      {/* YÖNETİM VE KONTROL BUTONLARI */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", width: "100%", marginTop: "12px", justifyContent: "center" }}>
        {hasTimer && isClockRunning && (
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            style={{
              padding: "8px 12px",
              backgroundColor: isPaused ? "#10b981" : "#f59e0b",
              color: "white",
              fontWeight: "900",
              borderRadius: "12px",
              border: "none",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            {isPaused ? "▶️ Devam Et" : "⏸️ Duraklat"}
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            padding: "8px 12px",
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: "800",
            borderRadius: "12px",
            border: "none",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          🔄 Çevir
        </button>

        <button
          type="button"
          onClick={() => setAutoFlip(!autoFlip)}
          style={{
            padding: "8px 12px",
            backgroundColor: autoFlip ? "#10b981" : "#e2e8f0",
            color: autoFlip ? "white" : "#475569",
            fontWeight: "800",
            borderRadius: "12px",
            border: "none",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          {autoFlip ? "✅ Otomatik Çevir" : "⭕ Sabit Tahta"}
        </button>

        <button
          type="button"
          onClick={hamleGeriAl}
          style={{
            padding: "8px 12px",
            backgroundColor: "#64748b",
            color: "white",
            fontWeight: "800",
            borderRadius: "12px",
            border: "none",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          ↩️ Geri Al
        </button>

        <button
          type="button"
          onClick={() => oyunuSifirla()}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ef4444",
            color: "white",
            fontWeight: "800",
            borderRadius: "12px",
            border: "none",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          Sıfırla 🔄
        </button>
      </div>
    </div>
  );
}
