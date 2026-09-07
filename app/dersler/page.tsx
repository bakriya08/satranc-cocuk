"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface KazanimItem {
  kod: string;
  baslik: string;
  aciklama: string;
}

interface UniteItem {
  id: number;
  baslik: string;
  ikon: string;
  kazanimlar: KazanimItem[];
}

const OKUL_ONCESI_PROGRAMI: UniteItem[] = [
  {
    id: 1,
    baslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    ikon: "🗺️",
    kazanimlar: [
      {
        kod: "ST.OÖ. 1.1.",
        baslik: "Satranç oyununu ve tahtasını tanır.",
        aciklama:
          "Satranç oyunu hakkında genel bilgi verilir. Satranç tahtasının; yatay, dikey, çapraz, kenar, köşelerine ve şeklinin kare olduğuna dikkat çekilir. Öğrencilerden satranç tahtasının zemin karelerindeki açık, koyu kavramlarını fark etmeleri beklenir. Satranç tahtası üzerinde yatay ve dikey hizalamada sekize kadar saymalarına rehberlik edilir. Bu dönemdeki çocuklar için satranç tahtası tanıtılırken çeşitli oyunlar, etkinlikler, drama vb. yöntem ve tekniklerinden yararlanılır.",
      },
      {
        kod: "ST.OÖ. 1.2.",
        baslik: "Satranç tahtasında nesneleri yatay ve dikey yönlerde hareket ettirir.",
        aciklama:
          "Yatay ve dikey kavramı gösterilir. Karelerden oluşan zeminde, çeşitli etkinliklerle bedenin, nesnelerin yatay ve dikey yönde hareket ettirilmesi sağlanır. Bu tür çalışmalarla satranç tahtası üzerinde konu pekiştirilir.",
      },
      {
        kod: "ST.OÖ. 1.3.",
        baslik: "Satranç tahtasında nesneleri çapraz yönlerde hareket ettirir.",
        aciklama:
          "Çapraz yön kavramı gösterilir. Karelerden oluşan zeminde, çeşitli etkinliklerle nesneler çapraz hareket ettirilir. Bu tür çalışmalardan sonra satranç tahtası üzerinde nesnelerin hareket ettirilmesi sağlanarak konu pekiştirilir.",
      },
    ],
  },
  {
    id: 2,
    baslik: "2. Taşlar ve Özellikleri",
    ikon: "🏰",
    kazanimlar: [
      {
        kod: "ST.OÖ. 2.1.",
        baslik: "Kale taşının hareketini uygular.",
        aciklama:
          "Kale taşı ve taşın oyundaki konumu tanıtılır. Öğrencilere kalenin tahta üzerindeki hareketi gösterilir, öğrencilerin denemelerine fırsat verilir.",
      },
      {
        kod: "ST.OÖ. 2.2.",
        baslik: "Fil taşının hareketini uygular.",
        aciklama:
          "Fil taşı ve taşın oyundaki konumu tanıtılır. Öğrencilere filin tahta üzerindeki hareketi gösterilir, öğrencilerin denemelerine fırsat verilir.",
      },
      {
        kod: "ST.OÖ. 2.3.",
        baslik: "Vezir taşının hareketini uygular.",
        aciklama:
          "Vezir taşı ve taşın oyundaki konumu tanıtılır. Öğrencilere vezirin tahta üzerindeki hareketi gösterilir, öğrencilerin denemelerine fırsat verilir.",
      },
      {
        kod: "ST.OÖ. 2.4.",
        baslik: "Şah taşının hareketini uygular.",
        aciklama:
          "Şah taşı ve taşın oyundaki konumu tanıtılır. Öğrencilere şahın tahta üzerindeki hareketi gösterilir, öğrencilerin denemelerine fırsat verilir.",
      },
      {
        kod: "ST.OÖ. 2.5.",
        baslik: "At taşının hareketini uygular.",
        aciklama:
          "At taşı ve taşın oyundaki konumu tanıtılır. Öğrencilere atın tahta üzerindeki hareketi gösterilir, öğrencilerin denemelerine fırsat verilir.",
      },
      {
        kod: "ST.OÖ. 2.6.",
        baslik: "Piyon taşının hareketini uygular.",
        aciklama:
          "Piyon taşı ve taşın oyundaki konumu tanıtılır. Öğrencilere piyonun tahta üzerindeki hareketi gösterilir, öğrencilerin denemelerine fırsat verilir.",
      },
      {
        kod: "ST.OÖ. 2.7.",
        baslik: "Piyon terfisini uygular.",
        aciklama:
          "Piyonun terfi olma özelliği anlatılır. Satrançta en son sıraya ulaşan piyonun, vezir, kale, fil ya da at ile değiştirilmesi gerektiği vurgulanır.",
      },
      {
        kod: "ST.OÖ. 2.8.",
        baslik: "Satrançtaki başlangıç konumunu dizer.",
        aciklama:
          "Öğrencilerin satranç tahtası önünde dururken beyaz karenin öğrencinin sağ tarafına gelmesi sağlanır. Satranç taşlarını doğru yerleştirmesine, taşların başlangıç konumuna göre dizilmesine rehberlik edilir. Özellikle şah ve vezirin yerlerine dikkat çekilir.",
      },
      {
        kod: "ST.OÖ. 2.9.",
        baslik: "Taşların puan değerlerini kavrar.",
        aciklama:
          "Taşların değerlerini bilir ve değerlerine göre sıralayabilir, karşılaştırabilir, gruplayabilir. Bazı etkinliklerle taşların değerlerinin karşılaştırılmasına ve özellikle şahın gücünün sınırsız olduğuna dikkat çekilir.",
      },
      {
        kod: "ST.OÖ. 2.10.",
        baslik: "Satrançta taş almayı bilir.",
        aciklama:
          "İyi taş alışı, kötü taş alışı ve eşit taş alışı kavramları üzerinde durulur. Taşların puan değerlerine göre taş alışı örneklerle gösterilir. Doğru taş alışı kavramı ve bunun önemi anlatılır.",
      },
      {
        kod: "ST.OÖ. 2.11.",
        baslik: "Satrançta saldırı altındaki taşın koruması kavramını açıklar.",
        aciklama:
          "Korumasız taş ve korumalı taş kavramının ne olduğuna dikkat çekilir. Korumasız taşı ve korumalı taşı tahta üzerinde gösterebilir. Korumasız taş üzerine farklı konumlar oluşturularak öğrencilerin yorum yapmalarına fırsat verilir.",
      },
    ],
  },
  {
    id: 3,
    baslik: "3. Satrançta Şah Tehdidi ve Mat",
    ikon: "👑",
    kazanimlar: [
      {
        kod: "ST.OÖ. 3.1.",
        baslik: "Şahın, oyun için önemini açıklar.",
        aciklama:
          "Öğrencilerin dikkati şahın önemine çekilir. Oyunun amacının şahı ele geçirmek olduğu vurgulanır. Öğrencilerden şahın yakalandığında oyunun biteceğini bilmesi beklenir.",
      },
      {
        kod: "ST.OÖ. 3.2.",
        baslik: "Şah çeker.",
        aciklama:
          "Öğrenciler bir veya daha fazla taşın, karşı tarafın şahını tehdit etmesi durumunun şah çekmek olduğunu bilir. Satranç tahtası üzerinde şah çekme konumu gösterilir ve uygulatılır.",
      },
      {
        kod: "ST.OÖ. 3.3.",
        baslik: "Şah tehdidinden çeşitli teknikleri uygulayarak kurtulur.",
        aciklama:
          "Tehdit altında bulunan şahın; tehdit eden taşı alarak kurtarabileceği, kaçarak kurtarabileceği, başka bir taş ile perdeleme yaparak kurtarabileceği uygulama örnekleriyle verilir. Satranç tahtası üzerinde şahın tehditten güvenli bir kareye kaçması sağlanır.",
      },
      {
        kod: "ST.OÖ. 3.4.",
        baslik: "Şahın diğer taşlar gibi alınamayacağını kavrar.",
        aciklama:
          "Satranç oyunu bitse dahi şahın tahtadan alınmadığı, şahı almanın kural dışı bir hamle olduğu benimsetilir ve bu kural uygulatılır.",
      },
      {
        kod: "ST.OÖ. 3.5.",
        baslik: "Mat etmeyi açıklar.",
        aciklama:
          "Şah tehdidinden kurtulamayan tarafın mat olduğuna ve mat olma durumunda oyunun sona erdiğine dikkat çekilir.",
      },
      {
        kod: "ST.OÖ. 3.6.",
        baslik: "Tek hamlelik mat alıştırmalarını yapar.",
        aciklama:
          "Satranç tahtasına dizilen tek hamlelik mat konumlarında doğru hamle uygulamalı olarak gösterilir. Mat durumu sözel olarak ifade edilir.",
      },
      {
        kod: "ST.OÖ. 3.7.",
        baslik: "Pat durumunu bilir.",
        aciklama:
          "Hamle sırası kendinde olan öğrencinin şahı tehdit altında değilse, yapılabilecek hamle kalmamışsa ve hamle yapılabilecek herhangi bir taş da yoksa konumun pat olduğu ve maçın berabere bittiği öğrenciye fark ettirilir. Öğrencilerin uygulamalarına fırsat verilir.",
      },
      {
        kod: "ST.OÖ. 3.8.",
        baslik: "Berabere kalmanın ne olduğunu bilir.",
        aciklama:
          "Satrançta beraberlik durumunun olduğu belirtilir. Öğrencilerin, beraberlik türleri olan taş yetmezliğini, 50 hamle kuralını, 3 konum tekrarını, anlaşmalı beraberlik özelliklerini ve pat durumunu anlamalarına rehberlik edilir.",
      },
      {
        kod: "ST.OÖ. 3.9.",
        baslik: "Mat ile pat konumlarını ayırt eder.",
        aciklama:
          "Önceki kazanımlarda verilen 'mat' ve 'pat' durumları tekrar edilir. Öğrencilerin satranç tahtasına dizilen örnek konumlar arasında 'mat' ile 'pat' pozisyonlarının farkına varmaları sağlanır. Öğrencilerin bu iki pozisyonu daha net ayırabilmelerini sağlayacak uygulamalar yaptırılır.",
      },
    ],
  },
  {
    id: 4,
    baslik: "4. Satrançta Tehdit ve Savunma",
    ikon: "🛡️",
    kazanimlar: [
      {
        kod: "ST.OÖ. 4.1.",
        baslik: "Satrançta tehdit durumlarını fark eder.",
        aciklama:
          "Öğrencilere rakibinin ve kendi taşlarının konumları fark ettirilir. Örnek pozisyonlar üzerinde tehdit altında olan taşlar uygulamalı olarak gösterilir. Bu pozisyonlarla ilgili alıştırmalar yaptırılır.",
      },
      {
        kod: "ST.OÖ. 4.2.",
        baslik: "Taşının önüne perdeleme yapar.",
        aciklama:
          "Tehdit eden ve edilen taş arasına kurallara uygun şekilde taşını oynayarak tehditten kurtulabileceği gösterilir. Öğrencilere bu kazanıma yönelik çeşitli uygulamalar yaptırılır.",
      },
      {
        kod: "ST.OÖ. 4.3.",
        baslik: "Satrançta güvenli kareleri ayırt eder.",
        aciklama:
          "Öğrencilerin tehdit altında olmayan kareleri görebilmelerine rehberlik edilir. Güvenli kareye gitmeyen taşın kaybedileceğine dair örnek uygulamalar yaptırılır.",
      },
      {
        kod: "ST.OÖ. 4.4.",
        baslik: "Taşını korur.",
        aciklama:
          "Tehdit altındaki taşın başka bir taştan destek alınarak veya güvenli bir kareye kaçırılarak kurtarılabileceği gösterilir. Öğrencilere bu kazanıma yönelik çeşitli uygulamalar yaptırılır.",
      },
      {
        kod: "ST.OÖ. 4.5.",
        baslik: "Satrançta taş alır.",
        aciklama:
          "Tehdit altında olan taşın istenirse alınabileceği ile ilgili uygulamalar yapılabilir.",
      },
    ],
  },
  {
    id: 5,
    baslik: "5. Satrancın Özel Kuralları",
    ikon: "⭐",
    kazanimlar: [
      {
        kod: "ST.OÖ. 5.1.",
        baslik: "Rok hamlesini uygular.",
        aciklama:
          "Rok hamlesinin şahın özel bir hamlesi ve kalenin şah ile yer değiştirmesi olduğuna dikkat çekilir. Uygulamalar yaptırılır.",
      },
      {
        kod: "ST.OÖ. 5.2.",
        baslik: "Piyonun geçerken alma hamlesini kavrar.",
        aciklama:
          "Piyonlar çapraz alan taşlardır ancak ilk çıkışta iki kare ilerlediğinde bir piyonun tehdit karesinden atlanılmışsa o piyonun bir kare çıkmış olduğu kabul edilir ve piyon çapraz alınır. Öğrencilere geçerken alma kuralına uygun olarak kavrayabileceği örnekler sunulmalıdır.",
      },
    ],
  },
  {
    id: 6,
    baslik: "6. Satranç Oynuyorum",
    ikon: "🤝",
    kazanimlar: [
      {
        kod: "ST.OÖ. 6.1.",
        baslik: "Karşılıklı satranç oynar.",
        aciklama:
          "Oyuna başlarken rakibe başarılar dilenmesi gerektiğine, kurallara uygun karşılıklı maç yapılmasına vb. konulara dikkat çekilir.",
      },
      {
        kod: "ST.OÖ. 6.2.",
        baslik: "Oyun esnasında yardım ister.",
        aciklama:
          "Oyun oynarken karşılaştığı kurallarla ilgili sorunlarda öğretmeninden / hakemden el kaldırma yoluyla yardım istenmesi ve satrancın sessiz bir ortamda konuşulmadan oynanacağı kavratılır.",
      },
      {
        kod: "ST.OÖ. 6.3.",
        baslik: "Oyun bitişini açıklar.",
        aciklama:
          "Oyunun nasıl bittiği, kazanç, kayıp, berabere durumları örneklerle açıklanır. Satranç materyallerinin düzenli bir şekilde toplanması, yerine bırakılması vb. davranışlar kazandırılır.",
      },
      {
        kod: "ST.OÖ. 6.4.",
        baslik: "Satrancın etik kurallarının farkına varır.",
        aciklama:
          "Öğrencilere oyun arkadaşlarına saygı duyma, oyun bitiminde birbirlerini tebrik etme vb. davranışlar kazandırılır. Öğrencilerin satranca devam eden arkadaşlarına karşı da onların oyunları bitene kadar saygı kurallarına uygun davranmaları ve diğer oyunlara müdahale etmemeleri gerektiğine dikkat çekilir.",
      },
    ],
  },
];

export default function DerslerPage() {
  const [aktifUnite, setAktifUnite] = useState<UniteItem>(OKUL_ONCESI_PROGRAMI[0]);
  const [seciliKazanim, setSeciliKazanim] = useState<KazanimItem>(OKUL_ONCESI_PROGRAMI[0].kazanimlar[0]);
  const [tamamlananKodlar, setTamamlananKodlar] = useState<string[]>([]);

  useEffect(() => {
    try {
      const kayit = localStorage.getItem("tamamlananMebKazanimlar");
      if (kayit) setTamamlananKodlar(JSON.parse(kayit));
    } catch {}
  }, []);

  function handleUniteSec(u: UniteItem) {
    setAktifUnite(u);
    setSeciliKazanim(u.kazanimlar[0]);
  }

  function handleKazanimTamamla(kod: string) {
    let yeni: string[];
    if (tamamlananKodlar.includes(kod)) {
      yeni = tamamlananKodlar.filter((k) => k !== kod);
    } else {
      yeni = [...tamamlananKodlar, kod];
    }
    setTamamlananKodlar(yeni);
    try {
      localStorage.setItem("tamamlananMebKazanimlar", JSON.stringify(yeni));
    } catch {}
  }

  const toplamKazanimSayisi = OKUL_ONCESI_PROGRAMI.reduce((toplam, u) => toplam + u.kazanimlar.length, 0);
  const tamamlananSayisi = tamamlananKodlar.length;
  const ilerlemeYuzdesi = Math.round((tamamlananSayisi / toplamKazanimSayisi) * 100);

  return (
    <div
      style={{
        maxWidth: "980px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #bae6fd",
        boxShadow: "0 10px 30px rgba(2, 132, 199, 0.1)",
        margin: "0 auto",
      }}
    >
      {/* ÜST BAŞLIK & İLERLEME ÇUBUĞU */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: "900", color: "#0369a1", letterSpacing: "1.5px" }}>
          T.C. MİLLÎ EĞİTİM BAKANLIĞI • TEMEL EĞİTİM GENEL MÜDÜRLÜĞÜ
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", margin: "6px 0" }}>
          Satranç Okul Öncesi Öğretim Programı
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px 0" }}>
          6 Ana Öğrenme Alanı • 33 Temel Yaşam & Oyun Kazanımı
        </p>

        {/* İlerleme Çubuğu */}
        <div
          style={{
            maxWidth: "420px",
            margin: "0 auto",
            backgroundColor: "#f1f5f9",
            borderRadius: "14px",
            padding: "8px 14px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
            <span style={{ color: "#0284c7" }}>Müfredat İlerlemesi</span>
            <span style={{ color: "#0369a1" }}>%{ilerlemeYuzdesi} ({tamamlananSayisi}/{toplamKazanimSayisi} Kazanım)</span>
          </div>
          <div style={{ width: "100%", height: "8px", backgroundColor: "#cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ width: `${ilerlemeYuzdesi}%`, height: "100%", backgroundColor: "#0284c7", transition: "width 0.3s ease" }} />
          </div>
        </div>
      </div>

      {/* 6 ANA ÜNİTE BUTONLARI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "8px",
          marginBottom: "18px",
        }}
      >
        {OKUL_ONCESI_PROGRAMI.map((u) => {
          const aktif = aktifUnite.id === u.id;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => handleUniteSec(u)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "8px 6px",
                borderRadius: "14px",
                border: aktif ? "2px solid #0284c7" : "1px solid #e2e8f0",
                backgroundColor: aktif ? "#e0f2fe" : "#f8fafc",
                color: aktif ? "#0369a1" : "#475569",
                cursor: "pointer",
                fontWeight: "900",
                fontSize: "11px",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "20px" }}>{u.ikon}</span>
              <span style={{ textAlign: "center", lineHeight: "1.2" }}>{u.baslik}</span>
            </button>
          );
        })}
      </div>

      {/* İKİ SÜTUNLU DÜZEN: KAZANIM LİSTESİ VE KAZANIM DETAYI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
        {/* SOL: SEÇİLİ ÜNİTENİN KAZANIM LİSTESİ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "12px", fontWeight: "900", color: "#0f172a", marginBottom: "2px" }}>
            📋 {aktifUnite.baslik} ({aktifUnite.kazanimlar.length} Kazanım)
          </div>
          {aktifUnite.kazanimlar.map((k) => {
            const secili = seciliKazanim.kod === k.kod;
            const bitti = tamamlananKodlar.includes(k.kod);
            return (
              <div
                key={k.kod}
                onClick={() => setSeciliKazanim(k)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: secili ? "2px solid #0284c7" : "1px solid #e2e8f0",
                  backgroundColor: secili ? "#f0f9ff" : "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "900", color: "#0284c7" }}>
                    {k.kod}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b" }}>
                    {k.baslik}
                  </div>
                </div>
                <span style={{ fontSize: "16px", marginLeft: "6px" }}>{bitti ? "✅" : "⚪"}</span>
              </div>
            );
          })}
        </div>

        {/* SAĞ: SEÇİLİ KAZANIMIN PEDAGOJİK AÇIKLAMASI */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "20px",
            borderRadius: "18px",
            border: "2px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "900", color: "#0284c7" }}>
                {seciliKazanim.kod}
              </span>
              <button
                type="button"
                onClick={() => handleKazanimTamamla(seciliKazanim.kod)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: tamamlananKodlar.includes(seciliKazanim.kod) ? "#16a34a" : "#0284c7",
                  color: "#ffffff",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {tamamlananKodlar.includes(seciliKazanim.kod) ? "Tamamlandı ✨" : "Tamamla ⚪"}
              </button>
            </div>

            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: "0 0 12px 0" }}>
              {seciliKazanim.baslik}
            </h2>

            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                lineHeight: "1.7",
                color: "#334155",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "900", color: "#0369a1", marginBottom: "6px" }}>
                📖 MEB Öğretim Programı Açıklaması:
              </div>
              {seciliKazanim.aciklama}
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", gap: "8px" }}>
            <Link
              href="/masallar"
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 12px",
                backgroundColor: "#ec4899",
                color: "#ffffff",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "11px",
                fontWeight: "900",
              }}
            >
              ✨ Masallarla Pekiştir
            </Link>
            <Link
              href="/odev"
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 12px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "11px",
                fontWeight: "900",
              }}
            >
              📚 Ödevlere Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
