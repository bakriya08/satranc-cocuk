"use client";

import { useState } from "react";
import Link from "next/link";

interface Soru {
  id: number;
  kategori: string;
  soruMetni: string;
  ipucu: string;
  tahtaTipi?: "baslangic" | "kaleYolu" | "filCapraz" | "atL" | "sahAdim" | "piyonIleri" | "matVurusu";
  secenekler: { id: string; metin: string; dogru: boolean }[];
}

const SEVIYE_TESTI_SORULARI: Soru[] = [
  {
    id: 1,
    kategori: "1. Taş Tanıma",
    soruMetni: "1. Aşağıdaki taşların adları ile şekilleri eşleştirildiğinde, 'At' taşı tahtada hangi özgün hareketiyle bilinir?",
    ipucu: "L harfi şeklinde zıplar ve diğer taşların üzerinden atlayabilir.",
    tahtaTipi: "atL",
    secenekler: [
      { id: "a", metin: "Sadece düz hatlarda birer kare ilerler", dogru: false },
      { id: "b", metin: "L harfi şeklinde zıplayarak ilerler ve taşların üzerinden atlar", dogru: true },
      { id: "c", metin: "Sadece çapraz yönlerde hareket eder", dogru: false },
    ],
  },
  {
    id: 2,
    kategori: "2. Başlangıç Konumu",
    soruMetni: "2. Beyaz taşlarla oynayacak olan bir oyuncunun, taşlarını doğru yerleştirmiş olması için Vezir hangi karede yer almalıdır?",
    ipucu: "Vezir kendi rengindeki kareyi sever (Beyaz vezir beyaz karede).",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Kendi rengindeki karede (d1 karesi)", dogru: true },
      { id: "b", metin: "Köşede (a1 karesi)", dogru: false },
      { id: "c", metin: "Şahın yanında herhangi bir karede", dogru: false },
    ],
  },
  {
    id: 3,
    kategori: "3. Taş Değerleri",
    soruMetni: "3. Satranç tahtasında normal taşlar içinde en yüksek puan değerine sahip olan taş hangisidir?",
    ipucu: "9 puan değerindeki süper taştır.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Kale (5 Puan)", dogru: false },
      { id: "b", metin: "Vezir (9 Puan)", dogru: true },
      { id: "c", metin: "At (3 Puan)", dogru: false },
    ],
  },
  {
    id: 4,
    kategori: "4. Geçerken Alma",
    soruMetni: "4. Siyah piyonunu iki kare ilerletirse, beyaz 'Geçerken Alma' (En Passant) kuralına göre bu piyonu nasıl alabilir?",
    ipucu: "Piyon sanki bir kare çıkmış gibi çaprazından vurarak alır.",
    tahtaTipi: "piyonIleri",
    secenekler: [
      { id: "a", metin: "Çapraz arkasındaki kareye inerek alır", dogru: true },
      { id: "b", metin: "Önünden düz bir hamleyle alır", dogru: false },
      { id: "c", metin: "Geçerken alma kuralı sadece kaleler içindir", dogru: false },
    ],
  },
  {
    id: 5,
    kategori: "5. Taktik Motifler",
    soruMetni: "5. Aynı anda iki veya daha fazla taşı birden tehdit etme hamlesine ne ad verilir?",
    ipucu: "Genellikle at veya vezir tarafından yapılır.",
    tahtaTipi: "atL",
    secenekler: [
      { id: "a", metin: "Çatal hamlesi", dogru: true },
      { id: "b", metin: "Rok hamlesi", dogru: false },
      { id: "c", metin: "Pat durumu", dogru: false },
    ],
  },
  {
    id: 6,
    kategori: "6. Çifte Şah",
    soruMetni: "6. Aynı anda iki taşla birden şah çekilmesi durumuna ne ad verilir?",
    ipucu: "Kurtulması en zor şah çekiş türüdür.",
    tahtaTipi: "sahAdim",
    secenekler: [
      { id: "a", metin: "Çifte şah", dogru: true },
      { id: "b", metin: "Açmaz", dogru: false },
      { id: "c", metin: "Şiş", dogru: false },
    ],
  },
  {
    id: 7,
    kategori: "7. Pat Durumu",
    soruMetni: "7. Şah tehdit altında değilken oynayacak yasal hamlesi kalmayan tarafın durumu nedir?",
    ipucu: "Maç berabere biter.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Pat", dogru: true },
      { id: "b", metin: "Mat", dogru: false },
      { id: "c", metin: "Terfi", dogru: false },
    ],
  },
  {
    id: 8,
    kategori: "8. Açılışlar",
    soruMetni: "8. 1.e4 e5 2.Nf3 Nc6 3.Bb5 hamleleriyle başlayan dünyaca ünlü klasik açılış hangisidir?",
    ipucu: "İspanyol kökenli bir açılıştır.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "İspanyol Açılışı (Ruy Lopez)", dogru: true },
      { id: "b", metin: "Vezir Gambiti", dogru: false },
      { id: "c", metin: "Sicilya Savunması", dogru: false },
    ],
  },
  {
    id: 9,
    kategori: "9. Kale Hamleleri",
    soruMetni: "9. Kale tahtada hangi yönde hareket eder ve önü kapalıysa ne yapar?",
    ipucu: "Artı (+) biçiminde düz caddelerde kayar.",
    tahtaTipi: "kaleYolu",
    secenekler: [
      { id: "a", metin: "Artı şeklinde düz gider, önü kapalıysa durur", dogru: true },
      { id: "b", metin: "Sadece çapraz gider", dogru: false },
      { id: "c", metin: "Taşların üzerinden atlar", dogru: false },
    ],
  },
  {
    id: 10,
    kategori: "10. Fil Hamleleri",
    soruMetni: "10. Fil tahtada hangi yönde hareket eder ve oyun boyunca rengini değiştirir mi?",
    ipucu: "Çarpı (X) şeklinde çapraz gider, rengini asla değiştirmez.",
    tahtaTipi: "filCapraz",
    secenekler: [
      { id: "a", metin: "Çapraz gider, başladığı rengi asla değiştirmez", dogru: true },
      { id: "b", metin: "Düz gider ve renk değiştirir", dogru: false },
      { id: "c", metin: "Her yöne birer adım atar", dogru: false },
    ],
  },
  {
    id: 11,
    kategori: "11. Vezir Hamleleri",
    soruMetni: "11. Vezir tahtada hangi yönlere gidebilir?",
    ipucu: "Hem kale gibi düz hem fil gibi çapraz.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Hem düz hem de çapraz (her yöne)", dogru: true },
      { id: "b", metin: "Sadece düz hatlarda", dogru: false },
      { id: "c", metin: "Sadece L harfiyle", dogru: false },
    ],
  },
  {
    id: 12,
    kategori: "12. Şah Hamleleri",
    soruMetni: "12. Şah tahtada kaç kare ilerleyebilir?",
    ipucu: "Her yöne sadece 1 adım.",
    tahtaTipi: "sahAdim",
    secenekler: [
      { id: "a", metin: "Her yöne sadece 1 adım", dogru: true },
      { id: "b", metin: "İstediği kadar uzağa", dogru: false },
      { id: "c", metin: "Sadece iki kare", dogru: false },
    ],
  },
  {
    id: 13,
    kategori: "13. Piyon Hamleleri",
    soruMetni: "13. Piyon düz yürürken rakip taşı nasıl alır?",
    ipucu: "Düz yürür, çapraz yer.",
    tahtaTipi: "piyonIleri",
    secenekler: [
      { id: "a", metin: "Çapraz yönde", dogru: true },
      { id: "b", metin: "Düz öne doğru", dogru: false },
      { id: "c", metin: "Geriye doğru", dogru: false },
    ],
  },
  {
    id: 14,
    kategori: "14. Terfi Kuralları",
    soruMetni: "14. Karşı en son sıraya ulaşan piyon neye dönüşebilir?",
    ipucu: "Vezir, kale, fil veya ata dönüşebilir.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Vezir, Kale, Fil veya At'a dönüşebilir", dogru: true },
      { id: "b", metin: "Sadece şah olabilir", dogru: false },
      { id: "c", metin: "Oyundan çıkarılır", dogru: false },
    ],
  },
  {
    id: 15,
    kategori: "15. Mat Bulmacası",
    soruMetni: "15. Şah tehdit altındayken kaçamıyor, tehdit eden alınamıyor ve araya taş konamıyorsa bu nedir?",
    ipucu: "Oyunun bittiği zafer anı.",
    tahtaTipi: "matVurusu",
    secenekler: [
      { id: "a", metin: "Şah ve Mat", dogru: true },
      { id: "b", metin: "Pat", dogru: false },
      { id: "c", metin: "Rok", dogru: false },
    ],
  },
  {
    id: 16,
    kategori: "16. Koordinat Okuma",
    soruMetni: "16. Satranç tahtasında koordinatlar okunurken önce ne yazılır?",
    ipucu: "Önce dikey harf, sonra yatay sayı.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Önce dikey harf, sonra yatay sayı (Örn: e4)", dogru: true },
      { id: "b", metin: "Önce sayı, sonra harf", dogru: false },
      { id: "c", metin: "Sadece sayılar", dogru: false },
    ],
  },
  {
    id: 17,
    kategori: "17. Merkez Kareler",
    soruMetni: "17. Tahtanın kalbi olan 4 merkez kare hangileridir?",
    ipucu: "d4, d5, e4, e5 kareleri.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "d4, d5, e4, e5", dogru: true },
      { id: "b", metin: "a1, a8, h1, h8", dogru: false },
      { id: "c", metin: "b2, b7, g2, g7", dogru: false },
    ],
  },
  {
    id: 18,
    kategori: "18. Şiş Taktikleri",
    soruMetni: "18. Değerli bir taşa saldırıp arkasındaki taşı kazanma taktiğine ne denir?",
    ipucu: "Skewer olarak da bilinir.",
    secenekler: [
      { id: "a", metin: "Şiş hamlesi", dogru: true },
      { id: "b", metin: "Çatal", dogru: false },
      { id: "c", metin: "Rok", dogru: false },
    ],
  },
  {
    id: 19,
    kategori: "19. Notasyon",
    soruMetni: "19. '1.Ve4+' ne anlama gelir?",
    ipucu: "Vezir e4'e gider ve şah çeker.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Vezir e4 karesine gider ve şah çeker", dogru: true },
      { id: "b", metin: "Vezir oyundan çıkar", dogru: false },
      { id: "c", metin: "Rok yapılır", dogru: false },
    ],
  },
  {
    id: 20,
    kategori: "20. Rok Kuralları",
    soruMetni: "20. Rok yaparken önce hangi taşa dokunulmalıdır?",
    ipucu: "Rok şah hamlesidir.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Önce Şaha dokunulur", dogru: true },
      { id: "b", metin: "Önce Kaleye dokunulur", dogru: false },
      { id: "c", metin: "İkisine aynı anda", dogru: false },
    ],
  },
  {
    id: 21,
    kategori: "21. Taş Değişimi",
    soruMetni: "21. Aynı puan değerindeki taşların karşılıklı değişimine ne denir?",
    ipucu: "Adil ve eşit değişim.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Eşit taş değişimi", dogru: true },
      { id: "b", metin: "Kötü alış", dogru: false },
      { id: "c", metin: "Mat", dogru: false },
    ],
  },
  {
    id: 22,
    kategori: "22. Açmaz Taktikleri",
    soruMetni: "22. Arkasındaki değerli taşı korumak zorunda olduğu için oynatılamayan taşa ne denir?",
    ipucu: "Pin durumu.",
    secenekler: [
      { id: "a", metin: "Açmazda kalan taş", dogru: true },
      { id: "b", metin: "Serbest taş", dogru: false },
      { id: "c", metin: "Korunmasız taş", dogru: false },
    ],
  },
  {
    id: 23,
    kategori: "23. Geçer Piyon",
    soruMetni: "23. Önünde rakip piyon engeli kalmayan ilerlemiş piyonun adı nedir?",
    ipucu: "Zirveye koşan piyon.",
    tahtaTipi: "piyonIleri",
    secenekler: [
      { id: "a", metin: "Geçer piyon", dogru: true },
      { id: "b", metin: "Zayıf piyon", dogru: false },
      { id: "c", metin: "Geri kalmış piyon", dogru: false },
    ],
  },
  {
    id: 24,
    kategori: "24. Kare Kuralı",
    soruMetni: "24. Piyonun vezir olup olamayacağını hesaplamak için kullanılan yöntemin adı nedir?",
    ipucu: "Köşegen kare alanı.",
    secenekler: [
      { id: "a", metin: "Kare Kuralı", dogru: true },
      { id: "b", metin: "Üçgen Kuralı", dogru: false },
      { id: "c", metin: "Çember Kuralı", dogru: false },
    ],
  },
  {
    id: 25,
    kategori: "25. Yetersiz Güç",
    soruMetni: "25. Tahtada sadece iki şah ve tek at kalırsa oyunun sonucu ne olur?",
    ipucu: "Mat yapmak olanaksızdır.",
    tahtaTipi: "baslangic",
    secenekler: [
      { id: "a", metin: "Yetersiz güç nedeniyle berabere biter", dogru: true },
      { id: "b", metin: "At olan taraf kazanır", dogru: false },
      { id: "c", metin: "Şah olan kazanır", dogru: false },
    ],
  },
];

function SatrançTahtasiGorseli({ tip }: { tip: string }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "220px",
        margin: "10px auto",
        backgroundColor: "#292524",
        padding: "6px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", borderRadius: "6px" }}>
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
    </div>
  );
}

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
        maxWidth: "840px",
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
          Çoklu Zeka & Satranç Değerlendirme Envanteri (25 Soru & Görsel Diyagramlar)
        </p>
      </div>

      {!testBitti ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold", color: "#047857", marginBottom: "6px" }}>
            <span>Soru {aktifSoruIndex + 1} / {SEVIYE_TESTI_SORULARI.length} ({soru.kategori})</span>
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

          <div
            style={{
              backgroundColor: "#ecfdf5",
              padding: "18px",
              borderRadius: "16px",
              border: "2px solid #a7f3d0",
              marginBottom: "16px",
              display: "grid",
              gridTemplateColumns: soru.tahtaTipi ? "1fr auto" : "1fr",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div>
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

            {soru.tahtaTipi && (
              <div>
                <SatrançTahtasiGorseli tip={soru.tahtaTipi} />
              </div>
            )}
          </div>

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
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <span style={{ fontSize: "50px" }}>🏆🎉</span>
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#065f46", margin: "10px 0" }}>
            Tebrikler, Seviye Tespit Sınavını Tamamladın!
          </h2>
          <p style={{ fontSize: "14px", color: "#334155", margin: "0 0 20px 0" }}>
            Toplam 25 sorudan <strong style={{ color: "#059669" }}>{dogruPuan} doğru</strong> yaptın.
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
              {dogruPuan >= 20
                ? "Mükemmel! Satranç ustası seviyesindesin. Tüm taktik ve kurallara kusursuz hakimsin! 🌟"
                : dogruPuan >= 12
                ? "Çok iyi bir seviyedesin! Temel ve orta düzey taktikleri biliyorsun. Eksiklerini kapatmak için dersleri inceleyebilirsin. 👍"
                : "Güzel bir başlangıç! '🎓 Derslerim' sekmesindeki modülleri çalışarak kısa sürede puanını katlayabilirsin. ♟️"}
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
