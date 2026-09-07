"use client";

import Link from "next/link";

interface PieceInfo {
  name: string;
  points: string;
  avatar: string;
  image: string;
  colorBg: string;
  movement: string;
  superPower: string;
  tip: string;
}

const PIECES: PieceInfo[] = [
  {
    name: "Piyon (Cesur Asker)",
    points: "1 Puan",
    avatar: "♟️",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
    colorBg: "#fef3c7",
    movement: "İlk hamlesinde isterse 2 kare, sonrasında hep 1 kare ileri düz gider. Taşları ise 1 kare çapraz yer!",
    superPower: "Karşı tarafın en son karesine (8. sıraya) ulaşırsa Vezir, Kale, Fil veya At'a dönüşebilir! (Terfi)",
    tip: "Küçük görünür ama birlik olduklarında geçilmez bir kale duvarı oluştururlar!",
  },
  {
    name: "Kale (Güçlü Kule)",
    points: "5 Puan",
    avatar: "🏰",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
    colorBg: "#e0f2fe",
    movement: "İleri, geri, sağa ve sola düz çizgiler halinde istediği kadar kare gidebilir.",
    superPower: "Şahı korumak için onunla özel 'Rok' hamlesi yapabilir!",
    tip: "Açık dikey ve yatay hatları çok sever, oyunun sonlarında gücünü ikiye katlar.",
  },
  {
    name: "At (Zıp Zıp Süvari)",
    points: "3 Puan",
    avatar: "🐴",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
    colorBg: "#fce7f3",
    movement: "'L' harfi çizerek hareket eder: 2 kare düz + 1 kare yana gider.",
    superPower: "Satranç tahtasında diğer taşların üzerinden atlayabilen TEK taştır!",
    tip: "Tahtanın merkezinde durduğunda aynı anda 8 farklı kareyi kontrol edebilir.",
  },
  {
    name: "Fil (Çapraz Büyücü)",
    points: "3 Puan",
    avatar: "🧙‍♂️",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
    colorBg: "#dcfce7",
    movement: "Kendi rengindeki karelerde (Beyaz veya Siyah) sonsuz çapraz gidebilir.",
    superPower: "Uzak mesafelerden rakip taşları gizlice göz hapsine alır.",
    tip: "Beyaz karede başlayan fil ömrü boyunca hep beyaz karelerde seyahat eder!",
  },
  {
    name: "Vezir (Süper Kahraman)",
    points: "9 Puan",
    avatar: "👑",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
    colorBg: "#fef08a",
    movement: "Hem Kalenin hem Filin güçlerine sahiptir! Düz ve çapraz istediği kadar kare uçar.",
    superPower: "Tahtanın en güçlü ve en çevik taşıdır.",
    tip: "Çok güçlüdür ama erkenden tek başına oyuna sokup rakip taşların hedefine koymamalısın!",
  },
  {
    name: "Şah (Ordunun Lideri)",
    points: "Sonsuz (Oyunun Kalbi)",
    avatar: "🤴",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    colorBg: "#ffedd5",
    movement: "Her yöne (çapraz veya düz) sadece 1 adım gidebilir.",
    superPower: "Asla tahtadan alınamaz! Tehdit edildiğinde 'Şah' çekilir, kaçamazsa oyun biter.",
    tip: "Oyunun başında merkezde kalmamalı, rok yaparak köşede güvende tutulmalıdır.",
  },
];

export default function OgrenPage() {
  return (
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        paddingBottom: "40px",
      }}
    >
      <div style={{ textAlign: "center", marginTop: "8px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#78350f", margin: "0 0 4px 0" }}>
          🏰 Satranç Taşlarını Tanıyalım!
        </h1>
        <p style={{ fontSize: "13px", color: "#92400e", margin: 0, fontWeight: "600" }}>
          Her taşın kendine özel bir gücü ve hikayesi var. Hepsini keşfet!
        </p>
      </div>

      {/* Taş Kartları Listesi */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
        {PIECES.map((piece, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: piece.colorBg,
              borderRadius: "20px",
              padding: "16px",
              border: "3px solid #fde68a",
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={piece.image}
                  alt={piece.name}
                  style={{ width: "42px", height: "42px", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.15))" }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#1e293b" }}>
                    {piece.name}
                  </h3>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#d97706" }}>
                    ⭐ Değeri: {piece.points}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: "28px" }}>{piece.avatar}</span>
            </div>

            <div style={{ fontSize: "12px", color: "#334155", lineHeight: "1.5" }}>
              <strong>🚶 Nasıl Hareket Eder?</strong> {piece.movement}
            </div>

            <div style={{ fontSize: "12px", color: "#15803d", lineHeight: "1.5" }}>
              <strong>⚡ Özel Gücü:</strong> {piece.superPower}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#78350f",
                backgroundColor: "rgba(255,255,255,0.7)",
                padding: "6px 10px",
                borderRadius: "10px",
                fontStyle: "italic",
              }}
            >
              💡 <strong>Antrenör Notu:</strong> {piece.tip}
            </div>
          </div>
        ))}
      </div>

      {/* Sayfa Altı Buton */}
      <Link
        href="/"
        style={{
          marginTop: "10px",
          padding: "12px 28px",
          backgroundColor: "#f59e0b",
          color: "#ffffff",
          borderRadius: "16px",
          textDecoration: "none",
          fontWeight: "900",
          fontSize: "15px",
          boxShadow: "0 6px 14px rgba(245, 158, 11, 0.3)",
          textAlign: "center",
        }}
      >
        🎮 Hadi Şimdi Oyuna Dönüp Hamle Yap!
      </Link>
    </div>
  );
}
