"use client";

import { useState } from "react";
import { Chess } from "chess.js";

// Yüksek çözünürlüklü vektörel taş görselleri (SVG)
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

// Ses efektleri
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

export default function SatrancTahtasi() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleSquares, setPossibleSquares] = useState<string[]>([]);
  const [activeBot, setActiveBot] = useState<BotProfile>(BOTS[0]);
  const [durumMesaji, setDurumMesaji] = useState("Senin sıran! (Beyaz)");
  const [isBotThinking, setIsBotThinking] = useState(false);

  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);

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

  // Bot Karar Mekanizması
  function selectBotMove(currentGame: Chess, level: BotLevel) {
    const legalMoves = currentGame.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    // 1. SEVİYE: Kolay (Tavşan) -> Tamamen rastgele
    if (level === "easy") {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    // 2. SEVİYE: Orta (Tilki) -> Taş yiyebiliyorsa kesinlikle yer
    if (level === "medium") {
      const captureMoves = legalMoves.filter((m) => m.captured);
      if (captureMoves.length > 0) {
        // En değerli taşı yemeyi önceler
        captureMoves.sort(
          (a, b) =>
            (PIECE_VALUES[b.captured?.toLowerCase() || "p"] || 0) -
            (PIECE_VALUES[a.captured?.toLowerCase() || "p"] || 0)
        );
        return captureMoves[0];
      }
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    // 3. SEVİYE: Zor (Baykuş) -> Şah mat hamlesi arar, en değerli taşları toplar, şah çeker
    const checkmateMove = legalMoves.find((m) => {
      const c = new Chess(currentGame.fen());
      c.move(m);
      return c.isCheckmate();
    });
    if (checkmateMove) return checkmateMove;

    const captureMoves = legalMoves.filter((m) => m.captured);
    if (captureMoves.length > 0) {
      captureMoves.sort(
        (a, b) =>
          (PIECE_VALUES[b.captured?.toLowerCase() || "p"] || 0) -
          (PIECE_VALUES[a.captured?.toLowerCase() || "p"] || 0)
      );
      return captureMoves[0];
    }

    // Şah çekebilen hamleler varsa değerlendir
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

  function handleSquareClick(square: string) {
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
          setCapturedByWhite((prev) => [...prev, move.captured]);
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

        // Botun sırası
        setIsBotThinking(true);
        setDurumMesaji(`${activeBot.avatar} ${activeBot.name} düşünüyor...`);

        setTimeout(() => {
          const botCopy = new Chess(gameCopy.fen());
          const chosenMove = selectBotMove(botCopy, activeBot.id);

          if (chosenMove && !botCopy.isGameOver()) {
            botCopy.move(chosenMove);
            setGame(botCopy);

            if (chosenMove.captured) {
              setCapturedByBlack((prev) => [...prev, chosenMove.captured]);
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

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-amber-50 rounded-3xl shadow-2xl max-w-md w-full border-4 border-amber-300 select-none">
      {/* BOT SEÇİM SEKMELERİ */}
      <div className="w-full grid grid-cols-3 gap-2 mb-3">
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
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-400 border-amber-600 shadow-md scale-105"
                  : "bg-amber-100/70 border-amber-200 hover:bg-amber-200/80 opacity-75"
              }`}
            >
              <span className="text-2xl">{bot.avatar}</span>
              <span className="text-xs font-black text-amber-950 mt-0.5">{bot.name}</span>
              <span className="text-[10px] font-bold text-amber-800">({bot.title})</span>
            </button>
          );
        })}
      </div>

      {/* Durum Başlığı */}
      <div className="text-sm md:text-base font-black mb-3 text-amber-950 bg-amber-200 px-5 py-2 rounded-full shadow-sm text-center min-h-[44px] flex items-center justify-center w-full">
        {durumMesaji}
      </div>

      {/* RAKİP BİLGİ & YENİLEN TAŞLAR ŞERİDİ */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-amber-100/80 rounded-2xl mb-2 border border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{activeBot.avatar}</span>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xs text-amber-900">{activeBot.name}</span>
            <span className="text-[10px] text-amber-700 font-bold">{activeBot.title} Rakip</span>
          </div>
        </div>
        <div className="flex items-center gap-1 min-h-[26px] overflow-x-auto max-w-[180px]">
          {capturedByBlack.map((p, idx) => (
            <img
              key={idx}
              src={PIECE_IMAGES[`w${p.toUpperCase()}`]}
              alt={p}
              className="w-5 h-5 object-contain"
            />
          ))}
          {scoreDiff < 0 && (
            <span className="text-xs font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-md ml-1">
              +{Math.abs(scoreDiff)}
            </span>
          )}
        </div>
      </div>

      {/* 8x8 Satranç Tahtası */}
      <div className="grid grid-cols-8 grid-rows-8 w-[360px] h-[360px] rounded-2xl overflow-hidden border-4 border-amber-900 shadow-xl bg-amber-900">
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
                className={`w-full h-full flex items-center justify-center p-1 relative transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-amber-300 ring-4 ring-amber-400 z-10"
                    : isDark
                    ? "bg-[#b58863]"
                    : "bg-[#f0d9b5]"
                }`}
              >
                {pieceImgUrl && (
                  <img
                    src={pieceImgUrl}
                    alt={pieceKey || "piece"}
                    className="w-[85%] h-[85%] object-contain pointer-events-none drop-shadow-sm select-none z-10"
                    draggable={false}
                  />
                )}

                {isPossibleTarget && !piece && (
                  <div className="absolute w-3.5 h-3.5 rounded-full bg-emerald-600/70 pointer-events-none z-20 shadow-sm" />
                )}
                {isPossibleTarget && piece && (
                  <div className="absolute inset-1 rounded-full border-4 border-rose-500/80 pointer-events-none z-20 animate-pulse" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* OYUNCU (ÇOCUK) ŞERİDİ */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-amber-100/80 rounded-2xl mt-2 border border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦁</span>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xs text-amber-900">Sen (Beyaz)</span>
            <span className="text-[11px] font-black text-amber-600 flex items-center gap-0.5">
              ⭐ {whiteScore} Yıldız
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 min-h-[26px] overflow-x-auto max-w-[180px]">
          {capturedByWhite.map((p, idx) => (
            <img
              key={idx}
              src={PIECE_IMAGES[`b${p.toUpperCase()}`]}
              alt={p}
              className="w-5 h-5 object-contain"
            />
          ))}
          {scoreDiff > 0 && (
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md ml-1">
              +{scoreDiff}
            </span>
          )}
        </div>
      </div>

      {/* Yeniden Başlat Butonu */}
      <button
        type="button"
        onClick={() => oyunuSifirla()}
        className="mt-4 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95 text-base cursor-pointer flex items-center gap-2"
      >
        <span>Yeniden Başla</span>
        <span>🔄</span>
      </button>
    </div>
  );
}
