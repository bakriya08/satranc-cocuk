"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BotOyunuPage() {
  const [botMesaji, setBotMesaji] = useState("Merhaba küçük şampiyon! Ben akıllı satranç botunum. Hadi benimle bir hamle yap ve yarışalım! ♟️");
  const [oyunDurumu, setOyunDurumu] = useState("Hamle sırası sende. İstediğin bir taşı ilerlet!");

  // Tarayıcı ses sentezi ile botu konuşturma fonksiyonu
  function botuKonustur(metin: string) {
    setBotMesaji(metin);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const ses = new SpeechSynthesisUtterance(metin);
      ses.lang = "tr-TR";
      ses.rate = 0.95; // Çocukların rahatça duyabileceği tempo
      window.speechSynthesis.speak(ses);
    }
  }

  // Oyuncu hamle yaptığında botun tepki vermesi
  function handleHamleYap(hamleTipi: "iyi" | "riskli" | "mat") {
    if (hamleTipi === "iyi") {
      botuKonustur("Harika bir hamle! Taşını mükemmel bir kareye yerleştirdin, böyle devam et! ⭐");
      setOyunDurumu("Süper ilerliyorsun! Rakip bot şimdi düşünüyor...");
    } else if (hamleTipi === "riskli") {
      botuKonustur("Dikkat et! O karede taşın tehlikede olabilir, korumayı unutma! 🚨");
      setOyunDurumu("Tehlikeli bir kareye oynadın, dikkatli olmalısın.");
    } else if (hamleTipi === "mat") {
      botuKonustur("Vay canına! Beni mat ettin, muazzam bir zeka zaferi kazandın! Tebrikler şampiyon! 🏆");
      setOyunDurumu("Oyun Bitti: Muhteşem bir zafer kazandın!");
    }
  }

  return (
    <div
      style={{
        maxWidth: "800px",
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
      <span style={{ fontSize: "45px" }}>🤖👑</span>
      <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#b45309", margin: "6px 0" }}>
        Akıllı Satranç Botu ile Oyna
      </h1>
      <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px 0" }}>
        Bot her hamlende seninle konuşur, iyi hamlelerini över, hatalarında seni uyarır!
      </p>

      {/* Bot Konuşma Balonu */}
      <div
        style={{
          backgroundColor: "#fffbeb",
          border: "2px solid #fde68a",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "36px" }}>🤖</span>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "900", color: "#d97706", marginBottom: "4px" }}>
            AKILLI BOTUN MESAJI:
          </div>
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#78350f", margin: 0, lineHeight: "1.5" }}>
            "{botMesaji}"
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", marginBottom: "12px" }}>
          Durum: {oyunDurumu}
        </div>

        {/* Simüle Edilmiş Hamle Butonları (Test Etmek İçin) */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleHamleYap("iyi")}
            style={{
              padding: "10px 16px",
              backgroundColor: "#22c55e",
              color: "#ffffff",
              borderRadius: "12px",
              border: "none",
              fontWeight: "900",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ⭐ İyi Hamle Yap
          </button>

          <button
            type="button"
            onClick={() => handleHamleYap("riskli")}
            style={{
              padding: "10px 16px",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              borderRadius: "12px",
              border: "none",
              fontWeight: "900",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ⚠️ Riskli / Hatalı Hamle Yap
          </button>

          <button
            type="button"
            onClick={() => handleHamleYap("mat")}
            style={{
              padding: "10px 16px",
              backgroundColor: "#8b5cf6",
              color: "#ffffff",
              borderRadius: "12px",
              border: "none",
              fontWeight: "900",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            🏆 Botu Mat Et!
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        <Link
          href="/dersler"
          style={{
            padding: "10px 16px",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          🎓 Derslere Git
        </Link>
        <Link
          href="/seviye-tespit"
          style={{
            padding: "10px 16px",
            backgroundColor: "#10b981",
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          🔍 Seviye Sınavı
        </Link>
      </div>
    </div>
  );
}
