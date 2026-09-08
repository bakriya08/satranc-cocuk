"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Chess } from "chess.js";

export default function BotOyunuPage() {
  const [oyun, setOyun] = useState<Chess | null>(null);
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [zorluk, setZorluk] = useState<"kolay" | "orta" | "zor">("kolay");
  const [botMesaji, setBotMesaji] = useState("Merhaba şampiyon! Ben akıllı satranç botunum. Beyaz taşlarla maça başlayabilirsin, hamleni bekliyorum! ♟️");
  const [secilenKare, setSecilenKare] = useState<string | null>(null);
  const [imkanliKareler, setImkanliKareler] = useState<string[]>([]);
  const [oyunDurumu, setOyunDurumu] = useState("Sıra Sende (Beyaz Taşlar)");

  useEffect(() => {
    const yeniOyun = new Chess();
    setOyun(yeniOyun);
    setFen(yeniOyun.fen());
  }, []);

  function botuKonustur(metin: string) {
    setBotMesaji(metin);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const ses = new SpeechSynthesisUtterance(metin);
      ses.lang = "tr-TR";
      ses.rate = 0.95;
      window.speechSynthesis.speak(ses);
    }
  }

  // Kareye tıklama ve yasal hamle yapma mantığı
  function handleKareTikla(kareAdi: string) {
    if (!oyun || oyun.isGameOver()) return;

    // Eğer kendi taşına tıkladıysa seç
    if (secilenKare === null) {
      const tas = oyun.get(kareAdi as any);
      if (tas && tas.color === "w") { // Sadece Beyaz taşlar (Kullanıcı)
        setSecilenKare(kareAdi);
        const hamleler = oyun.moves({ square: kareAdi as any, verbose: true });
        setImkanliKareler(hamleler.map((h) => h.to));
        botuKonustur("Güzel bir taş seçtin, nereye oynamak istersin?");
      }
    } else {
      // Daha önce taş seçilmişse hamle yapmayı dene
      try {
        const hamle = oyun.move({
          from: secilenKare,
          to: kareAdi,
          promotion: "q", // Piyon çıkınca otomatik vezir yap
        });

        if (hamle) {
          // Hamle geçerliyse tahtayı güncelle
          setFen(oyun.fen());
          setSecilenKare(null);
          setImkanliKareler([]);

          if (oyun.isGameOver()) {
            setOyunDurumu("Oyun Bitti!");
            botuKonustur("Tebrikler şampiyon, oyunu tamamladın! 🏆");
            return;
          }

          // Botun sırası
          setOyunDurumu("Bot düşünüyor... 🤔");
          botuKonustur("Güzel hamle! Şimdi sıra bende, en iyi hamleyi hesaplıyorum.");

          setTimeout(() => {
            botHamlesiYap(oyun);
          }, 1000);
        } else {
          // Geçersiz hamleyse ve yeni kendi taşını seçtiyse onu seç
          const tas = oyun.get(kareAdi as any);
          if (tas && tas.color === "w") {
            setSecilenKare(kareAdi);
            const hamleler = oyun.moves({ square: kareAdi as any, verbose: true });
            setImkanliKareler(hamleler.map((h) => h.to));
          } else {
            setSecilenKare(null);
            setImkanliKareler([]);
          }
        }
      } catch {
        setSecilenKare(null);
        setImkanliKareler([]);
      }
    }
  }

  // Botun yasal hamle üretmesi
  function botHamlesiYap(guncelOyun: Chess) {
    if (guncelOyun.isGameOver()) return;

    const yasalHamleler = guncelOyun.moves({ verbose: true });
    if (yasalHamleler.length === 0) return;

    let secilenHamle = yasalHamleler[0];

    if (zorluk === "kolay") {
      // Rastgele yasal hamle
      secilenHamle = yasalHamleler[Math.floor(Math.random() * yasalHamleler.length)];
      botuKonustur("Piyonumu veya taşımı sürdüm! Bakalım ne yapacaksın? 😊");
    } else if (zorluk === "orta") {
      // Taş alma öncelikli akıllı hamle
      const tasAlanlar = yasalHamleler.filter((h) => h.captured);
      if (tasAlanlar.length > 0) {
        secilenHamle = tasAlanlar[Math.floor(Math.random() * tasAlanlar.length)];
        botuKonustur("Dikkat et, taşını yakaladım! 🔥");
      } else {
        secilenHamle = yasalHamleler[Math.floor(Math.random() * yasalHamleler.length)];
        botuKonustur("Orta modda merkezi ele geçiriyorum! 🤔");
      }
    } else {
      // Zor mod: Şah çekme veya taş alma öncelikli usta hamle
      const sahCekenler = yasalHandanBul(yasalHamleler);
      secilenHamle = sahCekenler || yasalHamleler[Math.floor(Math.random() * yasalHamleler.length)];
      botuKonustur("Zor modda ustaca bir hamle yaptım, sıkı dur! 👑");
    }

    guncelOyun.move(secilenHamle);
    setFen(guncelOyun.fen());
    setOyunDurumu("Sıra Sende (Beyaz Taşlar)");
  }

  function yasalHandanBul(hamleler: any[]) {
    const matEden = hamleler.find((h) => h.san.includes("#"));
    if (matEden) return matEden;
    const sahCeken = hamleler.find((h) => h.san.includes("+"));
    if (sahCeken) return sahCeken;
    const tasAlan = hamleler.find((h) => h.captured);
    if (tasAlan) return tasAlan;
    return null;
  }

  // FEN dizilimini 8x8 matrise çevirme
  function fenToBoard(fenStr: string) {
    const fenParca = fenStr.split(" ")[0];
    const satirlar = fenParca.split("/");
    return satirlar.map((satir) => {
      let sonuc: string[] = [];
      for (const karakter of satir) {
        if (!isNaN(Number(karakter))) {
          for (let i = 0; i < Number(karakter); i++) sonuc.push(".");
        } else {
          sonuc.push(karakter);
        }
      }
      return sonuc;
    });
  }

  function tasGoster(kod: string) {
    const taslar: Record<string, string> = {
      r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
      R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"
    };
    return taslar[kod] || "";
  }

  const tahtaMatris = fenToBoard(fen);
  const dosyalar = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div
      style={{
        maxWidth: "680px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #f59e0b",
        boxShadow: "0 10px 30px rgba(245, 158, 11, 0.1)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "40px" }}>🤖♟️</span>
      <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#b45309", margin: "4px 0" }}>
        Akıllı Satranç Botu Arenası (Lichess Stil)
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px 0" }}>
        Gerçek kurallara uygun, imkanlı hamleler yapan ve sesli koçluk sunan akıllı bot rakip!
      </p>

      {/* Zorluk Seviyesi */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "14px" }}>
        <button
          type="button"
          onClick={() => { setZorluk("kolay"); botuKonustur("Kolay moda geçtik!"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "kolay" ? "#22c55e" : "#f1f5f9", color: zorluk === "kolay" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🟢 Kolay
        </button>
        <button
          type="button"
          onClick={() => { setZorluk("orta"); botuKonustur("Orta moda geçtik!"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "orta" ? "#f59e0b" : "#f1f5f9", color: zorluk === "orta" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🟡 Orta
        </button>
        <button
          type="button"
          onClick={() => { setZorluk("zor"); botuKonustur("Zor moda geçtik!"); }}
          style={{ padding: "6px 12px", backgroundColor: zorluk === "zor" ? "#ef4444" : "#f1f5f9", color: zorluk === "zor" ? "#ffffff" : "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🔴 Zor (Usta)
        </button>
      </div>

      {/* Bot Konuşma Balonu */}
      <div
        style={{
          backgroundColor: "#fffbeb",
          border: "2px solid #fde68a",
          borderRadius: "14px",
          padding: "12px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "28px" }}>🤖</span>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "900", color: "#d97706" }}>BOT KOÇ ({zorluk.toUpperCase()}):</div>
          <p style={{ fontSize: "12px", fontWeight: "bold", color: "#78350f", margin: 0 }}>
            "{botMesaji}"
          </p>
        </div>
      </div>

      <div style={{ fontSize: "13px", fontWeight: "900", color: "#b45309", marginBottom: "10px" }}>
        Durum: {oyunDurumu}
      </div>

      {/* LICHESS TARZI KOORDİNATLI SATRANÇ TAHTASI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          width: "360px",
          height: "360px",
          margin: "0 auto 16px auto",
          border: "4px solid #57402c",
          borderRadius: "6px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        }}
      >
        {tahtaMatris.map((satir, r) =>
          satir.map((tas, c) => {
            const dosyaHarfi = dosyalar[c];
            const siraSayisi = 8 - r;
            const kareAdi = `${dosyaHarfi}${siraSayisi}`;

            const beyazKare = (r + c) % 2 === 0;
            const secili = secilenKare === kareAdi;
            const hedefteMi = imkanliKareler.includes(kareAdi);

            let arkaplan = beyazKare ? "#ebecd0" : "#739552"; // Lichess klasik yeşil tema
            if (secili) arkaplan = "#baca2b";
            else if (hedefteMi) arkaplan = beyazKare ? "#f5f682" : "#98b14e";

            return (
              <div
                key={kareAdi}
                onClick={() => handleKareTikla(kareAdi)}
                style={{
                  backgroundColor: arkaplan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  cursor: "pointer",
                  position: "relative",
                  userSelect: "none",
                }}
              >
                {/* Hamle yapılabilecek karelerde küçük nokta işareti */}
                {hedefteMi && tas === "." && (
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "50%",
                      position: "absolute",
                    }}
                  />
                )}
                {tasGoster(tas)}
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Link
          href="/dersler"
          style={{ padding: "8px 14px", backgroundColor: "#0284c7", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}
        >
          🎓 Dersler
        </Link>
        <Link
          href="/tahta-yapici"
          style={{ padding: "8px 14px", backgroundColor: "#d97706", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}
        >
          🛠️ Tahta Yapıcı
        </Link>
      </div>
    </div>
  );
}
