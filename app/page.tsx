"use client";

import { useState } from "react";
import Link from "next/link";

export default function BotOyunuPage() {
  const [zorluk, setZorluk] = useState<"kolay" | "orta" | "zor">("kolay");
  const [botMesaji, setBotMesaji] = useState("Harika bir gün! Ben senin akıllı satranç botu rakibinim. Beyaz taşlarla maça başlayabilirsin, hamleni bekliyorum! ♟️");
  const [oyunDurumu, setOyunDurumu] = useState("Sıra Sende (Beyaz Taşlar)");

  // Başlangıç satranç tahtası matrisi (8x8)
  const [tahta, setTahta] = useState<string[][]>([
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ]);

  const [secilenKare, setSecilenKare] = useState<[number, number] | null>(null);
  const [oyuncuSirasi, setOyuncuSirasi] = useState(true); // true: Kullanıcı (Beyaz), false: Bot (Siyah)

  function botuKonustur(metin: string) {
    setBotMesaji(metin);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const ses = new SpeechSynthesisUtterance(metin);
      ses.lang = "tr-TR";
      ses.rate = 0.95;
      window.speechSynthesis.speak(ses);
    }
  }

  // Tahtadaki kareye tıklama mantığı
  function handleKareTikla(r: number, c: number) {
    if (!oyuncuSirasi) return; // Botun sırasıyken hamle yapılamaz

    const tiklananTas = tahta[r][c];

    // Eğer daha önce taş seçilmediyse ve kendi taşına (Büyük harf - Beyaz) tıkladıysa
    if (secilenKare === null) {
      if (tiklananTas !== "." && tiklananTas === tiklananTas.toUpperCase()) {
        setSecilenKare([r, c]);
        botuKonustur("Güzel bir taş seçtin, nereye sürmek istersin?");
      }
    } else {
      // Hedef kareye taşı taşı
      const [sr, sc] = secilenKare;
      const yeniTahta = tahta.map(row => [...row]);
      
      // Taşı taşı ve eski yerini boşalt
      yeniTahta[r][c] = yeniTahta[sr][sc];
      yeniTahta[sr][sc] = ".";

      setTahta(yeniTahta);
      setSecilenKare(null);
      setOyuncuSirasi(false);
      setOyunDurumu("Bot düşünüyor... 🤔");
      botuKonustur("Harika bir hamle! Şimdi sıra bende, tahtayı inceliyorum.");

      // 1 saniye sonra botun hamle yapması
      setTimeout(() => {
        botHamlesiYap(yeniTahta);
      }, 1200);
    }
  }

  // Botun mantıklı karşılık verme hamlesi
  function botHamlesiYap(mevcutTahta: string[][]) {
    const yeniTahta = mevcutTahta.map(row => [...row]);
    let hamleYapildi = false;

    // Siyah piyonları veya taşları bulup bir adım ileri sürme mantığı
    for (let r = 7; r >= 0 && !hamleYapildi; r--) {
      for (let c = 0; c < 8 && !hamleYapildi; c++) {
        if (yeniTahta[r][c] === "p") { // Siyah piyon
          if (r < 7 && yeniTahta[r + 1][c] === ".") {
            yeniTahta[r + 1][c] = "p";
            yeniTahta[r][c] = ".";
            hamleYapildi = true;
          }
        } else if (yeniTahta[r][c] === "n") { // Siyah at
          if (r < 6 && c < 6 && yeniTahta[r + 2][c + 1] === ".") {
            yeniTahta[r + 2][c + 1] = "n";
            yeniTahta[r][c] = ".";
            hamleYapildi = true;
          }
        }
      }
    }

    setTahta(yeniTahta);
    setOyuncuSirasi(true);
    setOyunDurumu("Sıra Sende (Beyaz Taşlar)");

    if (zorluk === "kolay") {
      botuKonustur("Piyonumu sürdüm! Bakalım şimdi nasıl bir plan yapacaksın şampiyon? 😊");
    } else if (zorluk === "orta") {
      botuKonustur("Orta modda savunmamı güçlendirdim, dikkatli olmalısın! 🤔");
    } else {
      botuKonustur("Zor modda ustaca bir hamle yaptım! Seni zorlayacağım! 🔥");
    }
  }

  // Taş kodlarını görsel satranç sembollerine dönüştürme
  function tasGoster(kod: string) {
    const taslar: Record<string, string> = {
      R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
      r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟"
    };
    return taslar[kod] || "";
  }

  return (
    <div
      style={{
        maxWidth: "680px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #f59e0b",
        boxShadow: "0 10px 30px rgba(245, 158, 11, 0.1)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "40px" }}>🤖♟️</span>
      <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#b45309", margin: "4px 0" }}>
        Akıllı Satranç Botu Arenası
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px 0" }}>
        Tahtadaki beyaz taşlara tıklayıp hamle yap, bot anında hamle yaparak seninle karşılıklı oynasın!
      </p>

      {/* Zorluk Seviyesi Seçimi */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => { setZorluk("kolay"); botuKonustur("Kolay moda geçtik. Eğlenerek öğrenebilirsin! 😊"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "kolay" ? "#22c55e" : "#f1f5f9", color: zorluk === "kolay" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🟢 Kolay
        </button>
        <button
          type="button"
          onClick={() => { setZorluk("orta"); botuKonustur("Orta moda geçtik. Dikkatli olmalısın! 🤔"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "orta" ? "#f59e0b" : "#f1f5f9", color: zorluk === "orta" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🟡 Orta
        </button>
        <button
          type="button"
          onClick={() => { setZorluk("zor"); botuKonustur("Zor moda geçtik! Ustaların savaşı başlasın! 👑"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "zor" ? "#ef4444" : "#f1f5f9", color: zorluk === "zor" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🔴 Zor (Usta)
        </button>
      </div>

      {/* Bot Konuşma Balonu */}
      <div
        style={{
          backgroundColor: "#fffbeb",
          border: "2px solid #fde68a",
          borderRadius: "14px",
          padding: "12px",
          marginBottom: "14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "28px" }}>🤖</span>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "900", color: "#d97706" }}>BOT KOÇ ({zorluk.toUpperCase()}):</div>
          <p style={{ fontSize: "12px", fontWeight: "bold", color: "#78350f", margin: 0 }}>
            "{botMesaji}"
          </p>
        </div>
      </div>

      <div style={{ fontSize: "13px", fontWeight: "900", color: "#b45309", marginBottom: "10px" }}>
        Durum: {oyunDurumu}
      </div>

      {/* İNTERAKTİF SATRANÇ TAHTASI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          width: "340px",
          height: "340px",
          margin: "0 auto 16px auto",
          border: "4px solid #78350f",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        {tahta.map((satir, r) =>
          satir.map((tas, c) => {
            const beyazKare = (r + c) % 2 === 0;
            const secili = secilenKare && secilenKare[0] === r && secilenKare[1] === c;
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleKareTikla(r, c)}
                style={{
                  backgroundColor: secili ? "#93c5fd" : beyazKare ? "#fef08a" : "#ca8a04",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {tasGoster(tas)}
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Link
          href="/dersler"
          style={{ padding: "8px 14px", backgroundColor: "#0284c7", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}
        >
          🎓 Derslere Git
        </Link>
        <Link
          href="/seviye-tespit"
          style={{ padding: "8px 14px", backgroundColor: "#10b981", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}
        >
          🔍 Seviye Sınavı
        </Link>
      </div>
    </div>
  );
}
