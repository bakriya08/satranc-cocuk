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

type BotLevel = "easy" | "medium" | "hard";

interface BotProfile {
  id: BotLevel;
  name: string;
  avatar: string;
  title: string;
}

const BOTS: BotProfile[] = [
  { id: "easy", name: "Tavşan Pamuk", avatar: "🐰", title: "Kolay" },
  { id: "medium", name: "Zeki Tilki", avatar: "🦊", title: "Orta" },
  { id: "hard", name: "Bilge Baykuş", avatar: "🦉", title: "Zor" },
];

// Tek hamlede mat bulmacaları (Beyaz oynar, tek hamlede mat yapar)
interface Puzzle {
  id: number;
  title: string;
  hint: string;
  fen: string;
  winningMove: { from: string; to: string };
}

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    title: "1. Görev: Çoban Matı Vurgunu 🎯",
    hint: "İpucu: Vezir f7 karesindeki zayıf piyona dikkat çekiyor!",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
    winningMove: { from: "f3", to: "f7" },
  },
  {
    id: 2,
    title: "2. Görev: Koridor Matı (Arka Sıra) 🏰",
    hint: "İpucu: Siyah şah kendi piyonlarının arkasında sıkıştı. Kaleyi son yataya indir!",
    fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1",
    winningMove: { from: "e1", to: "e8" },
  },
  {
    id: 3,
    title: "3. Görev: Vezir ve Fil İş Birliği 🤝",
    hint: "İpucu: Vezir filin korumasıyla h7 karesine dalış yapabilir mi?",
    fen: "r1b2rk1/ppp2ppp/2n5/3p4/7q/2B5/PPP1QPPP/2KR1B1R w - - 0 1",
    winningMove: { from: "e2", to: "e8" },
  },
  {
    id: 4,
    title: "4. Görev: Akıllı At Matı 🐴",
    hint: "İpucu: At f7 karesine zıplayarak şaha kaçış yolu bırakmıyor!",
    fen: "6k1/5ppp/8/8/5N2/8/8/6K1 w - - 0 1",
    winningMove: { from: "f4", to: "e7" },
  },
  {
    id: 5,
    title: "5. Görev: İki Kale Merdiven Matı 🪜",
    hint: "İpucu: Birinci kale kaçışı kesti, ikinci kale son darbeyi vuruyor!",
    fen: "7k/R7/8/8/8/8/1R6/6K1 w - - 0 1",
    winningMove: { from: "b2", to: "b8" },
  },
];

export default function SatrancTahtasi() {
  const [activeTab, setActiveTab] = useState<"bot" | "puzzle">("bot");

  // Bot Modu Durumları
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleSquares, setPossibleSquares] = useState<string[]>([]);
  const [activeBot, setActiveBot] = useState<BotProfile>(BOTS[0]);
  const [durumMesaji, setDurumMesaji] = useState("Senin sıran! (Beyaz)");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);

  // Bulmaca Modu Durumları
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const currentPuzzle = PUZZLES[currentPuzzleIdx];
  const [puzzleGame, setPuzzleGame] = useState(new Chess(currentPuzzle.fen));
  const [puzzleDurum, setPuzzleDurum] = useState("Beyaz oynar, tek hamlede mat yapar!");
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [puzzleStars, setPuzzleStars] = useState(0);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  function sesCal(tur: "move" | "capture" | "check" | "gameEnd") {
    try {
      const audio = new Audio(SOUNDS[tur]);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch {}
  }

  const whiteScore = capturedByWhite.reduce((acc, p) => acc + (PIECE_VALUES[p.toLowerCase()] || 0), 0);
  const blackScore = capturedByBlack.reduce((acc, p) => acc + (PIECE_VALUES[p.toLowerCase()] || 0), 0);
  const scoreDiff = whiteScore - blackScore;

  function selectBotMove(currentGame: Chess, level: BotLevel) {
    const legalMoves = currentGame.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    if (level === "easy") {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    if (level === "medium") {
      const captureMoves = legalMoves.filter((m) => Boolean(m.captured));
      if (captureMoves.length > 0) {
        captureMoves.sort(
          (a, b) =>
            (PIECE_VALUES[String(b.captured).toLowerCase()] || 0) -
            (PIECE_VALUES[String(a.captured).toLowerCase()] || 0)
        );
        return captureMoves[0];
      }
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    const checkmateMove = legalMoves.find((m) => {
      const c = new Chess(currentGame.fen());
      c.move(m);
      return c.isCheckmate();
    });
    if (checkmateMove) return checkmateMove;

    const captureMoves = legalMoves.filter((m) => Boolean(m.captured));
    if (captureMoves.length > 0) {
      captureMoves.sort(
        (a, b) =>
          (PIECE_VALUES[String(b.captured).toLowerCase()] || 0) -
          (PIECE_VALUES[String(a.captured).toLowerCase()] || 0)
      );
      return captureMoves[0];
    }

    const checkMoves = legalMoves.filter((m) => {
      const c = new Chess(currentGame.fen());
      c.move(m);
      return c.inCheck();
    });
    if (checkMoves.length > 0) {
      return checkMoves[Math.floor(Math.random() * checkMoves.length)];
    }

    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // BOT MODU HAMLE YÖNETİMİ
  function handleSquareClickBot(square: string) {
    if (isBotThinking || game.isGameOver()) return;

    if (!selectedSquare) {
      const piece = game.get(square as any);
      if (piece && piece.color === "w") {
        setSelectedSquare(square);
        const legalMoves = game.moves({ square: square as any, verbose: true });
        setPossibleSquares(legalMoves.map((m) => m.to));
        setDurumMesaji(`Seçildi: ${square.toUpperCase()} ➔ Hedefe tıkla!`);
      } else {
        setDurumMesaji("Lütfen kendi (beyaz) taşlarından birini seç!");
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
          setCapturedByWhite((prev) => [...prev, String(move.captured)]);
          sesCal("capture");
        } else if (gameCopy.inCheck()) {
          sesCal("check");
        } else {
          sesCal("move");
        }

        if (gameCopy.isGameOver()) {
          sesCal("gameEnd");
          if (gameCopy.isCheckmate()) {
            setDurumMesaji(`🎉 Tebrikler! ${activeBot.name}'ı Şah Mat yaptın! 🏆`);
          } else {
            setDurumMesaji("Oyun berabere bitti! 🤝");
          }
          return;
        }

        setIsBotThinking(true);
        setDurumMesaji(`${activeBot.avatar} ${activeBot.name} düşünüyor...`);

        setTimeout(() => {
          const botCopy = new Chess(gameCopy.fen());
          const chosenMove = selectBotMove(botCopy, activeBot.id);

          if (chosenMove && !botCopy.isGameOver()) {
            botCopy.move(chosenMove);
            setGame(botCopy);

            if (chosenMove.captured) {
              setCapturedByBlack((prev) => [...prev, String(chosenMove.captured)]);
              sesCal("capture");
            } else if (botCopy.inCheck()) {
              sesCal("check");
            } else {
              sesCal("move");
            }

            if (botCopy.isGameOver()) {
              sesCal("gameEnd");
              if (botCopy.isCheckmate()) {
                setDurumMesaji(`${activeBot.avatar} ${activeBot.name} kazandı! Tekrar dene!`);
              } else {
                setDurumMesaji("Oyun berabere bitti!");
              }
            } else {
              const sah = botCopy.inCheck() ? " (Şah çekildi! ⚠️)" : "";
              setDurumMesaji(`Senin sıran! (Beyaz)${sah}`);
            }
          }
          setIsBotThinking(false);
        }, 600);
      } else {
        const piece = game.get(square as any);
        if (piece && piece.color === "w") {
          setSelectedSquare(square);
          const legalMoves = game.moves({ square: square as any, verbose: true });
          setPossibleSquares(legalMoves.map((m) => m.to));
          setDurumMesaji(`Seçildi: ${square.toUpperCase()} ➔ Hedefe tıkla!`);
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

  // BULMACA MODU HAMLE YÖNETİMİ
  function handleSquareClickPuzzle(square: string) {
    if (isPuzzleSolved) return;

    if (!selectedSquare) {
      const piece = puzzleGame.get(square as any);
      if (piece && piece.color === "w") {
        setSelectedSquare(square);
        const legalMoves = puzzleGame.moves({ square: square as any, verbose: true });
        setPossibleSquares(legalMoves.map((m) => m.to));
        setPuzzleDurum(`Seçildi: ${square.toUpperCase()} ➔ Mat hamleni yap!`);
      }
      return;
    }

    try {
      const puzzleCopy = new Chess(puzzleGame.fen());
      const move = puzzleCopy.move({
        from: selectedSquare,
        to: square,
        promotion: "q",
      });

      if (move) {
        if (puzzleCopy.isCheckmate()) {
          // Doğru tek hamlede mat!
          setPuzzleGame(puzzleCopy);
          setSelectedSquare(null);
          setPossibleSquares([]);
          setIsPuzzleSolved(true);
          setPuzzleStars((s) => s + 1);
          sesCal("gameEnd");
          setPuzzleDurum("🌟 TEBRİKLER! Şah Mat yaptın! +1 Yıldız kazandın! 🏆");
        } else {
          // Hamle geçerli ama mat değil
          setSelectedSquare(null);
          setPossibleSquares([]);
          setPuzzleDurum("❌ Bu hamle güzel ama mat yapmadı! Tekrar dene.");
          sesCal("move");
        }
      } else {
        setSelectedSquare(null);
        setPossibleSquares([]);
      }
    } catch {
      setSelectedSquare(null);
      setPossibleSquares([]);
      setPuzzleDurum("Geçersiz hamle! Tekrar dene.");
    }
  }

  function bulmacaDegistir(index: number) {
    const nextP = PUZZLES[index];
    setCurrentPuzzleIdx(index);
    setPuzzleGame(new Chess(nextP.fen));
    setSelectedSquare(null);
    setPossibleSquares([]);
    setIsPuzzleSolved(false);
    setPuzzleDurum("Beyaz oynar, tek hamlede mat yapar!");
  }

  function oyunuSifirla(yeniBot?: BotProfile) {
    const seciliBot = yeniBot || activeBot;
    setGame(new Chess());
    setSelectedSquare(null);
    setPossibleSquares([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setIsBotThinking(false);
    setDurumMesaji(`Yeni oyun! Rakibin ${seciliBot.name}. Hamleni yap!`);
  }

  const currentGame = activeTab === "bot" ? game : puzzleGame;
  const currentClickHandler = activeTab === "bot" ? handleSquareClickBot : handleSquareClickPuzzle;

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
        border: "4px solid #fcd34d",
        boxSizing: "border-box",
        userSelect: "none",
        margin: "0 auto",
      }}
    >
      {/* Sekme Butonları: Oyun vs Bulmaca */}
      <div
        style={{
          display: "flex",
          width: "100%",
          backgroundColor: "#fef3c7",
          borderRadius: "16px",
          padding: "4px",
          gap: "6px",
          marginBottom: "14px",
          border: "2px solid #fde68a",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab("bot");
            setSelectedSquare(null);
            setPossibleSquares([]);
          }}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "12px",
            fontWeight: "900",
            fontSize: "13px",
            border: "none",
            cursor: "pointer",
            backgroundColor: activeTab === "bot" ? "#f59e0b" : "transparent",
            color: activeTab === "bot" ? "#ffffff" : "#78350f",
            transition: "all 0.15s ease",
          }}
        >
          🎮 Bot ile Oyna
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("puzzle");
            setSelectedSquare(null);
            setPossibleSquares([]);
            bulmacaDegistir(currentPuzzleIdx);
          }}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "12px",
            fontWeight: "900",
            fontSize: "13px",
            border: "none",
            cursor: "pointer",
            backgroundColor: activeTab === "puzzle" ? "#10b981" : "transparent",
            color: activeTab === "puzzle" ? "#ffffff" : "#78350f",
            transition: "all 0.15s ease",
          }}
        >
          🧩 Mat Bulmacaları
        </button>
      </div>

      {/* BOT MODU BAŞLIĞI */}
      {activeTab === "bot" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", width: "100%", marginBottom: "10px" }}>
            {BOTS.map((bot) => {
              const isActive = activeBot.id === bot.id;
              return (
                <button
                  key={bot.id}
                  type="button"
                  onClick={() => {
                    if (isActive) return;
                    setActiveBot(bot);
                    oyunuSifirla(bot);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 4px",
                    borderRadius: "16px",
                    border: isActive ? "2px solid #d97706" : "2px solid #fde68a",
                    backgroundColor: isActive ? "#fbbf24" : "#fef3c7",
                    cursor: "pointer",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "22px" }}>{bot.avatar}</span>
                  <span style={{ fontSize: "11px", fontWeight: "900", color: "#451a03", marginTop: "2px" }}>{bot.name}</span>
                  <span style={{ fontSize: "10px", fontWeight: "bold", color: "#92400e" }}>({bot.title})</span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "#fde68a",
              borderRadius: "9999px",
              textAlign: "center",
              fontWeight: "900",
              fontSize: "13px",
              color: "#451a03",
              marginBottom: "10px",
              minHeight: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {durumMesaji}
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 12px",
              backgroundColor: "#fef3c7",
              borderRadius: "14px",
              marginBottom: "8px",
              border: "1px solid #fde68a",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>{activeBot.avatar}</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "800", fontSize: "11px", color: "#78350f" }}>{activeBot.name}</span>
                <span style={{ fontSize: "9px", color: "#b45309", fontWeight: "bold" }}>{activeBot.title}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {capturedByBlack.map((p, idx) => (
                <img key={idx} src={PIECE_IMAGES[`w${p.toUpperCase()}`]} alt={p} style={{ width: "18px", height: "18px" }} />
              ))}
              {scoreDiff < 0 && (
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#be123c", backgroundColor: "#ffe4e6", padding: "1px 5px", borderRadius: "5px" }}>
                  +{Math.abs(scoreDiff)}
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* BULMACA MODU BAŞLIĞI */}
      {activeTab === "puzzle" && (
        <div style={{ width: "100%", marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#78350f" }}>{currentPuzzle.title}</span>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#d97706" }}>⭐ {puzzleStars} Yıldız</span>
          </div>

          <div
            style={{
              width: "100%",
              padding: "8px 10px",
              backgroundColor: isPuzzleSolved ? "#dcfce7" : "#ecfdf5",
              borderRadius: "14px",
              textAlign: "center",
              fontWeight: "800",
              fontSize: "12px",
              color: isPuzzleSolved ? "#15803d" : "#047857",
              marginBottom: "6px",
              border: isPuzzleSolved ? "2px solid #22c55e" : "1px solid #a7f3d0",
              boxSizing: "border-box",
            }}
          >
            {puzzleDurum}
          </div>

          <div style={{ fontSize: "10px", color: "#92400e", textAlign: "center", fontStyle: "italic", marginBottom: "4px" }}>
            {currentPuzzle.hint}
          </div>
        </div>
      )}

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
          border: "4px solid #78350f",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
          backgroundColor: "#78350f",
        }}
      >
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${rank}`;
            const piece = currentGame.get(square as any);
            const isDark = (rankIndex + fileIndex) % 2 === 1;
            const isSelected = selectedSquare === square;
            const isPossibleTarget = possibleSquares.includes(square);

            const pieceKey = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;
            const pieceImgUrl = pieceKey ? PIECE_IMAGES[pieceKey] : null;

            return (
              <button
                key={square}
                type="button"
                onClick={() => currentClickHandler(square)}
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

      {/* ALT ALAN: BOT OYUNCU BİLGİSİ YA DA BULMACA KONTROLLERİ */}
      {activeTab === "bot" ? (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 12px",
              backgroundColor: "#fef3c7",
              borderRadius: "14px",
              marginTop: "8px",
              border: "1px solid #fde68a",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🦁</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "800", fontSize: "11px", color: "#78350f" }}>Sen (Beyaz)</span>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#d97706" }}>⭐ {whiteScore} Yıldız</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {capturedByWhite.map((p, idx) => (
                <img key={idx} src={PIECE_IMAGES[`b${p.toUpperCase()}`]} alt={p} style={{ width: "18px", height: "18px" }} />
              ))}
              {scoreDiff > 0 && (
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#047857", backgroundColor: "#d1fae5", padding: "1px 5px", borderRadius: "5px" }}>
                  +{scoreDiff}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => oyunuSifirla()}
            style={{
              marginTop: "12px",
              padding: "8px 20px",
              backgroundColor: "#10b981",
              color: "white",
              fontWeight: "900",
              borderRadius: "14px",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          >
            Yeniden Başla 🔄
          </button>
        </>
      ) : (
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", width: "100%", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => bulmacaDegistir((currentPuzzleIdx - 1 + PUZZLES.length) % PUZZLES.length)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#fef3c7",
              color: "#78350f",
              fontWeight: "800",
              borderRadius: "12px",
              border: "1px solid #fde68a",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ◀ Önceki Soru
          </button>

          <button
            type="button"
            onClick={() => bulmacaDegistir(currentPuzzleIdx)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#fde68a",
              color: "#78350f",
              fontWeight: "800",
              borderRadius: "12px",
              border: "none",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Sıfırla 🔄
          </button>

          <button
            type="button"
            onClick={() => bulmacaDegistir((currentPuzzleIdx + 1) % PUZZLES.length)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#10b981",
              color: "white",
              fontWeight: "800",
              borderRadius: "12px",
              border: "none",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Sonraki Soru ▶
          </button>
        </div>
      )}
    </div>
  );
}
