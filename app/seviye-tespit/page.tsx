"use client";

import { useState } from "react";
import Link from "next/link";

interface Soru {
  id: number;
  soruMetni: string;
  ipucu: string;
  secenekler: { id: string; metin: string; dogru: boolean }[];
}

const SEVIYE_TESTI_SORULARI: Soru[] = [
  {
    id: 1,
    soruMetni: "Satranç tahtası önümüze konulurken sağ alt köşemizde hangi renk kare olmalıdır?",
    ipucu: "Temel tahta kurulum kuralı ('Beyaz sağda').",
    secenekler: [
      { id: "a", metin: "Koyu (Siyah) kare", dogru: false },
      { id: "b", metin: "Açık (Beyaz) kare", dogru: true },
      { id: "c", metin: "Fark etmez, herhangi bir kare olabilir", dogru: false },
    ],
  },
  {
    id: 2,
    soruMetni: "Satranç tahtasında diğer tüm taşların üzerinden atlayabilen tek özel taş hangisidir?",
    ipucu: "Harf çizen ve zıplayan sevimli taş.",
    secenekler: [
      { id: "a", metin: "Kale", dogru: false },
      { id: "b", metin: "Fil", dogru: false },
      { id: "c", metin: "At", dogru: true },
    ],
  },
  {
    id: 3,
    soruMetni: "Satrançta taşların puan değerlerine göre; Vezir kaç puan değerindedir?",
    ipucu: "Tahtanın en güçlü ve en yüksek puanlı taşıdır (9 puan).",
    secenekler: [
      { id: "a", metin: "1 Puan", dogru: false },
      { id: "b", metin: "3 Puan", dogru: false },
      { id: "c", metin: "9 Puan", dogru: true },
    ],
  },
  {
    id: 4,
    soruMetni: "Şah tehdit altında değilken, hamle sırası kendisinde olan oyuncunun yapabilecek hiçbir yasal hamlesi kalmamışsa bu duruma ne denir?",
    ipucu: "Oyun berabere biter.",
    secenekler: [
      { id: "a", metin: "Mat", dogru: false },
      { id: "b", metin: "Pat (Beraberlik)", dogru: true },
      { id: "c", metin: "Rok", dogru: false },
    ],
  },
  {
    id: 5,
    soruMetni: "Satrançta şahı güvenli köşeye alıp kaleyi oyuna sokan ortak özel hamleye ne denir?",
    ipucu: "Şah ile kalenin yer değiştirdiği özel dans.",
    secenekler: [
      { id: "a", metin: "Rok hamlesi", dogru: true },
      { id: "b", metin: "Çatal", dogru: false },
      { id: "c", metin: "Terfi", dogru: false },
    ],
  },
  {
    id: 6,
    soruMetni: "Satranç tahtasındaki en son yatay sıraya ulaşan piyon hangi özelliğe hak kazanır?",
    ipucu: "Vezir, kale, fil veya ata dönüşebilir.",
    secenekler: [
      { id: "a", metin: "Oyundan çıkar", dogru: false },
      { id: "b", metin: "Piyon Terfisi (Dönüşüm)", dogru: true },
      { id: "c", metin: "Geri döner", dogru: false },
    ],
  },
];

export default function SeviyeTespitPage() {
  const [aktifSoruIndex, setAktifSoruIndex] = useState(0);
  const [secilenCevaplar, setSecilenCevaplar] = useState<Record<number, string>>({});
  const [testBitti, setTestBitti] = useState(false);

  const soru = SEVIYE_TESTI_SORULARI[aktifSoruIndex];

  function handleCevapSec(secenekId: string) {
    setSecilenCevaplar({
      ...secilenCevaplar,
      [soru.id]: secenekId,
    });
  }

  function handleSonraki() {
    if (aktifSoruIndex < SEVIYE_TESTI_SORULARI.length - 1) {
      setAktifSoruIndex(aktifSoruIndex + 1);
    } else {
      setTestBitti(true);
    }
  }

  function handleOnceki() {
    if (aktifSoruIndex > 0) {
      setAktifSoruIndex(aktifSoruIndex - 1);
    }
  }

  function hesaplaSkor() {
    let dogruSayisi = 0;
    SEVIYE_TESTI_SORULARI.forEach((s) => {
      const verilenCevapId = secilenCevaplar[s.id];
      const dogruSecenek = s.secenekler.find((sec) => sec.dogru);
      if (verilenCevapId && dogruSecenek && verilenCevapId === dogruSecenek.id) {
        dogruSayisi++;
      }
    });
    return dogruSayisi;
  }

  const dogruPuan = hesaplaSkor();

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #10b981",
        boxShadow: "0 10px 30px rgba(16, 185, 129, 0.1)",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "40px" }}>🔍♟️</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#065f46", margin: "6px 0" }}>
          Satranç Seviye Tespit Sınavı
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Bilgilerini test et, satranç seviyeni ve eksiklerini hemen öğren!
        </p>
      </div>

      {!testBitti ? (
        <div>
          {/* İlerleme Çubuğu */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold", color: "#047857", marginBottom: "6px" }}>
            <span>Soru {aktifSoruIndex + 1} / {SEVIYE_TESTI_SORULARI.length}</span>
            <span>%{Math.round(((aktifSoruIndex + 1) / SEVIYE_TESTI_SORULARI.length) * 100)} Tamamlandı</span>
          </div>
          <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
            <div
              style={{
                width: `${((aktifSoruIndex + 1) / SEVIYE_TESTI_SORULARI.length) * 100}%`,
                height: "100%",
                backgroundColor: "#10b981",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Soru Kutusu */}
          <div style={{ backgroundColor: "#ecfdf5", padding: "18px", borderRadius: "16px", border: "2px solid #a7f3d0", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#047857", marginBottom: "6px" }}>
              💡 İpucu: {soru.ipucu}
            </div>
            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#064e3b", margin: "0 0 14px 0" }}>
              {soru.soruMetni}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {soru.secenekler.map((secenek) => {
                const secili = secilenCevaplar[soru.id] === secenek.id;
                return (
                  <button
                    key={secenek.id}
                    type="button"
                    onClick={() => handleCevapSec(secenek.id)}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: secili ? "2px solid #059669" : "1px solid #cbd5e1",
                      backgroundColor: secili ? "#d1fae5" : "#ffffff",
                      color: "#1e293b",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {secenek.id.toUpperCase()}) {secenek.metin}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alt İleri/Geri Butonları */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleOnceki}
              disabled={aktifSoruIndex === 0}
              style={{
                padding: "8px 16px",
                backgroundColor: aktifSoruIndex === 0 ? "#cbd5e1" : "#64748b",
                color: "#ffffff",
                borderRadius: "10px",
                border: "none",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: aktifSoruIndex === 0 ? "not-allowed" : "pointer",
              }}
            >
              ⬅️ Önceki Soru
            </button>

            <button
              type="button"
              onClick={handleSonraki}
              style={{
                padding: "8px 20px",
                backgroundColor: "#10b981",
                color: "#ffffff",
                borderRadius: "10px",
                border: "none",
                fontWeight: "900",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {aktifSoruIndex === SEVIYE_TESTI_SORULARI.length - 1 ? "Sınavı Bitir ve Sonucu Gör 🎯" : "Sonraki Soru ➡️"}
            </button>
          </div>
        </div>
      ) : (
        /* SONUÇ EKRANI */
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <span style={{ fontSize: "50px" }}>🏆🎉</span>
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#065f46", margin: "10px 0" }}>
            Tebrikler, Seviye Tespit Sınavını Tamamladın!
          </h2>
          <p style={{ fontSize: "14px", color: "#334155", margin: "0 0 20px 0" }}>
            Toplam {SEVIYE_TESTI_SORULARI.length} sorudan <strong style={{ color: "#059669" }}>{dogruPuan} doğru</strong> yaptın.
          </p>

          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "2px solid #10b981",
              borderRadius: "16px",
              padding: "16px",
              maxWidth: "450px",
              margin: "0 auto 20px auto",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#065f46", marginBottom: "6px" }}>
              🎓 Seviye Değerlendirmen:
            </div>
            <p style={{ fontSize: "12px", color: "#064e3b", margin: 0, lineHeight: "1.5" }}>
              {dogruPuan >= 5
                ? "Harika bir satranç bilgisine sahipsin! Temel ve taktik kuralları çok iyi kavramışsın. Ustalık derslerine geçebilirsin! 🌟"
                : dogruPuan >= 3
                ? "İyi bir başlangıç yaptın! Temel kuralları biliyorsun ancak birkaç konuyu 'Derslerim' sekmesinden tekrar etmen faydalı olacaktır. 👍"
                : "Satranç dünyasına yeni adım atıyorsun! '🎓 Derslerim' sekmesindeki başlangıç derslerini inceleyerek kısa sürede harika yol alabilirsin. ♟️"}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                setAktifSoruIndex(0);
                setSecilenCevaplar({});
                setTestBitti(false);
              }}
              style={{
                padding: "10px 18px",
                backgroundColor: "#64748b",
                color: "#ffffff",
                borderRadius: "12px",
                border: "none",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              🔄 Testi Tekrar Çöz
            </button>
            <Link
              href="/dersler"
              style={{
                padding: "10px 18px",
                backgroundColor: "#0284c7",
                color: "#ffffff",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "900",
                fontSize: "12px",
              }}
            >
              🎓 Eksikleri Kapatmak İçin Derslere Git
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
