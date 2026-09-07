"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ders {
  id: number;
  kademe: "baslangic" | "orta" | "ileri";
  baslik: string;
  ikon: string;
  sure: string;
  aciklama: string;
  ogrenilecekler: string[];
  ipuclari: string;
  miniSoru: {
    soru: string;
    secenekler: string[];
    dogruIndex: number;
  };
}

const DERSLER: Ders[] = [
  {
    id: 1,
    kademe: "baslangic",
    baslik: "1. Ders: Büyülü Satranç Tahtası & Taşların Dizilişi",
    ikon: "🗺️",
    sure: "10 Dk",
    aciklama: "Satranç tahtası 64 kareden oluşur (32 beyaz, 32 siyah). Tahtayı önümüze koyarken sağ alt köşede her zaman BEYAZ kare olmalıdır!",
    ogrenilecekler: [
      "Sağ alt köşe daima beyaz olmalı ('Beyaz sağda')",
      "Beyaz Vezir beyaz karede, Siyah Vezir siyah karede başlar ('Vezir elbisesinin rengini sever')",
      "Tüm piyonlar ikinci sırada bir kale duvarı gibi dizilir",
    ],
    ipuclari: "Taktik İpucu: Tahtayı kurarken önce köşelere Kaleleri, yanlarına Atları, onların yanına Filleri yerleştir!",
    miniSoru: {
      soru: "Sağ alt köşemizdeki kare hangi renkte olmalıdır?",
      secenekler: ["Siyah", "Beyaz", "Fark etmez"],
      dogruIndex: 1,
    },
  },
  {
    id: 2,
    kademe: "baslangic",
    baslik: "2. Ders: Zıplayan At ve Gizli L Kuralı",
    ikon: "🐴",
    sure: "12 Dk",
    aciklama: "At, satrançtaki diğer tüm taşların üzerinden atlayabilen tek özel taştır. Dans ederken 'L' harfi çizer: 2 kare düz, 1 kare yana!",
    ogrenilecekler: [
      "Taşların üzerinden hoplayıp geçebilir, önü tıkansa bile durmaz",
      "Beyaz kareden zıplayan At mutlaka siyah bir kareye iner",
      "Merkezdeki bir at aynı anda 8 farklı kareyi kontrol eder",
    ],
    ipuclari: "Taktik İpucu: 'Kenardaki at kederli attır!' Atlarını kenarlara değil, tahtanın ortasına doğru geliştir.",
    miniSoru: {
      soru: "Taşların üzerinden atlayabilen tek satranç taşı hangisidir?",
      secenekler: ["Fil", "Kale", "At"],
      dogruIndex: 2,
    },
  },
  {
    id: 3,
    kademe: "orta",
    baslik: "3. Ders: Çoban Matı ve f7 Zayıflığı",
    ikon: "🎯",
    sure: "15 Dk",
    aciklama: "Oyunun başında sadece Şah tarafından korunan tek bir zayıf kare vardır: Beyaz için f2, Siyah için f7 karesi! Vezir ve Fil bu kareye saldırarak 4 hamlede mat yapabilir.",
    ogrenilecekler: [
      "f7 karesinin neden zayıf olduğunu anlama",
      "Vezir ve Filin ortak hücum gücü",
      "Çoban matına karşı Atı f6'ya çıkarak veya g6 sürerek savunma yapma",
    ],
    ipuclari: "Taktik İpucu: Rakibin erken çıkan vezirine karşı hemen korkup piyonlarını dağıtma, sakin kalıp At veya Piyonla veziri tehdit et!",
    miniSoru: {
      soru: "Çoban matı hangi savunmasız kareye hücum edilerek yapılır?",
      secenekler: ["f7 karesi", "h8 karesi", "a1 karesi"],
      dogruIndex: 0,
    },
  },
  {
    id: 4,
    kademe: "orta",
    baslik: "4. Ders: Taktik Silahı: Çatal Hamlesi 🍴",
    ikon: "⚡",
    sure: "15 Dk",
    aciklama: "Tek bir taşın aynı anda rakibin iki ya da daha fazla değerli taşına birden saldırmasına 'Çatal' denir. Özellikle Atlar şah ve vezire çatal atarak maç kazandırır!",
    ogrenilecekler: [
      "At çatalı ile Şah ve Veziri aynı anda tehdit etme",
      "Piyon çatalı ile rakibin iki hafif taşını zor durumda bırakma",
      "Rakibin taşları aynı renkte hizalandığında çatal fırsatlarını arama",
    ],
    ipuclari: "Taktik İpucu: Rakip şah ve vezir aynı renkteki karelerde duruyorsa hemen gözlerin bir At arasın!",
    miniSoru: {
      soru: "Bir taşın aynı anda iki farklı taşa birden saldırmasına ne denir?",
      secenekler: ["Rok", "Çatal", "Pat"],
      dogruIndex: 1,
    },
  },
  {
    id: 5,
    kademe: "ileri",
    baslik: "5. Ders: Şahın Güvenliği ve Saray Dansı: Rok",
    ikon: "🏰",
    sure: "15 Dk",
    aciklama: "Şahı tahtanın tehlikeli merkezinden güvenli köşeye kaçıran ve aynı anda kaleyi oyuna sokan tek hamleye 'Rok' denir.",
    ogrenilecekler: [
      "Kısa Rok ve Uzun Rok farkı",
      "Şah veya Kale daha önce oynamışsa rok yapılamaz",
      "Şah tehdit altındayken (şah çekilmişken) rok atılamaz",
    ],
    ipuclari: "Taktik İpucu: Açılışta ilk 10 hamle içinde rok atarak şahını güvene al!",
    miniSoru: {
      soru: "Şah daha önce hareket etmişse rok yapabilir mi?",
      secenekler: ["Evet, yapabilir", "Hayır, rok hakkı kaybolur", "Sadece uzun rok yapabilir"],
      dogruIndex: 1,
    },
  },
  {
    id: 6,
    kademe: "ileri",
    baslik: "6. Ders: Koridor Matı (Arka Sıra Tuzağı)",
    ikon: "🚪",
    sure: "15 Dk",
    aciklama: "Rok atmış şahın önündeki piyonlar hareket etmediğinde, arkaya inen bir Kale veya Vezir şahı koridorda sıkıştırıp mat eder!",
    ogrenilecekler: [
      "Arka yatay zayıflığını fark etme",
      "Şah için 'Hava Deliği' açmanın önemi (h3 veya g3 sürmek)",
      "Ağır taşlarla son sırayı kontrol etme",
    ],
    ipuclari: "Taktik İpucu: Oyunun ortasında şahının nefes alabilmesi için kenardaki piyonunu 1 adım ileri sürerek bir 'hava deliği' aç!",
    miniSoru: {
      soru: "Koridor matından korunmak için şaha ne açılmalıdır?",
      secenekler: ["Büyük kapı", "Hava deliği (kaçış karesi)", "Kale hendeği"],
      dogruIndex: 1,
    },
  },
];

export default function DerslerPage() {
  const [seciliKademe, setSeciliKademe] = useState<"hepsi" | "baslangic" | "orta" | "ileri">("hepsi");
  const [aktifDers, setAktifDers] = useState<Ders>(DERSLER[0]);
  const [tamamlananDersler, setTamamlananDersler] = useState<number[]>([]);
  const [secilenCevap, setSecilenCevap] = useState<number | null>(null);
  const [cevapDurumu, setCevapDurumu] = useState<"bekliyor" | "dogru" | "yanlis">("bekliyor");

  useEffect(() => {
    try {
      const kayitli = localStorage.getItem("tamamlananDersler");
      if (kayitli) {
        setTamamlananDersler(JSON.parse(kayitli));
      }
    } catch {}
  }, []);

  function handleDersSec(d: Ders) {
    setAktifDers(d);
    setSecilenCevap(null);
    setCevapDurumu("bekliyor");
  }

  function handleDersTamamla(id: number) {
    let yeni: number[];
    if (tamamlananDersler.includes(id)) {
      yeni = tamamlananDersler.filter((x) => x !== id);
    } else {
      yeni = [...tamamlananDersler, id];
    }
    setTamamlananDersler(yeni);
    try {
      localStorage.setItem("tamamlananDersler", JSON.stringify(yeni));
    } catch {}
  }

  function handleCevapKontrol(idx: number) {
    setSecilenCevap(idx);
    if (idx === aktifDers.miniSoru.dogruIndex) {
      setCevapDurumu("dogru");
      if (!tamamlananDersler.includes(aktifDers.id)) {
        handleDersTamamla(aktifDers.id);
      }
    } else {
      setCevapDurumu("yanlis");
    }
  }

  const filtrelenenDersler = DERSLER.filter((d) =>
    seciliKademe === "hepsi" ? true : d.kademe === seciliKademe
  );

  const ilerlemeYuzdesi = Math.round((tamamlananDersler.length / DERSLER.length) * 100);

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
      {/* BAŞLIK & İLERLEME ÇUBUĞU */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "44px" }}>🎓♟️</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", margin: "6px 0" }}>
          Satranç Akademisi: Derslerim
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px 0" }}>
          Adım adım satranç ustası ol! Dersleri tamamla, rozetleri kap!
        </p>

        {/* İlerleme Göstergesi */}
        <div
          style={{
            maxWidth: "420px",
            margin: "0 auto",
            backgroundColor: "#f1f5f9",
            borderRadius: "16px",
            padding: "10px 16px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>
            <span style={{ color: "#0284c7" }}>Genel Akademi İlerlemen</span>
            <span style={{ color: "#0369a1" }}>%{ilerlemeYuzdesi} ({tamamlananDersler.length}/{DERSLER.length} Ders)</span>
          </div>
          <div style={{ width: "100%", height: "10px", backgroundColor: "#cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
            <div
              style={{
                width: `${ilerlemeYuzdesi}%`,
                height: "100%",
                backgroundColor: "#0284c7",
                borderRadius: "8px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* KADEME SEÇİCİ FİLTRELER */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setSeciliKademe("hepsi")}
          style={{
            padding: "6px 14px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: seciliKademe === "hepsi" ? "#0284c7" : "#f1f5f9",
            color: seciliKademe === "hepsi" ? "#ffffff" : "#475569",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🌟 Tüm Dersler
        </button>
        <button
          type="button"
          onClick={() => setSeciliKademe("baslangic")}
          style={{
            padding: "6px 14px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: seciliKademe === "baslangic" ? "#16a34a" : "#f1f5f9",
            color: seciliKademe === "baslangic" ? "#ffffff" : "#475569",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🟢 1. Kademe (Başlangıç)
        </button>
        <button
          type="button"
          onClick={() => setSeciliKademe("orta")}
          style={{
            padding: "6px 14px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: seciliKademe === "orta" ? "#f59e0b" : "#f1f5f9",
            color: seciliKademe === "orta" ? "#ffffff" : "#475569",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🟡 2. Kademe (Taktikler)
        </button>
        <button
          type="button"
          onClick={() => setSeciliKademe("ileri")}
          style={{
            padding: "6px 14px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: seciliKademe === "ileri" ? "#ef4444" : "#f1f5f9",
            color: seciliKademe === "ileri" ? "#ffffff" : "#475569",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔴 3. Kademe (Ustalık)
        </button>
      </div>

      {/* İKİ SÜTUNLU DÜZEN: SOL DERS LİSTESİ - SAĞ AKTİF DERS İÇERİĞİ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {/* SOL: DERS LİSTESİ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtrelenenDersler.map((d) => {
            const secili = aktifDers.id === d.id;
            const bitti = tamamlananDersler.includes(d.id);
            return (
              <div
                key={d.id}
                onClick={() => handleDersSec(d)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  backgroundColor: secili ? "#e0f2fe" : "#f8fafc",
                  borderRadius: "14px",
                  border: secili ? "2px solid #0284c7" : "1px solid #e2e8f0",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "24px" }}>{d.ikon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "900", color: "#1e293b" }}>
                      {d.baslik}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      ⏱️ {d.sure} • {d.kademe.toUpperCase()}
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: "18px" }}>
                  {bitti ? "✅" : "⚪"}
                </span>
              </div>
            );
          })}
        </div>

        {/* SAĞ: SEÇİLİ DERS DETAYI */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "20px",
            borderRadius: "18px",
            border: "2px solid #bae6fd",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#0369a1", margin: 0 }}>
              {aktifDers.ikon} {aktifDers.baslik}
            </h2>
            <button
              type="button"
              onClick={() => handleDersTamamla(aktifDers.id)}
              style={{
                padding: "6px 12px",
                backgroundColor: tamamlananDersler.includes(aktifDers.id) ? "#16a34a" : "#0284c7",
                color: "#ffffff",
                borderRadius: "10px",
                border: "none",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {tamamlananDersler.includes(aktifDers.id) ? "Tamamlandı ✨" : "Tamamla ⚪"}
            </button>
          </div>

          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155", marginBottom: "14px" }}>
            {aktifDers.aciklama}
          </p>

          <div style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid #e0f2fe", marginBottom: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: "900", color: "#0369a1", marginBottom: "6px" }}>
              📌 Bu Derste Neler Öğreneceğiz?
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
              {aktifDers.ogrenilecekler.map((madde, i) => (
                <li key={i}>{madde}</li>
              ))}
            </ul>
          </div>

          <div style={{ backgroundColor: "#fef3c7", padding: "10px 12px", borderRadius: "10px", border: "1px solid #fde68a", fontSize: "12px", color: "#92400e", fontWeight: "bold", marginBottom: "16px" }}>
            💡 {aktifDers.ipuclari}
          </div>

          {/* DERSİN MİNİ BİLGİ TESTİ */}
          <div style={{ backgroundColor: "#ffffff", padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
            <div style={{ fontSize: "12px", fontWeight: "900", color: "#1e293b", marginBottom: "8px" }}>
              ❓ Bilgi Testi: {aktifDers.miniSoru.soru}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {aktifDers.miniSoru.secenekler.map((secenek, idx) => {
                let bg = "#f8fafc";
                let text = "#334155";
                if (secilenCevap === idx) {
                  if (idx === aktifDers.miniSoru.dogruIndex) {
                    bg = "#dcfce7";
                    text = "#15803d";
                  } else {
                    bg = "#fee2e2";
                    text = "#b91c1c";
                  }
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCevapKontrol(idx)}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: bg,
                      color: text,
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}) {secenek}
                  </button>
                );
              })}
            </div>

            {cevapDurumu === "dogru" && (
              <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: "bold", color: "#16a34a" }}>
                🎉 Harika! Doğru cevap, ders otomatik tamamlandı.
              </div>
            )}
            {cevapDurumu === "yanlis" && (
              <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: "bold", color: "#dc2626" }}>
                ❌ Tekrar dene! İpucu yukarıdaki derste saklı.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ALT GEÇİŞ BUTONLARI */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "22px", flexWrap: "wrap" }}>
        <Link
          href="/odev"
          style={{
            padding: "10px 18px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "900",
            fontSize: "12px",
            boxShadow: "0 4px 10px rgba(239, 68, 68, 0.2)",
          }}
        >
          📚 Şimdi Haftalık Ödevime Geç
        </Link>
        <Link
          href="/masallar"
          style={{
            padding: "10px 18px",
            backgroundColor: "#ec4899",
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "900",
            fontSize: "12px",
            boxShadow: "0 4px 10px rgba(236, 72, 153, 0.2)",
          }}
        >
          ✨ Masallarla Eğlen
        </Link>
      </div>
    </div>
  );
}
