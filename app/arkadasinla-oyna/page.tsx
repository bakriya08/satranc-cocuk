"use client";

import { useState } from "react";
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

export default function ArkadasinlaOynaPage() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleSquares, setPossibleSquares] = useState<string[]>([]);
  const [durumMesaji, setDurumMesaji] = useState("Sıra Beyaz Oyuncuda! (🦁)");
  const [isFlipped, setIsFlipped] = useState(false); // Tahtayı 180 derece ters çevirme
  const [autoFlip, setAutoFlip] = useState(false); // Her hamlede otomatik dönsün mü?
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);

  const defaultFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const defaultRanks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  // Tahta ters çevrilmişse sıralamayı tersine alıyoruz
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

  const whiteScore = capturedByWhite.reduce((acc, p) => acc + (PIECE_VALUES[p.toLowerCase()] || 0), 0);
  const blackScore = capturedByBlack.reduce((acc, p) => acc + (PIECE_VALUES[p.toLowerCase()] || 0), 0);

  function handleSquareClick(square: string) {
    if (game.isGameOver()) return;

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

        // Eğer otomatik döndürme açıksa tahtayı çevir
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

  function oyunuSifirla() {
    setGame(new Chess());
    setSelectedSquare(null);
    setPossibleSquares([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setIsFlipped(false);
    setDurumMesaji("Yeni oyun başladı! Sıra Beyaz Oyuncuda (🦁)");
  }

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
          👥 İki Kişilik Arkadaş Modu
        </h2>
        <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "bold" }}>
          Aynı ekranda yan yana veya karşılıklı oynayın!
        </span>
      </div>

      {/* SİYAH OYUNCU BİLGİ KARTI */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          backgroundColor: currentTurn === "b" ? "#fef08a" : "#f1f5f9",
          borderRadius: "14px",
          marginBottom: "8px",
          border: currentTurn === "b" ? "2px solid #eab308" : "1px solid #cbd5e1",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🐯</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "900", fontSize: "12px", color: "#0f172a" }}>
              2. Oyuncu (Siyah) {currentTurn === "b" && "👈 Hamle Sırası"}
            </span>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "bold" }}>
              ⭐ {blackScore} Puan
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {capturedByBlack.map((p, idx) => (
            <img key={idx} src={PIECE_IMAGES[`w${p.toUpperCase()}`]} alt={p} style={{ width: "18px", height: "18px" }} />
          ))}
        </div>
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
          fontSize: "13px",
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
        {durumMesaji}
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

      {/* BEYAZ OYUNCU BİLGİ KARTI */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          backgroundColor: currentTurn === "w" ? "#fef08a" : "#f1f5f9",
          borderRadius: "14px",
          marginTop: "8px",
          border: currentTurn === "w" ? "2px solid #eab308" : "1px solid #cbd5e1",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🦁</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "900", fontSize: "12px", color: "#0f172a" }}>
              1. Oyuncu (Beyaz) {currentTurn === "w" && "👈 Hamle Sırası"}
            </span>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "bold" }}>
              ⭐ {whiteScore} Puan
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {capturedByWhite.map((p, idx) => (
            <img key={idx} src={PIECE_IMAGES[`b${p.toUpperCase()}`]} alt={p} style={{ width: "18px", height: "18px" }} />
          ))}
        </div>
      </div>

      {/* KONTROL VE YÖNETİM BUTONLARI */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", width: "100%", marginTop: "12px", justifyContent: "center" }}>
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
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          🔄 Tahtayı Çevir
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
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {autoFlip ? "✅ Otomatik Dönüş: Açık" : "⭕ Otomatik Dönüş: Kapalı"}
        </button>

        <button
          type="button"
          onClick={hamleGeriAl}
          style={{
            padding: "8px 12px",
            backgroundColor: "#f59e0b",
            color: "white",
            fontWeight: "800",
            borderRadius: "12px",
            border: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ↩️ Hamle Geri Al
        </button>

        <button
          type="button"
          onClick={oyunuSifirla}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ef4444",
            color: "white",
            fontWeight: "800",
            borderRadius: "12px",
            border: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Yeni Oyun 🔄
        </button>
      </div>
    </div>
  );
}
