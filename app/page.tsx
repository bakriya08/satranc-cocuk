"use client";

import { useState } from "react";
import Link from "next/link";

export default function BotOyunuPage() {
  const [zorluk, setZorluk] = useState<"kolay" | "orta" | "zor">("kolay");
  const [botMesaji, setBotMesaji] = useState("Harika bir gün! Ben senin satranç koçun ve bot rakibinim. Hadi zorluk seviyeni seç ve oynamaya başlayalım! ♟️");
  const [oyunDurumu, setOyunDurumu] = useState("Hamle sırası sende. Akıllı hamleni seç!");

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

  function handleHamleYap(hamleTipi: "iyi" | "riskli" | "mat") {
    if (hamleTipi === "iyi") {
      if (zorluk === "kolay") {
        botuKonustur("Güzel hamle yaptın şampiyon! Kolay moddayız ama böyle gidersen beni yeneceksin! ⭐");
      } else if (zorluk === "orta") {
        botuKonustur("Harika bir buluş! Orta seviyede bu hamleyi beklemiyordum, çok akıllıca! 🌟");
      } else {
        botuKonustur("Zor modda ustaca bir hamle! Tahtayı çok iyi okuyorsun, tebrikler! 👑");
      }
      setOyunDurumu("Süper ilerliyorsun! Bot şimdi derinlemesine düşünüyor...");
    } else if (hamleTipi === "riskli") {
      botuKonustur("Dikkat et! O karede taşın açıkta kaldı, bot hemen avlayabilir! 🚨");
      setOyunDurumu("Riskli bir hamle yaptın, savunmayı unutma!");
    } else if (hamleTipi === "mat") {
      botuKonustur("İnanılmaz! Beni mat etmeyi başardın! Gerçek bir satranç dâhisisin şampiyon! 🏆");
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
      <span style={{ fontSize: "45px" }}>🤖♟️</span>
      <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#b45309", margin: "6px 0" }}>
        Akıllı Satranç Botu Arenası
      </h1>
      <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
        Zorluk seviyesini seç, botunla hamleleri yarıştır ve sesli koçluk eşliğinde oyna!
      </p>

      {/* Zorluk Seçim Butonları */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => { setZorluk("kolay"); botuKonustur("Kolay moda geçtik. Rahatça öğrenip eğlenebilirsin! 😊"); }}
          style={{
            padding: "8px 14px",
            backgroundColor: zorluk === "kolay" ? "#22c55e" : "#f1f5f9",
            color: zorluk === "kolay" ? "#ffffff" : "#334155",
            borderRadius: "10px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          🟢 Kolay Seviye
        </button>

        <button
          type="button"
          onClick={() => { setZorluk("orta"); botuKonustur("Orta seviyeye geçtik. Dikkatli olmalısın, bot artık daha akıllı! 🤔"); }}
          style={{
            padding: "8px 14px",
            backgroundColor: zorluk === "orta" ? "#f59e0b" : "#f1f5f9",
            color: zorluk === "orta" ? "#ffffff" : "#334155",
            borderRadius: "10px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          🟡 Orta Seviye
        </button>

        <button
          type="button"
          onClick={() => { setZorluk("zor"); botuKonustur("Zor moda geçtin! Burası ustaların yeridir, bol şans şampiyon! 👑"); }}
          style={{
            padding: "8px 14px",
            backgroundColor: zorluk === "zor" ? "#ef4444" : "#f1f5f9",
            color: zorluk === "zor" ? "#ffffff" : "#334155",
            borderRadius: "10px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          🔴 Zor Seviye (Usta)
        </button>
      </div>

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
            BOT KOÇ ({zorluk.toUpperCase()} MOD):
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

        {/* 3 Seçenekli Oynanabilir Hamle Butonları */}
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
            ⭐ İyi / Akıllı Hamle Yap
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
            🏆 Şah Mat Yap!
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
