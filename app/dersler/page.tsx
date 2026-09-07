"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InteraktifOrnek {
  id: number;
  karakter: string;
  karakterAdi: string;
  soruMetni: string;
  tahtaTipi: "baslangic" | "kaleYolu" | "filCapraz" | "atL" | "sahAdim" | "piyonIleri" | "matVurusu";
  okYonu?: "duz" | "capraz" | "lSekli" | "etraf";
  secenekler: { id: string; sembol: string; aciklama: string; dogru: boolean }[];
  dogruMesaj: string;
}

interface KazanimDetay {
  kod: string;
  uniteId: number;
  uniteBaslik: string;
  baslik: string;
  resmiAciklama: string;
  ornekler: InteraktifOrnek[];
}

const KAZANIMLAR_VERISI: KazanimDetay[] = [
  {
    kod: "1.1.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç oyununu ve tahtasını tanır.",
    resmiAciklama: "Satranç tahtasının kare şekli, yatay, dikey, çapraz hatları ve açık-koyu kareleri incelenir.",
    ornekler: [
      {
        id: 1,
        karakter: "🦁",
        karakterAdi: "Aslan Şakir",
        soruMetni: "Aslan Şakir tahtayı masaya koydu. Sağ alt köşedeki doğru karenin rengi hangisidir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⬛", aciklama: "Koyu Kare", dogru: false },
          { id: "b", sembol: "⬜", aciklama: "Açık (Beyaz) Kare", dogru: true },
          { id: "c", sembol: "🔺", aciklama: "Üçgen", dogru: false },
        ],
        dogruMesaj: "Harikasın! 'Beyaz sağda' kuralını tahtada başarıyla buldun!",
      },
      {
        id: 2,
        karakter: "🐰",
        karakterAdi: "Tavşan Pamuk",
        soruMetni: "Pamuk 64 karelik satranç tahtasının şeklini inceliyor. Tahtanın geometri şekli nedir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⚪", aciklama: "Daire", dogru: false },
          { id: "b", sembol: "⏹️", aciklama: "Kare Şekli", dogru: true },
          { id: "c", sembol: "⭐", aciklama: "Yıldız", dogru: false },
        ],
        dogruMesaj: "Süper! Satranç tahtası 64 eşit kareden oluşan dev bir karedir!",
      },
      {
        id: 3,
        karakter: "🦊",
        karakterAdi: "Dedektif Tilki",
        soruMetni: "Tahtanın köşesindeki ilk karede hangi renk zemin var?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⬜", aciklama: "Açık Renk", dogru: true },
          { id: "b", sembol: "🟨", aciklama: "Sarı", dogru: false },
          { id: "c", sembol: "🟦", aciklama: "Mavi", dogru: false },
        ],
        dogruMesaj: "İpuçlarını topladın! Köşeler her zaman açık renkle başlar.",
      },
    ],
  },
  {
    kod: "1.2.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri yatay ve dikey yönlerde hareket ettirir.",
    resmiAciklama: "Karelerden oluşan zeminde dikey (ileri-geri) ve yatay (yana) yön hareketleri yapılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🚗",
        karakterAdi: "Şimşek Araba",
        soruMetni: "Araba tahta üzerinde dikey caddede ileri sürülecek. Hangi ok yönünü göstermelidir?",
        tahtaTipi: "kaleYolu",
        okYonu: "duz",
        secenekler: [
          { id: "a", sembol: "⬆️", aciklama: "Dikey İleri Oku", dogru: true },
          { id: "b", sembol: "↗️", aciklama: "Çapraz Ok", dogru: false },
          { id: "c", sembol: "🔄", aciklama: "Dönemeç", dogru: false },
        ],
        dogruMesaj: "Vınnn! Dikey hat üzerinde ileriye doğru hareket ettin!",
      },
      {
        id: 2,
        karakter: "🐼",
        karakterAdi: "Panda Po",
        soruMetni: "Panda yatay (yana) yönde adım atıyor. Doğru yatay ok hangisidir?",
        tahtaTipi: "kaleYolu",
        okYonu: "duz",
        secenekler: [
          { id: "a", sembol: "➡️", aciklama: "Yatay Sağa Ok", dogru: true },
          { id: "b", sembol: "⬇️", aciklama: "Aşağı", dogru: false },
          { id: "c", sembol: "⚡", aciklama: "Şimşek", dogru: false },
        ],
        dogruMesaj: "Harika adımlar! Yatay yollarda sağa ve sola kayabilirsin!",
      },
      {
        id: 3,
        karakter: "🐻",
        karakterAdi: "Ayıcık Bobo",
        soruMetni: "Düz caddeler boyunca ilerleyen taşın takip ettiği hat ne ad alır?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "➕", aciklama: "Düz / Yatay-Dikey Hat", dogru: true },
          { id: "b", sembol: "✖️", aciklama: "Sadece Çapraz", dogru: false },
          { id: "c", sembol: "🕳️", aciklama: "Çukur", dogru: false },
        ],
        dogruMesaj: "Nefis! Düz hatlar yatay ve dikey yollardır.",
      },
    ],
  },
  {
    kod: "1.3.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri çapraz yönlerde hareket ettirir.",
    resmiAciklama: "Çapraz yön kavramı tahta üzerinde çizilen çizgilerle pekiştirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🚀",
        karakterAdi: "Roket Ali",
        soruMetni: "Tahtada iki köşe arasında X harfi gibi uzanan yönün adı nedir?",
        tahtaTipi: "filCapraz",
        okYonu: "capraz",
        secenekler: [
          { id: "a", sembol: "↗️", aciklama: "Çapraz Hat", dogru: true },
          { id: "b", sembol: "⬆️", aciklama: "Düz Hat", dogru: false },
          { id: "c", sembol: "⏹️", aciklama: "Kare", dogru: false },
        ],
        dogruMesaj: "Ateş! Çapraz patikada köşeden köşeye süzüldün!",
      },
      {
        id: 2,
        karakter: "🦜",
        karakterAdi: "Papağan Riki",
        soruMetni: "Çapraz hareket eden bir nesne tahtada hangi şekli çizer?",
        tahtaTipi: "filCapraz",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Çarpı (X) Şekli", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Artı Şekli", dogru: false },
          { id: "c", sembol: "⭕", aciklama: "Daire", dogru: false },
        ],
        dogruMesaj: "Riki çapraz patikadan uçarak tahtayı geçti!",
      },
      {
        id: 3,
        karakter: "🐱",
        karakterAdi: "Yavru Kedi Mırmır",
        soruMetni: "Çapraz yönlü ok işaretine tıklayarak kedinin yolunu göster!",
        tahtaTipi: "filCapraz",
        okYonu: "capraz",
        secenekler: [
          { id: "a", sembol: "↗️", aciklama: "Çapraz Ok", dogru: true },
          { id: "b", sembol: "➡️", aciklama: "Düz Ok", dogru: false },
          { id: "c", sembol: "⬇️", aciklama: "Aşağı Ok", dogru: false },
        ],
        dogruMesaj: "Miyav! Mırmır çapraz patikadan hedefine ulaştı!",
      },
    ],
  },
];

function SatrançTahtasiGorseli({ tip }: { tip: string }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "260px",
        margin: "12px auto",
        backgroundColor: "#292524",
        padding: "8px",
        borderRadius: "14px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", borderRadius: "8px" }}>
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const isWhite = (row + col) % 2 === 0;
            return (
              <rect
                key={`${row}-${col}`}
                x={col * 25}
                y={row * 25}
                width={25}
                height={25}
                fill={isWhite ? "#fef08a" : "#ca8a04"}
              />
            );
          })
        )}

        {tip === "baslangic" && (
          <>
            <text x="12" y="145" fontSize="16" textAnchor="middle">♖</text>
            <text x="100" y="105" fontSize="18" textAnchor="middle" fill="#dc2626">♔</text>
            <rect x="175" y="175" width="25" height="25" fill="#22c55e" opacity="0.7" />
            <text x="187" y="192" fontSize="12" textAnchor="middle" fill="#ffffff">✔</text>
          </>
        )}

        {tip === "kaleYolu" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♜</text>
            <line x1="100" y1="100" x2="100" y2="25" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="100" y2="175" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="25" y2="100" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="175" y2="100" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
          </>
        )}

        {tip === "filCapraz" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♝</text>
            <line x1="100" y1="100" x2="25" y2="25" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="175" y2="175" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="25" y2="175" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="175" y2="25" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
          </>
        )}

        {tip === "atL" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♞</text>
            <path d="M 100 100 L 100 50 L 125 50" stroke="#a855f7" strokeWidth="4" fill="none" />
            <circle cx="125" cy="50" r="6" fill="#22c55e" />
          </>
        )}

        {tip === "sahAdim" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♚</text>
            <circle cx="100" cy="80" r="4" fill="#ef4444" />
            <circle cx="120" cy="80" r="4" fill="#ef4444" />
            <circle cx="120" cy="100" r="4" fill="#ef4444" />
            <circle cx="100" cy="120" r="4" fill="#ef4444" />
            <circle cx="80" cy="120" r="4" fill="#ef4444" />
            <circle cx="80" cy="100" r="4" fill="#ef4444" />
          </>
        )}

        {tip === "piyonIleri" && (
          <>
            <text x="100" y="125" fontSize="18" textAnchor="middle">♟️</text>
            <line x1="100" y1="110" x2="100" y2="60" stroke="#eab308" strokeWidth="4" />
            <polygon points="100,50 95,65 105,65" fill="#eab308" />
          </>
        )}

        {tip === "matVurusu" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">👑</text>
            <text x="100" y="55" fontSize="16" textAnchor="middle" fill="#ef4444">💥</text>
            <rect x="87" y="37" width="25" height="25" fill="none" stroke="#ef4444" strokeWidth="3" />
          </>
        )}
      </svg>
      <div style={{ fontSize: "10px", color: "#a855f7", fontWeight: "bold", marginTop: "4px" }}>
        ♟️ İnteraktif Satranç Tahtası & Taktik Hattı
      </div>
    </div>
  );
}

export default function DerslerPage() {
  const [seciliKod, setSeciliKod] = useState<string>("1.1.");
  const [tamamlananKazanimlar, setTamamlananKazanimlar] = useState<string[]>([]);
  const [ornekCevaplari, setOrnekCevaplari] = useState<Record<number, string>>({});

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlKod = urlParams.get("kod");
      if (urlKod && KAZANIMLAR_VERISI.some((k) => k.kod === urlKod)) {
        setSeciliKod(urlKod);
      }
      const kayitli = localStorage.getItem("mebKazanımTakip");
      if (kayitli) setTamamlananKazanimlar(JSON.parse(kayitli));
    } catch {}
  }, []);

  const aktifKazanim =
    KAZANIMLAR_VERISI.find((k) => k.kod === seciliKod) || KAZANIMLAR_VERISI[0];

  function konus(metin: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Önceki konuşmayı durdur
      const ses = new SpeechSynthesisUtterance(metin);
      ses.lang = "tr-TR";
      ses.rate = 0.9; // Çocuklar için net ve sakin hız
      window.speechSynthesis.speak(ses);
    }
  }

  function handleKazanimDegistir(yeniKod: string) {
    setSeciliKod(yeniKod);
    setOrnekCevaplari({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCevapSec(ornekId: number, secenekId: string) {
    setOrnekCevaplari((onceki) => ({
      ...onceki,
      [ornekId]: secenekId,
    }));
  }

  function handleTamamlaToggle(kod: string) {
    let yeni: string[];
    if (tamamlananKazanimlar.includes(kod)) {
      yeni = tamamlananKazanimlar.filter((k) => k !== kod);
    } else {
      yeni = [...tamamlananKazanimlar, kod];
    }
    setTamamlananKazanimlar(yeni);
    try {
      localStorage.setItem("mebKazanımTakip", JSON.stringify(yeni));
    } catch {}
  }

  const mevcutIndex = KAZANIMLAR_VERISI.findIndex((k) => k.kod === aktifKazanim.kod);
  const oncekiKazanim = mevcutIndex > 0 ? KAZANIMLAR_VERISI[mevcutIndex - 1] : null;
  const sonrakiKazanim =
    mevcutIndex < KAZANIMLAR_VERISI.length - 1 ? KAZANIMLAR_VERISI[mevcutIndex + 1] : null;

  return (
    <div
      style={{
        maxWidth: "960px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #bae6fd",
        boxShadow: "0 10px 30px rgba(2, 132, 199, 0.1)",
        margin: "0 auto",
      }}
    >
      {/* 1. ÜST BAŞLIK VE AÇILIR LİSTE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          paddingBottom: "16px",
          borderBottom: "2px dashed #e2e8f0",
          marginBottom: "20px",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "900",
              marginBottom: "4px",
            }}
          >
            📚 {aktifKazanim.uniteBaslik}
          </span>
          <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            🎯 {aktifKazanim.kod} {aktifKazanim.baslik}
          </h1>
        </div>

        <select
          value={aktifKazanim.kod}
          onChange={(e) => handleKazanimDegistir(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            border: "2px solid #0284c7",
            backgroundColor: "#ffffff",
            color: "#0369a1",
            fontWeight: "bold",
            fontSize: "12px",
            cursor: "pointer",
            maxWidth: "280px",
          }}
        >
          {KAZANIMLAR_VERISI.map((k, index) => (
            <option key={k.kod} value={k.kod}>
              {index + 1}. {tamamlananKazanimlar.includes(k.kod) ? "✅ " : "⚪ "} {k.kod} {k.baslik}
            </option>
          ))}
        </select>
      </div>

      {/* 2. RESMİ KAZANIM AÇIKLAMASI */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "2px solid #e2e8f0",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", fontWeight: "900", color: "#0284c7", marginBottom: "4px" }}>
            📖 Resmi Kazanım Açıklaması:
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155", margin: 0 }}>
            {aktifKazanim.resmiAciklama}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleTamamlaToggle(aktifKazanim.kod)}
          style={{
            padding: "8px 16px",
            backgroundColor: tamamlananKazanimlar.includes(aktifKazanim.kod)
              ? "#16a34a"
              : "#0284c7",
            color: "#ffffff",
            borderRadius: "12px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {tamamlananKazanimlar.includes(aktifKazanim.kod)
            ? "✨ Kazanım Tamamlandı"
            : "⚪ Kazanımı Tamamla"}
        </button>
      </div>

      {/* 3. ÇİZGİ FİLM VE TAHTA ÜZERİNDE GÖRSEL ÖRNEKLER VE SESLENDİRME */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "28px" }}>♟️🗺️🔊</span>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#1e293b", margin: "4px 0" }}>
            Satranç Tahtası Üzerinde Örnek Görevler
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Soruları dinlemek için hoparlör (🔊) butonuna tıklayabilirsin!
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {aktifKazanim.ornekler.map((ornek, idx) => {
            const secilenSecenekId = ornekCevaplari[ornek.id];
            const secilenSecenek = ornek.secenekler.find((s) => s.id === secilenSecenekId);
            const dogruMu = secilenSecenek?.dogru === true;

            return (
              <div
                key={ornek.id}
                style={{
                  backgroundColor: "#fffdf9",
                  borderRadius: "18px",
                  border: "2px solid #fed7aa",
                  padding: "16px 20px",
                  boxShadow: "0 4px 12px rgba(251, 146, 60, 0.08)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "28px" }}>{ornek.karakter}</span>
                      <div style={{ fontSize: "12px", fontWeight: "900", color: "#c2410c" }}>
                        {idx + 1}. Görev: {ornek.karakterAdi}
                      </div>
                    </div>
                    {/* SESLENDİRME BUTONU */}
                    <button
                      type="button"
                      onClick={() => konus(`${ornek.karakterAdi} soruyor: ${ornek.soruMetni}`)}
                      style={{
                        padding: "6px 10px",
                        backgroundColor: "#fef3c7",
                        border: "1px solid #f59e0b",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#b45309",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      title="Soruyu Sesli Dinle"
                    >
                      🔊 Dinle
                    </button>
                  </div>

                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b", marginBottom: "12px" }}>
                    {ornek.soruMetni}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {ornek.secenekler.map((s) => {
                      const secili = secilenSecenekId === s.id;
                      let bgColor = "#ffffff";
                      let borderColor = "#cbd5e1";
                      if (secili) {
                        bgColor = s.dogru ? "#dcfce7" : "#fee2e2";
                        borderColor = s.dogru ? "#22c55e" : "#ef4444";
                      }

                      return (
                        <div key={s.id} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleCevapSec(ornek.id, s.id)}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              backgroundColor: bgColor,
                              border: `2px solid ${borderColor}`,
                              borderRadius: "10px",
                              cursor: "pointer",
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#334155",
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>{s.sembol}</span>
                            <span>{s.aciklama}</span>
                          </button>
                          {/* Şıkkı Seslendir */}
                          <button
                            type="button"
                            onClick={() => konus(s.aciklama)}
                            style={{
                              padding: "8px",
                              backgroundColor: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            title="Şıkkı Sesli Dinle"
                          >
                            🔊
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {secilenSecenekId && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        backgroundColor: dogruMu ? "#f0fdf4" : "#fef2f2",
                        border: dogruMu ? "1px solid #86efac" : "1px solid #fca5a5",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: dogruMu ? "#15803d" : "#b91c1c",
                      }}
                    >
                      {dogruMu ? `🎉 ${ornek.dogruMesaj}` : "❌ Yanlış! Tahta üzerindeki ipucunu tekrar incele."}
                    </div>
                  )}
                </div>

                <div>
                  <SatrançTahtasiGorseli tip={ornek.tahtaTipi} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ALT GEÇİŞLER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          paddingTop: "16px",
          borderTop: "2px dashed #e2e8f0",
        }}
      >
        {oncekiKazanim ? (
          <button
            type="button"
            onClick={() => handleKazanimDegistir(oncekiKazanim.kod)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#f1f5f9",
              color: "#334155",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontWeight: "bold",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            ⬅️ Önceki Kazanım
          </button>
        ) : (
          <div />
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            href="/masallar"
            style={{
              padding: "8px 14px",
              backgroundColor: "#ec4899",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "11px",
            }}
          >
            ✨ Masallara Git
          </Link>
          <Link
            href="/odev"
            style={{
              padding: "8px 14px",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "11px",
            }}
          >
            📚 Ödevlere Git
          </Link>
        </div>

        {sonrakiKazanim ? (
          <button
            type="button"
            onClick={() => handleKazanimDegistir(sonrakiKazanim.kod)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              borderRadius: "12px",
              border: "none",
              fontWeight: "bold",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Sonraki Kazanım ➡️
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
