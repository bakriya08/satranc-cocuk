"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Chess } from "chess.js";

const dosyalar = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function BotOyunuPage() {
  const [oyun, setOyun] = useState<Chess | null>(null);
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [zorluk, setZorluk] = useState<"kolay" | "orta" | "zor">("kolay");
  const [botMesaji, setBotMesaji] = useState("Cimbom şampiyonluk yolunda! Galatasaray taş setini seçtin, maçı alalım aslanlar! 🦁🟡🔴");
  const [secilenKare, setSecilenKare] = useState<string | null>(null);
  const [imkanliKareler, setImkanliKareler] = useState<string[]>([]);
  const [oyunDurumu, setOyunDurumu] = useState("Sıra Sende (Beyaz Taşlar)");

  const [tahtaTema, setTahtaTema] = useState<"yesil" | "ahsap" | "mavi" | "mor" | "galatasaray">("galatasaray");
  const [tasStili, setTasStili] = useState<"klasik" | "emoji" | "harf" | "gs">("gs");

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

  function handleKareTikla(kareAdi: string) {
    if (!oyun || oyun.isGameOver()) return;

    if (secilenKare === null) {
      const tas = oyun.get(kareAdi as any);
      if (tas && tas.color === "w") {
        setSecilenKare(kareAdi);
        const hamleler = oyun.moves({ square: kareAdi as any, verbose: true });
        setImkanliKareler(hamleler.map((h) => h.to));
        botuKonustur("Harika bir Galatasaray taşı seçtin, hedefe yürüyelim!");
      }
    } else {
      try {
        const hamleObj = oyun.moves({ square: secilenKare as any, verbose: true }).find((h) => h.to === kareAdi);
        
        const hamle = oyun.move({
          from: secilenKare,
          to: kareAdi,
          promotion: "q",
        });

        if (hamle) {
          setFen(oyun.fen());
          setSecilenKare(null);
          setImkanliKareler([]);

          if (oyun.isGameOver()) {
            setOyunDurumu("Oyun Bitti!");
            botuKonustur("Şampiyon Galatasaray! Muazzam bir zafer elde ettin! 🏆💛❤️");
            return;
          }

          degerlendirHamle(hamleObj);
          setOyunDurumu("Bot düşünüyor... 🤔");

          setTimeout(() => {
            botHamlesiYap(oyun);
          }, 1400);
        } else {
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

  function degerlendirHamle(hamle: any) {
    if (!hamle) return;

    if (hamle.captured) {
      botuKonustur("Aslanlar gibi kaptın rakibin taşını! Gol sesini duyuyorum! 🦁⚽");
    } else if (hamle.san.includes("+")) {
      botuKonustur("Müthiş! Rakip kaleye şah çekip tehlike yarattın! 🔥");
    } else if (["d4", "e4", "d5", "e5"].includes(hamle.to)) {
      botuKonustur("Sahanın ortasını sarı-kırmızı bayrakla donattın, süper merkez kontrolü! 💛❤️");
    } else {
      botuKonustur("Taktiksel ve şık bir hamle, oyunu domine ediyorsun!");
    }
  }

  function botHamlesiYap(guncelOyun: Chess) {
    if (guncelOyun.isGameOver()) return;

    const yasalHamleler = guncelOyun.moves({ verbose: true });
    if (yasalHamleler.length === 0) return;

    let secilenHamle = yasalHamleler[Math.floor(Math.random() * yasalHamleler.length)];

    if (zorluk === "orta") {
      const tasAlanlar = yasalHamleler.filter((h) => h.captured);
      if (tasAlanlar.length > 0) {
        secilenHamle = tasAlanlar[Math.floor(Math.random() * tasAlanlar.length)];
      }
    } else if (zorluk === "zor") {
      const matEden = yasalHamleler.find((h) => h.san.includes("#"));
      const sahCeken = yasalHamleler.find((h) => h.san.includes("+"));
      const tasAlan = yasalHamleler.find((h) => h.captured);
      secilenHamle = matEden || sahCeken || tasAlan || secilenHamle;
    }

    guncelOyun.move(secilenHamle);
    setFen(guncelOyun.fen());
    setOyunDurumu("Sıra Sende (Galatasaray Taşları)");
  }

  function fenToBoard(fenStr: string) {
    const fenParca = fenStr.split(" ")[0];
    const satirlar = fenParca.split("/");
    return satirlar.map((satir) => {
      const sonuc: string[] = [];
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
    if (tasStili === "gs") {
      const gsSeti: Record<string, string> = {
        r: "🔴🏰", n: "🔴🐎", b: "🔴🦁", q: "🔴👑", k: "🦁", p: "🔴",
        R: "🟡🏰", N: "🟡🐎", B: "🟡🦁", Q: "🟡👑", K: "👑", P: "🟡"
      };
      return gsSeti[kod] || "";
    } else if (tasStili === "klasik") {
      const taslar: Record<string, string> = {
        r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
        R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"
      };
      return taslar[kod] || "";
    } else if (tasStili === "emoji") {
      const emojiler: Record<string, string> = {
        r: "🏰", n: "🐴", b: "🐘", q: "👸", k: "🤴", p: "♟️",
        R: "🏰", N: "🦄", B: "🧙‍♂️", Q: "👑", K: "🤴", P: "⭐"
      };
      return emojiler[kod] || "";
    } else {
      return kod.toUpperCase();
    }
  }

  function renkSec(beyazKare: boolean) {
    if (tahtaTema === "galatasaray") return beyazKare ? "#fef08a" : "#991b1b";
    if (tahtaTema === "ahsap") return beyazKare ? "#e3c16f" : "#b88b4a";
    if (tahtaTema === "mavi") return beyazKare ? "#dee3e6" : "#4a7a96";
    if (tahtaTema === "mor") return beyazKare ? "#f3e8ff" : "#7c3aed";
    return beyazKare ? "#ebecd0" : "#739552";
  }

  const tahtaMatris = fenToBoard(fen);

  return (
    <div
      style={{
        maxWidth: "720px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #b91c1c",
        boxShadow: "0 10px 30px rgba(185, 28, 28, 0.15)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "40px" }}>🦁🟡🔴</span>
      <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#991b1b", margin: "4px 0" }}>
        Galatasaray Satranç Koçu & Bot Arenası
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px 0" }}>
        Sarı-kırmızı ruhu tahtaya taşıyın, Cimbom taş setiyle zekanızı konuşturun!
      </p>

      <div style={{ backgroundColor: "#fef2f2", border: "2px solid #fecaca", borderRadius: "16px", padding: "12px", marginBottom: "14px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "950", color: "#991b1b", marginBottom: "4px" }}>🏟️ TAHTA TEMA</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button type="button" onClick={() => setTahtaTema("galatasaray")} style={{ padding: "4px 8px", backgroundColor: tahtaTema === "galatasaray" ? "#991b1b" : "#f1f5f9", color: tahtaTema === "galatasaray" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Galatasaray</button>
            <button type="button" onClick={() => setTahtaTema("yesil")} style={{ padding: "4px 8px", backgroundColor: tahtaTema === "yesil" ? "#739552" : "#f1f5f9", color: tahtaTema === "yesil" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Yeşil</button>
            <button type="button" onClick={() => setTahtaTema("ahsap")} style={{ padding: "4px 8px", backgroundColor: tahtaTema === "ahsap" ? "#b88b4a" : "#f1f5f9", color: tahtaTema === "ahsap" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Ahşap</button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "10px", fontWeight: "950", color: "#991b1b", marginBottom: "4px" }}>🦁 TAŞ STİLİ</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button type="button" onClick={() => setTasStili("gs")} style={{ padding: "4px 8px", backgroundColor: tasStili === "gs" ? "#b91c1c" : "#f1f5f9", color: tasStili === "gs" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Galatasaray 🦁</button>
            <button type="button" onClick={() => setTasStili("klasik")} style={{ padding: "4px 8px", backgroundColor: tasStili === "klasik" ? "#b91c1c" : "#f1f5f9", color: tasStili === "klasik" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Klasik</button>
            <button type="button" onClick={() => setTasStili("emoji")} style={{ padding: "4px 8px", backgroundColor: tasStili === "emoji" ? "#b91c1c" : "#f1f5f9", color: tasStili === "emoji" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Emoji</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
        <button type="button" onClick={() => { setZorluk("kolay"); botuKonustur("Kolay mod aktif, bol şans Cimbomlu!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "kolay" ? "#22c55e" : "#f1f5f9", color: zorluk === "kolay" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🟢 Kolay</button>
        <button type="button" onClick={() => { setZorluk("orta"); botuKonustur("Orta mod aktif!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "orta" ? "#f59e0b" : "#f1f5f9", color: zorluk === "orta" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🟡 Orta</button>
        <button type="button" onClick={() => { setZorluk("zor"); botuKonustur("Zor mod aktif, usta aslanlar sahada!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "zor" ? "#ef4444" : "#f1f5f9", color: zorluk === "zor" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🔴 Zor</button>
      </div>

      <div style={{ backgroundColor: "#fef2f2", border: "2px solid #fecaca", borderRadius: "12px", padding: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
        <span style={{ fontSize: "24px" }}>🦁</span>
        <div>
          <div style={{ fontSize: "9px", fontWeight: "900", color: "#991b1b" }}>CİMBOM KOÇ:</div>
          <p style={{ fontSize: "11px", fontWeight: "bold", color: "#7f1d1d", margin: 0 }}>"{botMesaji}"</p>
        </div>
      </div>

      <div style={{ fontSize: "12px", fontWeight: "900", color: "#991b1b", marginBottom: "8px" }}>{oyunDurumu}</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "370px",
          height: "370px",
          margin: "0 auto 16px auto",
          border: "4px solid #7f1d1d",
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

            let arkaplan = renkSec(beyazKare);
            if (secili) arkaplan = "#fde047";
            else if (hedefteMi) arkaplan = beyazKare ? "#fef08a" : "#b91c1c";

            return (
              <div
                key={kareAdi}
                onClick={() => handleKareTikla(kareAdi)}
                style={{
                  backgroundColor: arkaplan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: tasStili === "gs" ? "24px" : "34px",
                  cursor: "pointer",
                  position: "relative",
                  userSelect: "none",
                  width: "100%",
                  height: "100%",
                  fontWeight: "bold",
                }}
              >
                {hedefteMi && tas === "." && (
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
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
        <Link href="/dersler" style={{ padding: "8px 14px", backgroundColor: "#991b1b", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}>🎓 Dersler</Link>
        <Link href="/tahtayapici" style={{ padding: "8px 14px", backgroundColor: "#b45309", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}>🛠️ Tahta Yapıcı</Link>
      </div>
    </div>
  );
}
