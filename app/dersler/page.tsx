"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MebDers {
  id: number;
  mebKodu: string;
  oyunAlani: string;
  baslik: string;
  ikon: string;
  dersSaati: string;
  aciklama: string;
  kazanimlar: string[];
  etkinlikOnerisi: string;
  miniSoru: {
    soru: string;
    secenekler: string[];
    dogruIndex: number;
  };
}

const MEB_DERSLER: MebDers[] = [
  {
    id: 1,
    mebKodu: "ST.OÖ. 1",
    oyunAlani: "1. Alan: Tahta ve Yönler",
    baslik: "1. Büyülü Satranç Ülkesi, Tahtası ve Yönler",
    ikon: "🗺️",
    dersSaati: "5 Ders Saati",
    aciklama: "Satranç tahtasının kare şekli, yatay, dikey ve çapraz yönler tanıtılır. Zemin üzerindeki açık ve koyu kareler ile kenar-köşe kavramları fark ettirilir.",
    kazanimlar: [
      "Satranç oyununu ve tahtasını tanır (ST.OÖ. 1.1)",
      "Zemindeki açık ve koyu renkli kareleri fark eder",
      "Nesneleri yatay, dikey ve çapraz yönlerde hareket ettirir (ST.OÖ. 1.2 - 1.3)",
      "Yatay ve dikey hizalamada sekize kadar sayma çalışmaları yapar"
    ],
    etkinlikOnerisi: "Beden Eğitimi & Drama: Çocuklar sınıf zemininde oluşturulan dev karelerde kendileri birer nesne gibi ileri, geri ve çapraz adımlarla yürür.",
    miniSoru: {
      soru: "Satranç tahtası önümüze konulurken sağ alt köşede hangi renk kare olmalıdır?",
      secenekler: ["Koyu (Siyah) Kare", "Açık (Beyaz) Kare", "Fark etmez"],
      dogruIndex: 1
    }
  },
  {
    id: 2,
    mebKodu: "ST.OÖ. 2",
    oyunAlani: "2. Alan: Taşlar ve Özellikleri",
    baslik: "2. Taşların Gizemli Dünyası ve Başlangıç Dizilişi",
    ikon: "🏰",
    dersSaati: "8 Ders Saati",
    aciklama: "Tüm taşların (Kale, Fil, Vezir, Şah, At, Piyon) yürüyüş şekilleri, puan değerleri, doğru taş alma ve başlangıç konumuna dizilişi öğrenilir.",
    kazanimlar: [
      "Kale, Fil, Vezir, Şah, At ve Piyonun hareketlerini uygular (ST.OÖ. 2.1 - 2.6)",
      "Son sıraya ulaşan piyonun terfi kuralını açıklar (ST.OÖ. 2.7)",
      "Taşları başlangıç konumuna doğru dizer (Beyaz sağda, vezir kendi renginde) (ST.OÖ. 2.8)",
      "Taşların puan değerlerini sıralar ve şahın gücünün sınırsız olduğunu kavrar (ST.OÖ. 2.9)"
    ],
    etkinlikOnerisi: "Şarkılı Oyun: 'Vezir elbisesinin rengini sever, beyaz vezir beyaza, siyah vezir siyaha gider' tekerlemesi ile diziliş yapılır.",
    miniSoru: {
      soru: "Diğer taşların üzerinden engel tanımadan zıplayabilen taş hangisidir?",
      secenekler: ["Sevimli At", "Kaya Gibi Kale", "Küçük Piyon"],
      dogruIndex: 0
    }
  },
  {
    id: 3,
    mebKodu: "ST.OÖ. 3",
    oyunAlani: "3. Alan: Şah Tehdidi ve Mat",
    baslik: "3. Şah Çekme, Mat ve Pat Durumu",
    ikon: "👑",
    dersSaati: "6 Ders Saati",
    aciklama: "Şahın oyun için hayati önemi kavranır. Şah tehdidinden kurtulma yolları (kaçma, alma, perdeleme), mat ile pat (beraberlik) arasındaki fark keşfedilir.",
    kazanimlar: [
      "Şahın oyun için önemini ve şahın tahtadan alınamayacağını kavrar (ST.OÖ. 3.1 - 3.4)",
      "Şah tehdidinden 3 yolla kurtulur: Kaçar, tehdit edeni alır, perdeleme yapar (ST.OÖ. 3.3)",
      "Mat etmeyi açıklar ve tek hamlelik mat alıştırmaları yapar (ST.OÖ. 3.5 - 3.6)",
      "Şahın tehdit altında olmadığı ve hamlesinin kalmadığı 'Pat' durumunu mat ile ayırt eder (ST.OÖ. 3.7 - 3.9)"
    ],
    etkinlikOnerisi: "Taktik Masalı: Şah bir kaleye sığınır, çocuklar tehdit eden taşa karşı kalkan (perdeleme) yapmayı dener.",
    miniSoru: {
      soru: "Satrançta şah tehdit altında değilken yapacak hiçbir yasal hamlesi kalmazsa oyun nasıl biter?",
      secenekler: ["Mat olur", "Pat (Berabere) olur", "Şah oyundan çıkar"],
      dogruIndex: 1
    }
  },
  {
    id: 4,
    mebKodu: "ST.OÖ. 4",
    oyunAlani: "4. Alan: Tehdit ve Savunma",
    baslik: "4. Tehditleri Fark Etme ve Güvenli Kareler",
    ikon: "🛡️",
    dersSaati: "6 Ders Saati",
    aciklama: "Rakibin tehdit ettiği taşları önceden sezme, tehdit altındaki taşı kaçırma, korumalı karelere gitme ve perdeleme yapma becerisi kazandırılır.",
    kazanimlar: [
      "Satrançta tehdit durumlarını zamanında fark eder (ST.OÖ. 4.1)",
      "Tehdit eden taşın önüne dost taşla perdeleme yapar (ST.OÖ. 4.2)",
      "Tehdit altında olmayan güvenli kareleri ayırt eder (ST.OÖ. 4.3)",
      "Korumalı ve korumasız taş kavramlarını açıklar (ST.OÖ. 4.4)"
    ],
    etkinlikOnerisi: "Güvenli Liman Oyunu: Öğretmen tahtada tehlikeli kareleri kırmızı renkle işaretler; öğrenci taşını güvenli limana (yeşil kareye) kaçırır.",
    miniSoru: {
      soru: "Tehdit altındaki bir taşımızı korumak için aşağıdakilerden hangisi yapılabilir?",
      secenekler: ["Taşı güvenli bir kareye kaçırmak", "Önüne perdeleme yapmak", "Her ikisi de"],
      dogruIndex: 2
    }
  },
  {
    id: 5,
    mebKodu: "ST.OÖ. 5",
    oyunAlani: "5. Alan: Özel Kurallar",
    baslik: "5. Satrancın Özel Sırları: Rok ve Geçerken Alma",
    ikon: "⭐",
    dersSaati: "4 Ders Saati",
    aciklama: "Şahı güvenli köşeye alıp kaleyi savaşa sokan 'Rok' hamlesi ve piyonların özel sürprizi 'Geçerken Alma' (En Passant) kuralları uygulanır.",
    kazanimlar: [
      "Rok hamlesini kurallarına uygun olarak uygular (ST.OÖ. 5.1)",
      "Şah veya kale oynamışsa rok yapılamayacağını bilir",
      "Piyonun geçerken alma kuralını uygulamalı kavrar (ST.OÖ. 5.2)"
    ],
    etkinlikOnerisi: "Rok Dansı: Şah iki adım kaleye doğru kayar, kale hemen şahın üzerinden atlayarak yanına oturur.",
    miniSoru: {
      soru: "Rok yaparken tahtada ilk önce hangi taşa dokunulmalıdır?",
      secenekler: ["Kale", "Şah", "Piyon"],
      dogruIndex: 1
    }
  },
  {
    id: 6,
    mebKodu: "ST.OÖ. 6",
    oyunAlani: "6. Alan: Satranç Oynuyorum",
    baslik: "6. Karşılıklı Maç, Nezaket ve Etik Kurallar",
    ikon: "🤝",
    dersSaati: "7 Ders Saati",
    aciklama: "Centilmenlik, rakibe oyuna başlarken başarılar dileme, sessizce oynama, hakemden el kaldırarak yardım isteme ve oyun sonunda tebrikleşme davranışları kazandırılır.",
    kazanimlar: [
      "Kurallara uygun karşılıklı maç yapar (ST.OÖ. 6.1)",
      "Oyun sırasında sorun yaşarsa el kaldırarak öğretmeninden/hakemden yardım ister (ST.OÖ. 6.2)",
      "Satranç salonunun sessiz bir düşünme ortamı olduğunu kavrar",
      "Oyun bittiğinde rakibinin elini sıkarak tebrik eder ve taşları kutusuna düzenli toplar (ST.OÖ. 6.3 - 6.4)"
    ],
    etkinlikOnerisi: "Dostluk Turnuvası: Karşılıklı oturan minikler önce el sıkışır, maç bitiminde birbirlerini alkışlayarak tahtayı birlikte toplar.",
    miniSoru: {
      soru: "Satranç maçı başlamadan önce rakibimize ne söylemeliyiz?",
      secenekler: ["Seni yeneceğim!", "İyi oyunlar / Başarılar dilerim", "Konuşmamalıyız"],
      dogruIndex: 1
    }
  }
];

export default function DerslerPage() {
  const [aktifDers, setAktifDers] = useState<MebDers>(MEB_DERSLER[0]);
  const [tamamlananlar, setTamamlananlar] = useState<number[]>([]);
  const [secilenCevap, setSecilenCevap] = useState<number | null>(null);
  const [cevapDurumu, setCevapDurumu] = useState<"bekliyor" | "dogru" | "yanlis">("bekliyor");

  useEffect(() => {
    try {
      const kayitli = localStorage.getItem("mebTamamlananDersler");
      if (kayitli) setTamamlananlar(JSON.parse(kayitli));
    } catch {}
  }, []);

  function handleDersSec(d: MebDers) {
    setAktifDers(d);
    setSecilenCevap(null);
    setCevapDurumu("bekliyor");
  }

  function handleDersTamamla(id: number) {
    const yeni = tamamlananlar.includes(id)
      ? tamamlananlar.filter((x) => x !== id)
      : [...tamamlananlar, id];
    setTamamlananlar(yeni);
    try {
      localStorage.setItem("mebTamamlananDersler", JSON.stringify(yeni));
    } catch {}
  }

  function handleCevap(idx: number) {
    setSecilenCevap(idx);
    if (idx === aktifDers.miniSoru.dogruIndex) {
      setCevapDurumu("dogru");
      if (!tamamlananlar.includes(aktifDers.id)) {
        handleDersTamamla(aktifDers.id);
      }
    } else {
      setCevapDurumu("yanlis");
    }
  }

  const yuzde = Math.round((tamamlananlar.length / MEB_DERSLER.length) * 100);

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
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: "bold", color: "#0369a1", letterSpacing: "1px" }}>
          T.C. MİLLÎ EĞİTİM BAKANLIĞI • TEMEL EĞİTİM GENEL MÜDÜRLÜĞÜ
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", margin: "6px 0" }}>
          Okul Öncesi Satranç Öğretim Programı
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px 0" }}>
          MEB Müfredatı: 6 Temel Oyun Alanı • 33 Kazanım • 36 Ders Saati
        </p>

        {/* İlerleme Çubuğu */}
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            backgroundColor: "#f1f5f9",
            borderRadius: "14px",
            padding: "8px 14px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
            <span style={{ color: "#0284c7" }}>Müfredat İlerlemesi</span>
            <span style={{ color: "#0369a1" }}>%{yuzde} ({tamamlananlar.length}/6 Oyun Alanı)</span>
          </div>
          <div style={{ width: "100%", height: "8px", backgroundColor: "#cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ width: `${yuzde}%`, height: "100%", backgroundColor: "#0284c7", transition: "width 0.3s ease" }} />
          </div>
        </div>
      </div>

      {/* İKİ SÜTUN: SOL ÜNİTELER - SAĞ KAZANIM & DETAY */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {/* SOL: 6 OYUN ALANI LİSTESİ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {MEB_DERSLER.map((d) => {
            const secili = aktifDers.id === d.id;
            const bitti = tamamlananlar.includes(d.id);
            return (
              <div
                key={d.id}
                onClick={() => handleDersSec(d)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
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
                    <div style={{ fontSize: "12px", fontWeight: "900", color: "#1e293b" }}>
                      {d.baslik}
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>
                      {d.mebKodu} • ⏱️ {d.dersSaati}
                    </div>
                  </div>
                </div>
                <span>{bitti ? "✅" : "⚪"}</span>
              </div>
            );
          })}
        </div>

        {/* SAĞ: KAZANIM VE PEDAGOJİK ETKİNLİK ALANI */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "18px",
            borderRadius: "18px",
            border: "2px solid #bae6fd",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#0284c7" }}>
              {aktifDers.oyunAlani}
            </span>
            <button
              type="button"
              onClick={() => handleDersTamamla(aktifDers.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: tamamlananlar.includes(aktifDers.id) ? "#16a34a" : "#0284c7",
                color: "#ffffff",
                borderRadius: "8px",
                border: "none",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {tamamlananlar.includes(aktifDers.id) ? "Tamamlandı ✨" : "Tamamla ⚪"}
            </button>
          </div>

          <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a", margin: "0 0 8px 0" }}>
            {aktifDers.baslik}
          </h2>

          <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155", margin: "0 0 12px 0" }}>
            {aktifDers.aciklama}
          </p>

          {/* MEB KAZANIMLARI KUTUSU */}
          <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: "12px", border: "1px solid #e0f2fe", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: "900", color: "#0369a1", marginBottom: "4px" }}>
              🎯 MEB Resmi Kazanımları:
            </div>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
              {aktifDers.kazanimlar.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>

          {/* OYUN / DRAMA ÖNERİSİ */}
          <div style={{ backgroundColor: "#fef3c7", padding: "8px 12px", borderRadius: "10px", border: "1px solid #fde68a", fontSize: "11px", color: "#92400e", fontWeight: "bold", marginBottom: "14px" }}>
            🎭 {aktifDers.etkinlikOnerisi}
          </div>

          {/* MİNİ ETKİNLİK TESTİ */}
          <div style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
            <div style={{ fontSize: "11px", fontWeight: "900", color: "#1e293b", marginBottom: "6px" }}>
              ❓ Pekiştirme Sorusu: {aktifDers.miniSoru.soru}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {aktifDers.miniSoru.secenekler.map((sec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCevap(idx)}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: secilenCevap === idx ? (idx === aktifDers.miniSoru.dogruIndex ? "#dcfce7" : "#fee2e2") : "#f8fafc",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {sec}
                </button>
              ))}
            </div>

            {cevapDurumu === "dogru" && (
              <div style={{ marginTop: "6px", fontSize: "11px", fontWeight: "bold", color: "#16a34a" }}>
                🎉 Tebrikler! Kazanım başarıyla tamamlandı.
              </div>
            )}
            {cevapDurumu === "yanlis" && (
              <div style={{ marginTop: "6px", fontSize: "11px", fontWeight: "bold", color: "#dc2626" }}>
                ❌ Tekrar düşün! İpucu kazanım açıklamalarında gizli.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <Link
          href="/odev"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "900",
            fontSize: "12px",
          }}
        >
          🚀 Kazanımları Pekiştirmek İçin Ödevlere Geç
        </Link>
      </div>
    </div>
  );
}
