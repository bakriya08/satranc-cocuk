"use client";

import { useState } from "react";
import Link from "next/link";

interface Soru {
  id: number;
  kategori: string;
  soruMetni: string;
  ipucu: string;
  secenekler: { id: string; metin: string; dogru: boolean }[];
}

const SEVIYE_TESTI_SORULARI: Soru[] = [
  {
    id: 1,
    kategori: "1. Taş Tanıma",
    soruMetni: "1. Aşağıdaki taşların adları ile şekilleri eşleştirildiğinde, 'At' taşı tahtada hangi özgün hareketiyle bilinir?",
    ipucu: "L harfi şeklinde zıplar ve diğer taşların üzerinden atlayabilir.",
    secenekler: [
      { id: "a", metin: "Sadece düz hatlarda birer kare ilerler", dogru: false },
      { id: "b", metin: "L harfi şeklinde zıplayarak ilerler ve taşların üzerinden atlar", dogru: true },
      { id: "c", metin: "Sadece çapraz yönlerde hareket eder", dogru: false },
    ],
  },
  {
    id: 2,
    kategori: "2. Atın Hamleleri",
    soruMetni: "2. Atın bulunduğu kareden gidebileceği kareler işaretlendiğinde, atın rotası hangi geometrik şekli oluşturur?",
    ipucu: "İki adım düz, bir adım yana doğru çizilen harftir.",
    secenekler: [
      { id: "a", metin: "L harfi", dogru: true },
      { id: "b", metin: "X harfi", dogru: false },
      { id: "c", metin: "Daire", dogru: false },
    ],
  },
  {
    id: 3,
    kategori: "3. Şah Çekme",
    soruMetni: "3. Beyazın şah çekme hamlesi incelendiğinde, şah çekmek ne anlama gelir?",
    ipucu: "Rakip şahın doğrudan tehdit altında olması durumudur.",
    secenekler: [
      { id: "a", metin: "Rakip şahın doğrudan saldırı ve tehdit altında bırakılması", dogru: true },
      { id: "b", metin: "Oyunun berabere bitmesi", dogru: false },
      { id: "c", metin: "Rok yapılması", dogru: false },
    ],
  },
  {
    id: 4,
    kategori: "4. Vezir Hamleleri",
    soruMetni: "4. Vezirin hamleleri diyagram üzerinde incelendiğinde, vezir hangi yönlerde hareket edebilir?",
    ipucu: "Hem kale gibi düz hem fil gibi çapraz gidebilir.",
    secenekler: [
      { id: "a", metin: "Sadece düz (yatay ve dikey)", dogru: false },
      { id: "b", metin: "Sadece çapraz", dogru: false },
      { id: "c", metin: "Hem düz hem de çapraz (her yöne)", dogru: true },
    ],
  },
  {
    id: 5,
    kategori: "5. Geçerken Alma",
    soruMetni: "5. Siyah piyonunu iki kare ilerletirse, beyaz 'Geçerken Alma' (En Passant) kuralına göre bu piyonu nasıl alabilir?",
    ipucu: "Piyon sanki tek kare çıkmış gibi çapraz arkasından vurur.",
    secenekler: [
      { id: "a", metin: "Piyon bir kare çıkmış gibi çaprazdan vurarak alır", dogru: true },
      { id: "b", metin: "Önünden düz bir hamleyle alır", dogru: false },
      { id: "c", metin: "Geçerken alma sadece kalelere uygulanır", dogru: false },
    ],
  },
  {
    id: 6,
    kategori: "6. Mat Hamleleri",
    soruMetni: "6. Siyah oyuncunun mat hamlesi bulmacasında, mat pozisyonunun temel özelliği nedir?",
    ipucu: "Şahın hiçbir kaçış ve kurtulma yolunun kalmamasıdır.",
    secenekler: [
      { id: "a", metin: "Şahın tehdit altında olması ve hiçbir kurtuluş yolunun bulunmaması", dogru: true },
      { id: "b", metin: "Piyonun terfi etmesi", dogru: false },
      { id: "c", metin: "Oyunun berabere ilan edilmesi", dogru: false },
    ],
  },
  {
    id: 7,
    kategori: "7. Mat Hamleleri",
    soruMetni: "7. Beyaz oyuncunun mat hamlesi incelendiğinde, arka sıra (koridor) matı hangi taşla sıklıkla yapılır?",
    ipucu: "Kale veya vezir son yataya inerek şahı sıkıştırır.",
    secenekler: [
      { id: "a", metin: "Kale veya Vezir", dogru: true },
      { id: "b", metin: "At", dogru: false },
      { id: "c", metin: "Piyon", dogru: false },
    ],
  },
  {
    id: 8,
    kategori: "8. Koordinat Sistemi",
    soruMetni: "8. Aşağıdaki diyagramda işaretli karelerin adları (koordinatları) okunurken hangi sıra takip edilir?",
    ipucu: "Önce dikey harf (dosya), sonra yatay sayı (yatay sıra).",
    secenekler: [
      { id: "a", metin: "Önce harf, sonra sayı (Örn: e4)", dogru: true },
      { id: "b", metin: "Önce sayı, sonra harf (Örn: 4e)", dogru: false },
      { id: "c", metin: "Sadece sayılar okunur", dogru: false },
    ],
  },
  {
    id: 9,
    kategori: "9. Taş Güçleri",
    soruMetni: "9. Taşların güçleri puan olarak yazıldığında, en değerli taş ile piyon arasındaki puan oranı nedir?",
    ipucu: "Vezir 9 puan, piyon 1 puandır.",
    secenekler: [
      { id: "a", metin: "Vezir 9 puan, Piyon 1 puandır", dogru: true },
      { id: "b", metin: "İkisi de eşittir", dogru: false },
      { id: "c", metin: "Kale 9 puandır", dogru: false },
    ],
  },
  {
    id: 10,
    kategori: "10. Başlangıç Konumu",
    soruMetni: "10. Beyaz taşlarla oynayacak bir oyuncunun Şah, Vezir ve Kaleleri doğru yerleştirmesi için Vezir hangi kareye konmalıdır?",
    ipucu: "Beyaz vezir d1 karesine, kendi rengine konur.",
    secenekler: [
      { id: "a", metin: "d1 karesi (Kendi renginde)", dogru: true },
      { id: "b", metin: "e1 karesi", dogru: false },
      { id: "c", metin: "a1 karesi", dogru: false },
    ],
  },
  {
    id: 11,
    kategori: "11. Merkez Kareler",
    soruMetni: "11. Satranç tahtasının tam merkezinde yer alan 4 kritik kare hangileridir?",
    ipucu: "d4, d5, e4, e5 kareleri tahtanın kalbidir.",
    secenekler: [
      { id: "a", metin: "d4, d5, e4, e5", dogru: true },
      { id: "b", metin: "a1, a8, h1, h8", dogru: false },
      { id: "c", metin: "b2, b7, g2, g7", dogru: false },
    ],
  },
  {
    id: 12,
    kategori: "12. Şiş Hamlesi",
    soruMetni: "12. Şiş hamlesi (Skewer) taktiğinde, değerli bir taşa (örneğin şah veya vezir) saldırılarak kaçırtılır ve arkasındaki daha az değerli taş kazanılır. Bu hamleyi en iyi hangi taşlar yapar?",
    ipucu: "Uzun menzilli taşlar (Vezir, Kale, Fil).",
    secenekler: [
      { id: "a", metin: "Vezir, Kale ve Fil", dogru: true },
      { id: "b", metin: "Sadece Piyon", dogru: false },
      { id: "c", metin: "Sadece At", dogru: false },
    ],
  },
  {
    id: 13,
    kategori: "13. Çatal Hamlesi",
    soruMetni: "13. Çatal hamlesi yaparken aynı anda iki taşı birden tehdit eden en ünlü taş hangisidir?",
    ipucu: "At çatalları çok tehlikelidir.",
    secenekler: [
      { id: "a", metin: "At", dogru: true },
      { id: "b", metin: "Şah", dogru: false },
      { id: "c", metin: "Kale", dogru: false },
    ],
  },
  {
    id: 14,
    kategori: "14. Cebirsel Notasyon",
    soruMetni: "14. '1.Ve4+' hamle yazılışı neyi ifade eder?",
    ipucu: "Vezir e4 karesine gelir ve şah çeker (+).",
    secenekler: [
      { id: "a", metin: "Vezirin e4 karesine giderek şah çekmesi", dogru: true },
      { id: "b", metin: "Vezirin oyundan çıkması", dogru: false },
      { id: "c", metin: "Rok yapılması", dogru: false },
    ],
  },
  {
    id: 15,
    kategori: "15. Çifte Şah",
    soruMetni: "15. Çifte şah çekme konumunda şhattan nasıl kurtulunabilir?",
    ipucu: "İki taşa birden perde çekilemeyeceği için şah mutlaka kaçmalıdır.",
    secenekler: [
      { id: "a", metin: "Şah mutlaka kaçmak zorundadır (Perdeleme veya alma yapılamaz)", dogru: true },
      { id: "b", metin: "Araya taş konarak perde yapılır", dogru: false },
      { id: "c", saldiran: "Saldıran taşlar alınır", dogru: false } as any,
    ],
  },
  {
    id: 16,
    kategori: "16. Rok Kuralları",
    soruMetni: "16. Uzun rok (Vezir kanadı roku) hangi taraftaki kale ile yapılır ve aradaki boşluk kaç karedir?",
    ipucu: "Vezir tarafındaki kale ile yapılır, şah ile kale arasında 3 boş kare vardır.",
    secenekler: [
      { id: "a", metin: "Vezir kanadı kalesiyle, 3 boş kare varken", dogru: true },
      { id: "b", metin: "Şah kanadı kalesiyle, 2 boş kare varken", dogru: false },
      { id: "c", metin: "Herhangi bir kale ile", dogru: false },
    ],
  },
  {
    id: 17,
    kategori: "17. Piyon Terfisi",
    soruMetni: "17. Son sıraya ulaşan piyonun en akıllıca tercihi genellikle ne olmalıdır?",
    ipucu: "Tahtanın en güçlü taşına dönüşmek.",
    secenekler: [
      { id: "a", metin: "Vezire terfi etmek", dogru: true },
      { id: "b", metin: "Piyon olarak kalmak", dogru: false },
      { id: "c", metin: "Oyundan çıkmak", dogru: false },
    ],
  },
  {
    id: 18,
    kategori: "18. Pat Durumu",
    soruMetni: "18. Pat (Beraberlik) ile Mat arasındaki en temel fark nedir?",
    ipucu: "Pat durumunda şah tehdit altında değildir.",
    secenekler: [
      { id: "a", metin: "Pat durumunda şah saldırı altında değildir ve hamlesi kalmamıştır", dogru: true },
      { id: "b", metin: "Pat olunca oyun siyahın galibiyetiyle biter", dogru: false },
      { id: "c", metin: "Pat ile mat tamamen aynı şeydir", dogru: false },
    ],
  },
  {
    id: 19,
    kategori: "19. Hesaplama ve Mat",
    soruMetni: "19. İki hamlede mat bulmacalarında oyuncu neyi hesaplamalıdır?",
    ipucu: "Kendi hamlesi, rakibin zorunlu cevabı ve ikinci hamlede mat.",
    secenekler: [
      { id: "a", metin: "Kendi hamlesi ve rakibin olası zorunlu yanıtına karşılık mat hamlesini", dogru: true },
      { id: "b", metin: "Sadece rastgele hamleleri", dogru: false },
      { id: "c", metin: "Taşları tahtadan kaldırmayı", dogru: false },
    ],
  },
  {
    id: 20,
    kategori: "20. Açılışlar",
    soruMetni: "20. İspanyol Açılışı (Ruy Lopez) hangi hamlelerle başlar?",
    ipucu: "1.e4 e5 2.Nf3 Nc6 3.Bb5",
    secenekler: [
      { id: "a", metin: "1.e4 e5 2.Nf3 Nc6 3.Bb5", dogru: true },
      { id: "b", metin: "1.d4 d5 2.c4", dogru: false },
      { id: "c", metin: "1.c4 e5", dogru: false },
    ],
  },
  {
    id: 21,
    kategori: "21. Taş Değişimi",
    soruMetni: "21. Eşit taş değişimi (Örn: 3 puanlık atı 3 puanlık fille almak) ne olarak değerlendirilir?",
    ipucu: "Madeni paraların değerinin eşit olması gibi.",
    secenekler: [
      { id: "a", metin: "Eşit ve adil taş değişimi", dogru: true },
      { id: "b", metin: "Büyük hata", dogru: false },
      { id: "c", metin: "Mat hamlesi", dogru: false },
    ],
  },
  {
    id: 22,
    kategori: "22. Açmaz Taktikleri",
    soruMetni: "22. Açmazda (Pin) kalan bir taş oynatılamaz veya oynatıldığında arkasındaki daha değerli taş (şah veya vezir) tehlikeye girer. Açmazdan yararlanmak için ne yapılır?",
    ipucu: "Açmazdaki taşa baskı artırılır.",
    secenekler: [
      { id: "a", metin: "Açmazdaki taşa ek baskı yapılarak taş kazanılmaya çalışılır", dogru: true },
      { id: "b", metin: "Taş görmezden gelinir", dogru: false },
      { id: "c", metin: "Oyun berabere bitirilir", dogru: false },
    ],
  },
  {
    id: 23,
    kategori: "23. Geçer Piyon",
    soruMetni: "23. Önünde rakip piyon bulunmayan ve terfi etmesine rakip piyonların engel olamayacağı piyonlara ne denir?",
    ipucu: "Karşısında durabilen kimse olmayan ilerlemiş piyon.",
    secenekler: [
      { id: "a", metin: "Geçer piyon", dogru: true },
      { id: "b", metin: "Korumasız piyon", dogru: false },
      { id: "c", metin: "Zayıf piyon", dogru: false },
    ],
  },
  {
    id: 24,
    kategori: "24. Kare Kuralı",
    soruMetni: "24. Oyun sonlarında piyonun vezir olup olamayacağını hesaplamakta kullanılan kuralın adı nedir?",
    ipucu: "Köşegen bir geometri alanı çizilerek hesaplanır.",
    secenekler: [
      { id: "a", metin: "Kare Kuralı (Square Rule)", dogru: true },
      { id: "b", metin: "Üçgen Kuralı", dogru: false },
      { id: "c", metin: "50 Hamle Kuralı", dogru: false },
    ],
  },
  {
    id: 25,
    kategori: "25. Yetersiz Güç",
    soruMetni: "25. Aşağıdaki son oyun konumlarından hangisinde mat yapmak OLANAKSIZDIR (Yetersiz Güç)?",
    ipucu: "Sadece Şah ile tek At veya tek Fil mat edemez.",
    secenekler: [
      { id: "a", metin: "Tek Şah ve Tek At (veya Tek Fil) kalması", dogru: true },
      { id: "b", metin: "Şah ve Vezir kalması", dogru: false },
      { id: "c", metin: "Şah ve Kale kalması", dogru: false },
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
          Çoklu Zeka & Satranç Değerlendirme Envanteri (25 Soru)
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
