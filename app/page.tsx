"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Başlangıç tahtası pozisyonu (Fen-Forsyth Notation)
const BASLANGIC_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default function BotOyunuPage() {
  const [zorluk, setZorluk] = useState<"kolay" | "orta" | "zor">("kolay");
  const [botMesaji, setBotMesaji] = useState("Merhaba şampiyon! Ben akıllı satranç botunum. Beyaz taşlarla maça başlayabilirsin, hamleni bekliyorum! ♟️");
  const [oyunDurumu, setOyunDurumu] = useState("Sıra Sende (Beyaz Taşlar)");
  
  // Basit tahta matrisi (8x8)
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
  const [oyuncuSirasi, setOyuncuSirasi] = useState(true); // true: Beyaz (Kullanıcı), false: Siyah (Bot)

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

  // Kareye tıklama ve hamle yapma mantığı
  function handleKareTikla(r: number, c: number) {
    if (!oyuncuSirasi) return; // Botun sırasıyken hamle yapılamaz

    const tiklananTas = tahta[r][c];

    // Eğer kendi taşına tıkladıysa seç
    if (secilenKare === null) {
      if (tiklananTas !== "." && tiklananTas === tiklananTas.toUpperCase()) {
        setSecilenKare([r, c]);
        botuKonustur("Güzel bir taş seçtin, nereye sürmek istersin?");
      }
    } else {
      // Hedef kareye taşı taşı (Basit hamle simülasyonu)
      const [sr, sc] = secilenKare;
      const yeniTahta = tahta.map(row => [...row]);
      yeniTahta[r][c] = yeniTahta[sr][sc];
      yeniTahta[sr][sc] = ".";

      setTahta(yeniTahta);
      setSecilenKare(null);
      setOyuncuSirasi(false);
      setOyunDurumu("Bot düşünüyor... 🤔");
      botuKonustur("Hmm, ilginç bir hamle. Şimdi sıra bende, bakalım ne yapacağım!");

      // Botun Karşılık Vermesi (1 saniye sonra)
      setTimeout(() => {
        bot Hamlesi Yap(yeniTahta);
      }, 1200);
    }
  }

  function bot Hamlesi Yap(mevcutTahta: string[][]) {
    // Bot mantıklı bir rastgele veya kolay/orta/zor hamle yapar
    const yeniTahta = mevcutTahta.map(row => [...row]);
    
    // Örnek basit siyah hamlesi bulma
    let hamleYapildi = false;
    for (let r = 0; r < 8 && !hamleYapildi; r++) {
      for (let c = 0; c < 8 && !hamleYapildi; c++) {
        if (yeniTahta[r][c] === "p") { // Siyah piyon bulursa bir alt kareye sürer
          if (r < 7 && yeniTahta[r + 1][c] === ".") {
            yeniTahta[r + 1][c] = "p";
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
      botuKonustur("Piyonumu ileri sürdüm! Bakalım şimdi ne yapacaksın şampiyon? 😊");
    } else if (zorluk === "orta") {
      botuKonustur("Orta moddayım, taşlarımı güçlü karelere yerleştiriyorum! 🤔");
    } else {
      botuKonustur("Zor modda hata yapma lüksün yok, sıkı tutun! 🔥");
    }
  }

  // Taş sembollerini görselleştirme
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
        maxWidth: "650px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "24px",
        border: "3px solid #f59e0b",
        boxShadow: "0 10px 30px rgba(245, 158, 11, 0.1)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "35px" }}>🤖♟️</span>
      <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#b45309", margin: "4px 0" }}>
        Karşılıklı Satranç Botu Arenası
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px 0" }}>
        Tahtadaki taşlara tıklayarak botla karşılıklı maç yap, hamlelerine anında sesli yanıt al!
      </p>

      {/* Zorluk Seçimi */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "14px" }}>
        <button
          type="button"
          onClick={() => { setZorluk("kolay"); botuKonustur("Kolay moda geçtik!"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "kolay" ? "#22c55e" : "#f1f5f9", color: zorluk === "kolay" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🟢 Kolay
        </button>
        <button
          type="button"
          onClick={() => { setZorluk("orta"); botuKonustur("Orta moda geçtik!"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "orta" ? "#f59e0b" : "#f1f5f9", color: zorluk === "orta" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🟡 Orta
        </button>
        <button
          type="button"
          onClick={() => { setZorluk("zor"); botuKonustur("Zor moda geçtik!"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "zor" ? "#ef4444" : "#f1f5f9", color: zorluk === "zor" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🔴 Zor
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

      <div style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", marginBottom: "8px" }}>
        {oyunDurumu}
      </div>

      {/* SATRANÇ TAHTASI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          width: "320px",
          height: "320px",
          margin: "0 auto 16px auto",
          border: "4px solid #78350f",
          borderRadius: "8px",
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
                  fontSize: "28px",
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
}﻿
