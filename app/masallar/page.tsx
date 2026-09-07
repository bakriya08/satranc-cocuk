"use client";

import { useState } from "react";
import Link from "next/link";

interface Masal {
  id: string;
  baslik: string;
  karakter: string;
  ozet: string;
  renk: string;
  hikaye: string[];
  kuralKutusu: string;
  soru: string;
  cevap: string;
  youtubeId: string;
  videoBaslik: string;
}

const MASALLAR: Masal[] = [
  {
    id: "piyon",
    baslik: "Cesur Küçük Piyonun Büyük Rüyası",
    karakter: "♟️",
    ozet: "En önde yürüyen, asla geri adım atmayan ve son kareye ulaştığında bir vezire dönüşen cesur piyon.",
    renk: "#f59e0b",
    youtubeId: https://youtube.com/shorts/1KY3vHScGdg?feature=share
    videoBaslik: "64 Kare Ülkesi: Minik Piyonların Serüveni",
    hikaye: [
      "Bir zamanlar 64 karelik Büyülü Krallık'ta minik bir piyon yaşarmış. Diğer taşlar ona bazen 'sen küçücüksün, sadece bir adım atabilirsin' derlermiş.",
      "Ama cesur piyonun kocaman bir hayali varmış: Krallığın en son sırasına ulaşıp muhteşem bir Vezir olmak!",
      "Piyon yürürken arkasına hiç bakmazmış. Çünkü satranç ülkesinin en altın kuralı şudur: Piyonlar asla geri adım atmaz!",
      "Önündeki kare boşsa tıkır tıkır bir adım ilerlermiş. Başlangıç çizgisindeyken ise enerjisi o kadar çok olurmuş ki, isterse hop diye iki adım birden zıplayabilirmiş.",
      "Yoluna bir engel çıktığında ise kurnazca çapraz adımla engeli aşarmış. Ve bir gün, cesareti sayesinde 8. kareye ulaşmış. Gökyüzü parıldamış ve cesur piyon taç giyerek bir Vezir'e dönüşmüş!"
    ],
    kuralKutusu: "💡 Piyon Kuralı: Sadece ileriye doğru düz 1 adım gider (başlangıçta 2 adım atabilir). Düşman taşları ise 1 adım çaprazdan alır. Asla geri yürüyemez!",
    soru: "Piyonlar tahtanın en son karesine ulaşınca neye dönüşebilir?",
    cevap: "Vezir, Kale, Fil veya At'a dönüşebilir (Piyon Terfisi)!"
  },
  {
    id: "at",
    baslik: "Engellerin Üzerinden Zıplayan Sevimli Tay",
    karakter: "♞",
    ozet: "Karelerin üzerinden 'L' çizerek atlayan ve taşların üzerinden uçabilen tek sevimli dostumuz.",
    renk: "#8b5cf6",
    youtubeId: "iViag4IL7KE", // At Şarkısı ve Zıplayan At Animasyonu
    videoBaslik: "Çizgi Film: L Şeklinde Uçan Atın Dansı",
    hikaye: [
      "Satranç Krallığı'nın en neşeli ve kıpır kıpır üyesi Sevimli At imiş. Diğer taşlar yol kapalıyken beklemek zorunda kalırken, At gülümseyerek yelesini savururmuş.",
      "Çünkü At'ın sihirli nalları varmış! Önünde koca bir kale veya piyon ordusu olsa bile, hop diye üzerlerinden uçar gidermiş.",
      "At yürümeyi değil, dans etmeyi severmiş. Dans ederken daima bir 'L' harfi çizermiş: İki adım ileri, bir adım yana!",
      "Beyaz kareden zıpladığında kendini her zaman siyah bir karede; siyah kareden zıpladığında ise beyaz bir karede bulurmuş. Krallıkta onun bu sevimli zıplayışlarına herkes hayranmış!"
    ],
    kuralKutusu: "💡 At Kuralı: Satrançta taşların üzerinden atlayabilen TEK taştır! 'L' harfi şeklinde hareket eder (2 kare düz, 1 kare yana).",
    soru: "Taşların üzerinden hangi taş atlayabilir?",
    cevap: "Sadece sevimli At taşların üzerinden zıplayabilir!"
  },
  {
    id: "kale",
    baslik: "Geniş Caddelerin Nöbetçisi: Kaya Gibi Kale",
    karakter: "♜",
    ozet: "Dümdüz yolları koruyan, ileri, geri ve yanlara hızla kayan kale kulesi.",
    renk: "#3b82f6",
    youtubeId: "STvoGbt_l-8", // 64 Kare Ülkesi Şarkıları ve Kale Animasyonu
    videoBaslik: "Güçlü Kaleler ve Düz Yolların Kahramanı",
    hikaye: [
      "Büyülü Krallık'ın köşelerinde iki koca taş kule yükselirmiş. Bu kuleler öyle güçlüymüş ki, onlara 'Kale' derlermiş.",
      "Kale hiçbir zaman virajlı yollara sapmaz, çaprazlara gitmezmiş. Onun görevi geniş caddeleri korumakmış.",
      "Yol açık olduğu sürece bir roket gibi dümdüz ileriye fırlar, canı isterse geriye çekilir, isterse sağa sola kayarmış.",
      "Ayrıca Bilge Şah tehlikeye girdiğinde hemen yanına koşar, onunla özel bir saray dansı yaparmış. Bu dansa 'Rok' derlermiş ve Şah'ı koruma altına alırmış."
    ],
    kuralKutusu: "💡 Kale Kuralı: İleri, geri, sağa ve sola dümdüz sınırsız kare gidebilir. Yolundaki taşın üzerinden atlayamaz.",
    soru: "Kale çapraz karelere gidebilir mi?",
    cevap: "Hayır! Kaleler sadece artı (+) işareti gibi düz hatlarda kayar."
  },
  {
    id: "fil",
    baslik: "Renkli Patikaların Gizemli Gezgini: Fil",
    karakter: "♝",
    ozet: "Kendi rengindeki patikadan asla ayrılmayan, rüzgar gibi çapraz süzülen Fil.",
    renk: "#10b981",
    youtubeId: "zjrgpOdVRIk", // 64 Kare Ülkesi Eğitici Çizgi Animasyon
    videoBaslik: "Çapraz Patikaların Neşeli Gezgini Fil",
    hikaye: [
      "Krallıkta iki kardeş Fil yaşarmış. Birisi sarayın beyaz mermerlerini, diğeri ise siyah bahçe taşlarını çok severmiş.",
      "Beyaz karede doğan Fil, kardeşine 'Ben hayatım boyunca sadece beyaz patikalarda koşacağım' demiş. Siyah karedeki Fil de 'Ben de daima siyah patikalarda süzüleceğim!' diye söz vermiş.",
      "Filler çapraz yürümeyi öyle çok severmiş ki, tahtanın bir ucundan diğer ucuna şimşek gibi çaprazdan uçarlarmış.",
      "İki fil yan yana geldiğinde krallığın hem beyaz hem siyah yolları güven altında olurmuş!"
    ],
    kuralKutusu: "💡 Fil Kuralı: Sadece çapraz yönlerde (X şeklinde) istediği kadar gidebilir. Hangi renk karede başladıysa daima o renkte kalır.",
    soru: "Beyaz karede başlayan bir Fil, oyun sırasında siyah bir kareye geçebilir mi?",
    cevap: "Asla! Başladığı karenin rengine sadık kalır."
  },
  {
    id: "vezir",
    baslik: "Krallığın En Güçlü Koruyucusu: Muhteşem Vezir",
    karakter: "♛",
    ozet: "Hem Kale'nin hem Fil'in gücüne sahip, tahtanın her köşesine yetişebilen süper kahraman.",
    renk: "#ec4899",
    youtubeId: "bje6zRTyhA0", // Satranç Öğreniyorum Çizgi Film
    videoBaslik: "Süper Kahraman Vezir ve Büyülü Hamleleri",
    hikaye: [
      "Satranç tahtasında herkesin gözünü kamaştıran biri varmış: Işıltılı tacıyla Muhteşem Vezir!",
      "Vezir hem Kale gibi dümdüz fırlayabilir hem de Fil gibi çapraz yollarda rüzgar gibi esebilirmiş.",
      "Krallığın neresinde bir yardıma ihtiyaç olsa, Vezir tek bir hamlede oraya ulaşırmış. O yüzden krallıktaki herkes ona 'Süper Kahraman' dermiş.",
      "Gücü 9 piyon değerinde olan Vezir, yine de dikkatli olmayı hiç bırakmazmış. Çünkü gücünü şımarıklıkla değil, zekasıyla kullanırmış!"
    ],
    kuralKutusu: "💡 Vezir Kuralı: İleri, geri, sağa, sola ve çaprazlara... Yani her yöne istediği kadar kare gidebilir! Sadece taşların üzerinden atlayamaz.",
    soru: "Satranç tahtasındaki en hareketli ve güçlü taş hangisidir?",
    cevap: "Muhteşem Vezir!"
  },
  {
    id: "sah",
    baslik: "Krallığın Kalbi: Bilge Şah",
    karakter: "♚",
    ozet: "Ağırbaşlı, her defasında bir adım atan ama oyunun kaderini elinde tutan kalbi.",
    renk: "#ef4444",
    youtubeId: "-Ws00SzwT1U", // Büyülü Krallık Şah Bölümü
    videoBaslik: "Bilge Şah ve Krallığın Gizli Sırları",
    hikaye: [
      "Ve işte geldik Krallığın en saygıdeğer sakinine: Bilge Şah.",
      "Şah asla acele etmezmiş. Gücünü koşmaktan değil, bilgeliğinden alırmış. Her defasında sadece ve sadece bir adım atarmış.",
      "İsterse öne, isterse yana, isterse çapraza... Ama daima tek bir kare.",
      "Diğer tüm taşlar Şah'ı korumak için el ele verirmiş. Çünkü Şah köşeye sıkışıp hiçbir yere kaçamazsa (yani 'Mat' olursa), oyun sona erermiş.",
      "Bilge Şah öğrencilerine her zaman şunu fısıldarmış: 'Hızlı koşan değil, doğru düşünen kazanır!'"
    ],
    kuralKutusu: "💡 Şah Kuralı: Her yöne sadece 1 adım gidebilir. Asla tehdit altındaki (tehlikeli) bir kareye basamaz.",
    soru: "Şah tek seferde kaç kare yürüyebilir?",
    cevap: "Sadece 1 kare gidebilir!"
  }
];

export default function MasallarPage() {
  const [seciliMasal, setSeciliMasal] = useState<Masal>(MASALLAR[0]);
  const [cevapAcik, setCevapAcik] = useState(false);
  const [videoGoster, setVideoGoster] = useState(false);

  function handleMasalSec(m: Masal) {
    setSeciliMasal(m);
    setCevapAcik(false);
    setVideoGoster(false);
  }

  return (
    <div
      style={{
        maxWidth: "920px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #fbcfe8",
        boxShadow: "0 10px 30px rgba(236, 72, 153, 0.1)",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "48px" }}>🏰✨🎬</span>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", margin: "6px 0" }}>
          Masallarla Satranç Diyarı & Çizgi Animasyon
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Kahramanını seç, masalını oku veya Türkçe çizgi filmini izleyerek kuralları öğren!
        </p>
      </div>

      {/* KARAKTER SEÇİM ŞERİDİ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {MASALLAR.map((m) => {
          const aktif = seciliMasal.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleMasalSec(m)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "10px 8px",
                backgroundColor: aktif ? m.renk : "#f8fafc",
                color: aktif ? "#ffffff" : "#334155",
                borderRadius: "16px",
                border: aktif ? `2px solid ${m.renk}` : "1px solid #e2e8f0",
                cursor: "pointer",
                transform: aktif ? "scale(1.05)" : "none",
                transition: "all 0.15s ease",
                boxShadow: aktif ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
              }}
            >
              <span style={{ fontSize: "28px" }}>{m.karakter}</span>
              <span style={{ fontSize: "11px", fontWeight: "900" }}>{m.id.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* AKTİF MASAL KİTABI ALANI */}
      <div
        style={{
          backgroundColor: "#fffdf9",
          borderRadius: "20px",
          border: `3px solid ${seciliMasal.renk}`,
          padding: "24px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
          position: "relative",
        }}
      >
        {/* Masal Başlığı, Karakter & Video Aç Butonu */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px dashed #fed7aa",
            paddingBottom: "14px",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                fontSize: "44px",
                backgroundColor: "#fef3c7",
                borderRadius: "50%",
                width: "70px",
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${seciliMasal.renk}`,
                flexShrink: 0,
              }}
            >
              {seciliMasal.karakter}
            </div>

            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#1e293b", margin: "0 0 4px 0" }}>
                {seciliMasal.baslik}
              </h2>
              <p style={{ fontSize: "12px", color: "#78716c", margin: 0, fontStyle: "italic" }}>
                {seciliMasal.ozet}
              </p>
            </div>
          </div>

          {/* Çizgi Filmi Göster / Gizle Butonu */}
          <button
            type="button"
            onClick={() => setVideoGoster(!videoGoster)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              backgroundColor: videoGoster ? "#334155" : "#ef4444",
              color: "#ffffff",
              borderRadius: "14px",
              border: "none",
              fontWeight: "900",
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)",
              transition: "background-color 0.2s",
            }}
          >
            {videoGoster ? "📖 Masala Geri Dön" : "🎬 Çizgi Filmi İzle"}
          </button>
        </div>

        {/* ANİMASYONLU TÜRKÇE VİDEO ALANI */}
        {videoGoster ? (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 Oranı
                height: 0,
                overflow: "hidden",
                borderRadius: "18px",
                border: "4px solid #fde68a",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                backgroundColor: "#000000",
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${seciliMasal.youtubeId}?autoplay=1&rel=0`}
                title={seciliMasal.videoBaslik}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#475569",
                marginTop: "10px",
              }}
            >
              📺 {seciliMasal.videoBaslik}
            </div>
          </div>
        ) : (
          /* Masal Metni Paragrafları */
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {seciliMasal.hikaye.map((paragraf, index) => (
              <p
                key={index}
                style={{
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "#292524",
                  margin: 0,
                  textIndent: "16px",
                }}
              >
                {paragraf}
              </p>
            ))}
          </div>
        )}

        {/* KURAL KUTUSU */}
        <div
          style={{
            backgroundColor: "#ecfdf5",
            border: "2px solid #a7f3d0",
            borderRadius: "14px",
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: "700",
            color: "#065f46",
            marginBottom: "16px",
          }}
        >
          {seciliMasal.kuralKutusu}
        </div>

        {/* MİNİ MASAL BULMACASI / SORU */}
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "2px dashed #fca5a5",
            borderRadius: "14px",
            padding: "14px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: "900", color: "#991b1b", marginBottom: "8px" }}>
            ❓ Masal Bilmecesi: {seciliMasal.soru}
          </div>

          {!cevapAcik ? (
            <button
              type="button"
              onClick={() => setCevapAcik(true)}
              style={{
                padding: "6px 14px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                borderRadius: "10px",
                border: "none",
                fontSize: "11px",
                fontWeight: "900",
                cursor: "pointer",
              }}
            >
              Cevabı Gör 🔍
            </button>
          ) : (
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#16a34a",
                backgroundColor: "#ffffff",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "inline-block",
                border: "1px solid #86efac",
              }}
            >
              🎉 {seciliMasal.cevap}
            </div>
          )}
        </div>
      </div>

      {/* ALT GEÇİŞ BUTONU */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link
          href="/odev"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "900",
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
          }}
        >
          🚀 Masalı & Videoyu Tamamladım, Şimdi Ödevimi Çözeceğim!
        </Link>
      </div>
    </div>
  );
}
