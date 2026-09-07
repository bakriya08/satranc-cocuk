"use client";

import { useState, useEffect } from "react";
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

interface SoruItem {
  id: number;
  title: string;
  fen: string;
  hint: string;
}

export default function OdevPage() {
  const [sorular, setSorular] = useState<SoruItem[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [ogrenciAdi, setOgrenciAdi] = useState("");
  const [sinifGrup, setSinifGrup] = useState("");
  const [avatar, setAvatar] = useState("🦁");
  const [odevBasladi, setOdevBasladi] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [game, setGame] = useState<Chess>(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleSquares, setPossibleSquares] = useState<string[]>([]);
  const [durumMesaji, setDurumMesaji] = useState("Beyaz oynar, tek hamlede mat yapar!");
  
  const [soruHatalari, setSoruHatalari] = useState<Record<number, number>>({});
  const [baslamaZamani, setBaslamaZamani] = useState<number>(0);
  const [tamamlandi, setTamamlandi] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  useEffect(() => {
    // 1. Tarayıcıda kayıtlı öğrenci profilini ara
    try {
      const kayitli = localStorage.getItem("satranc_ogrenci");
      if (kayitli) {
        const parsed = JSON.parse(kayitli);
        setOgrenciAdi(parsed.adSoyad || "");
        setSinifGrup(parsed.sinifGrup || "");
        setAvatar(parsed.avatar || "🦁");
      }
    } catch {}

    // 2. Soruları çek
    fetch("/api/odev?type=sorular")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data.length > 0) {
          setSorular(res.data);
          setGame(new Chess(res.data[0].fen));
        }
        setYukleniyor(false);
      })
      .catch(() => setYukleniyor(false));
  }, []);

  function sesCal(tur: "move" | "capture" | "gameEnd") {
    try {
      const audio = new Audio(SOUNDS[tur]);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch {}
  }

  const currentSoru = sorular[currentIdx];

  function handleSquareClick(square: string) {
    if (tamamlandi || !currentSoru) return;

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

          if (currentIdx + 1 < sorular.length) {
            setDurumMesaji("🌟 Harika! Sıradaki soruya geçiliyor...");
            setTimeout(() => {
              const nextIdx = currentIdx + 1;
              setCurrentIdx(nextIdx);
              setGame(new Chess(sorular[nextIdx].fen));
              setDurumMesaji("Beyaz oynar, tek hamlede mat yapar!");
            }, 1500);
          } else {
            setTamamlandi(true);
            odeviGonder();
          }
        } else {
          setSelectedSquare(null);
          setPossibleSquares([]);
          setSoruHatalari((prev) => ({
            ...prev,
            [currentSoru.id]: (prev[currentSoru.id] || 0) + 1,
          }));
          setDurumMesaji("❌ Bu hamle mat yapmadı! Tekrar dene.");
          sesCal("move");
        }
      } else {
        setSelectedSquare(null);
        setPossibleSquares([]);
      }
    } catch {
      setSelectedSquare(null);
      setPossibleSquares([]);
      setSoruHatalari((prev) => ({
        ...prev,
        [currentSoru.id]: (prev[currentSoru.id] || 0) + 1,
      }));
      setDurumMesaji("Geçersiz hamle! Tekrar dene.");
    }
  }

  async function odeviGonder() {
    setKaydediliyor(true);
    const gecenSure = Math.round((Date.now() - baslamaZamani) / 1000);
    const toplamHata = Object.values(soruHatalari).reduce((a, b) => a + b, 0);

    const soruDetaylari = sorular.map((s) => ({
      soruId: s.id,
      soruBaslik: s.title,
      hataliDeneme: soruHatalari[s.id] || 0,
    }));

    try {
      await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ogrenciAdi,
          sinifGrup,
          avatar,
          toplamSoru: sorular.length,
          dogruSayisi: sorular.length,
          toplamHata,
          gecenSureSaniye: gecenSure,
          soruDetaylari,
        }),
      });
    } catch {}
    setKaydediliyor(false);
  }

  if (yukleniyor) {
    return <div style={{ textAlign: "center", padding: "40px", fontWeight: "900", color: "#78350f" }}>Ödev Yükleniyor... ⏳</div>;
  }

  // 1. GİRİŞ EKRANI
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
        <span style={{ fontSize: "50px" }}>{avatar}</span>
        <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#78350f", margin: "8px 0 4px 0" }}>
          Haftalık Satranç Görevi
        </h1>

        {ogrenciAdi ? (
          <div style={{ backgroundColor: "#fef3c7", padding: "10px", borderRadius: "14px", marginBottom: "14px" }}>
            <span style={{ fontSize: "11px", color: "#92400e", fontWeight: "bold" }}>Giriş Yapılan Profil:</span>
            <div style={{ fontSize: "16px", fontWeight: "900", color: "#451a03" }}>
              {avatar} {ogrenciAdi}
            </div>
            {sinifGrup && <span style={{ fontSize: "11px", color: "#b45309" }}>({sinifGrup})</span>}
          </div>
        ) : (
          <div style={{ marginBottom: "14px" }}>
            <input
              type="text"
              placeholder="Adın ve Soyadın"
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
                marginBottom: "8px",
              }}
            />
            <Link href="/kayit" style={{ fontSize: "11px", color: "#2563eb", fontWeight: "800", textDecoration: "none" }}>
              ✨ Henüz kayıt olmadın mı? Kulüp Kartı Oluştur ➔
            </Link>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (ogrenciAdi.trim().length > 1) {
              setOdevBasladi(true);
              setBaslamaZamani(Date.now());
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

  // 3. BİTİŞ EKRANI
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
        <span style={{ fontSize: "56px" }}>🏆</span>
        <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#1e293b", margin: "8px 0" }}>
          Harikasın, {ogrenciAdi}!
        </h2>
        <p style={{ fontSize: "13px", color: "#047857", fontWeight: "bold", margin: "0 0 16px 0" }}>
          Tüm ödev sorularını başarıyla çözdün!
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
          {kaydediliyor ? "Sonuç öğretmenine iletiliyor... ⏳" : "✅ Ödevin öğretmeninin kontrol paneline ulaştı!"}
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

  // 2. TAHTA
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
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "900", color: "#78350f" }}>
          {avatar} {ogrenciAdi}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "900", color: "#d97706" }}>
          Soru: {currentIdx + 1} / {sorular.length}
        </span>
      </div>

      <div style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b", marginBottom: "4px", textAlign: "center" }}>
        {currentSoru.title}
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
          marginBottom: "6px",
          minHeight: "34px",
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
