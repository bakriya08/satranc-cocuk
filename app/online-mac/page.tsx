"use client";

import { useState } from "react";
import Link from "next/link";

export default function OnlineMacPage() {
  const [oyunModu, setOyunModu] = useState<"secim" | "arkadas" | "bot" | "lichess">("secim");

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #3b82f6",
        boxShadow: "0 10px 30px rgba(59, 130, 246, 0.1)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "40px" }}>⚔️♟️</span>
      <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#1e40af", margin: "6px 0" }}>
        Online Satranç Maç Arenası
      </h1>
      <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px 0" }}>
        İster arkadaşınla aynı ekranda kapış, ister Lichess altyapısıyla dünyayla maç yap!
      </p>

      {oyunModu === "secim" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "20px" }}>
          {/* Mod 1: Arkadaşınla Oyna */}
          <div
            onClick={() => setOyunModu("arkadas")}
            style={{
              backgroundColor: "#eff6ff",
              border: "2px solid #bfdbfe",
              borderRadius: "16px",
              padding: "20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "32px" }}>👥</span>
            <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#1e3a8a", margin: "10px 0 6px 0" }}>
              Aynı Masada 2 Kişi
            </h3>
            <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>
              Yanındaki arkadaşınla sırayla hamle yaparak hemen maç yap!
            </p>
          </div>

          {/* Mod 2: Lichess Entegrasyonu */}
          <div
            onClick={() => setOyunModu("lichess")}
            style={{
              backgroundColor: "#f8fafc",
              border: "2px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "32px" }}>🌐</span>
            <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: "10px 0 6px 0" }}>
              Lichess / Chess.com Dünyası
            </h3>
            <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>
              Dünya çapındaki oyuncularla eşleş veya Lichess masası kur!
            </p>
          </div>
        </div>
      )}

      {oyunModu === "arkadas" && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ backgroundColor: "#fef3c7", padding: "12px", borderRadius: "12px", marginBottom: "16px", fontSize: "13px", fontWeight: "bold", color: "#92400e" }}>
            👥 İki Kişilik Yerel Maç Modu Aktif! (Sırayla hamle yaparsınız)
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            <Link
              href="/arkadasinla-oyna"
              style={{
                padding: "10px 20px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "900",
                fontSize: "13px",
              }}
            >
              Tahtayı Aç ve Oyuna Başla 🚀
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOyunModu("secim")}
            style={{ padding: "8px 16px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
          >
            ⬅️ Geri Dön
          </button>
        </div>
      )}

      {oyunModu === "lichess" && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ backgroundColor: "#f1f5f9", padding: "16px", borderRadius: "16px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" }}>
              Lichess Açık Kaynak Oyun Altyapısı
            </h3>
            <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 14px 0" }}>
              Lichess.org üzerinden ister arkadaşına özel davet linki gönder, ister rastgele bir rakiple hemen maç yapmaya başla!
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <a
                href="https://lichess.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 18px",
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Lichess.org'da Hemen Maç Bul ♟️
              </a>
              <a
                href="https://www.chess.com/play/online"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 18px",
                  backgroundColor: "#7fa650",
                  color: "#ffffff",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Chess.com Online Oyna 🌍
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOyunModu("secim")}
            style={{ padding: "8px 16px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
          >
            ⬅️ Geri Dön
          </button>
        </div>
      )}
    </div>
  );
}
