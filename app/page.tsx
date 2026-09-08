"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Chess } from "chess.js";

type TakimTipi = "gs" | "fb" | "bjk";

export default function BotOyunuPage() {
  const [oyun, setOyun] = useState<Chess | null>(null);
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [zorluk, setZorluk] = useState<"kolay" | "orta" | "zor">("kolay");
  const [botMesaji, setBotMesaji] = useState("Süper Lig derbisi başladı! Takımını seç, sahada formaları konuşturup golleri atalım! ⚽🏟️");
  const [secilenKare, setSecilenKare] = useState<string | null>(null);
  const [imkanliKareler, setImkanliKareler] = useState<string[]>([]);
  const [oyunDurumu, setOyunDurumu] = useState("Sıra Sende (Senin Takımın)");

  const [benimTakimim, setBenimTakimim] = useState<TakimTipi>("gs");
  const [rakipTakim, setRakipTakim] = useState<TakimTipi>("fb");

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
        botuKonustur("Harika bir oyuncu seçtin, rakip kaleye yüklenelim!");
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
            setOyunDurumu("Maç Bitti, Muhteşem Zafer!");
            botuKonustur("Maçı kazandın, harika bir derbi performansı! 🏆⚽");
            return;
          }

          degerlendirHamle(hamleObj);
          setOyunDurumu("Rakip takım hücumda... 🤔");

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
      botuKonustur("Müthiş bir çalım ve rakip oyuncu geçildi! Gol sesi geliyor! ⚽🔥");
    } else if (hamle.san.includes("+")) {
      botuKonustur("Tehlikeli atak! Rakip kaleciye zor anlar yaşatıyorsun! ⚡");
    } else if (["d4", "e4", "d5", "e5"].includes(hamle.to)) {
      botuKonustur("Orta sahanın hâkimi oldun, pas trafiği harika! 🎯");
    } else {
      botuKonustur("Taktiksel ve şık bir pas, oyunu domine ediyorsun!");
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
    setOyunDurumu("Sıra Sende (Senin Takımın)");
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

  // Futbol ve Takım Temalı Taş Setleri (Kaleci, Forvet, Kaptan Forması vb.)
  function tasGoster(kod: string) {
    const isWhite = kod === kod.toUpperCase();
    const aktifTakim = isWhite ? benimTakimim : rakipTakim;

    if (aktifTakim === "gs") {
      // Galatasaray: Aslan, Sarı-Kırmızı Formalar ve Taçlı Kaptan
      const gsSeti: Record<string, string> = {
        r: "🔴👕", n: "🔴👟", b: "🔴🦁", q: "🟡⭐", k: "🦁", p: "🔴⚽",
        R: "🟡👕", N: "🟡👟", B: "🟡🦁", Q: "🟡👑", K: "👑", P: "🟡⚽"
      };
      return gsSeti[kod] || "";
    } else if (aktifTakim === "fb") {
      // Fenerbahçe: Kanarya, Sarı-Lacivert Formalar
      const fbSeti: Record<string, string> = {
        r: "🔵👕", n: "🔵👟", b: "🔵🦅", q: "🟡⭐", k: "💛", p: "🔵⚽",
        R: "🟡👕", N: "🟡👟", B: "🟡🦅", Q: "🟡👑", K: "👑", P: "🟡⚽"
      };
      return fbSeti[kod] || "";
    } else {
      // Beşiktaş: Kartal, Siyah-Beyaz Formalar
      const bjkSeti: Record<string, string> = {
        r: "⚫👕", n: "⚫👟", b: "⚫🦅", q: "⚪⭐", k: "🦅", p: "⚫⚽",
        R: "⚪👕", N: "⚪👟", B: "⚪🦅", Q: "⚪👑", K: "👑", P: "⚪⚽"
      };
      return bjkSeti[kod] || "";
    }
  }

  function renkSec(beyazKare: boolean) {
    if (benimTakimim === "gs") return beyazKare ? "#fef08a" : "#991b1b";
    if (benimTakimim === "fb") return beyazKare ? "#fef08a" : "#1e3a8a";
    return beyazKare ? "#f1f5f9" : "#18181b"; // BJK Siyah-Beyaz
  }

  const tahtaMatris = fenToBoard(fen);
  const dosyalar = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div
      style={{
        maxWidth: "720px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #3b82f6",
        boxShadow: "0 10px 30px rgba(59, 130, 246, 0.15)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "40px" }}>⚽🏟️</span>
      <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#1e3a8a", margin: "4px 0" }}>
        Süper Lig Derbi Satranç Arenası
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px 0" }}>
        Formanı ve futbolcu taşlarını seç, sahada maçı domine et!
      </p>

      {/* TAKIM SEÇİM PANELİ */}
      <div style={{ backgroundColor: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "16px", padding: "12px", marginBottom: "14px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "950", color: "#1e3a8a", marginBottom: "4px" }}>⭐ SENİN TAKIMIN</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button type="button" onClick={() => setBenimTakimim("gs")} style={{ padding: "4px 8px", backgroundColor: benimTakimim === "gs" ? "#991b1b" : "#e2e8f0", color: benimTakimim === "gs" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Galatasaray</button>
            <button type="button" onClick={() => setBenimTakimim("fb")} style={{ padding: "4px 8px", backgroundColor: benimTakimim === "fb" ? "#1e3a8a" : "#e2e8f0", color: benimTakimim === "fb" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Fenerbahçe</button>
            <button type="button" onClick={() => setBenimTakimim("bjk")} style={{ padding: "4px 8px", backgroundColor: benimTakimim === "bjk" ? "#18181b" : "#e2e8f0", color: benimTakimim === "bjk" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Beşiktaş</button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "10px", fontWeight: "950", color: "#b91c1c", marginBottom: "4px" }}>🛡️ RAKİP TAKIM</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button type="button" onClick={() => setRakipTakim("gs")} style={{ padding: "4px 8px", backgroundColor: rakipTakim === "gs" ? "#991b1b" : "#e2e8f0", color: rakipTakim === "gs" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Galatasaray</button>
            <button type="button" onClick={() => setRakipTakim("fb")} style={{ padding: "4px 8px", backgroundColor: rakipTakim === "fb" ? "#1e3a8a" : "#e2e8f0", color: rakipTakim === "fb" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Fenerbahçe</button>
            <button type="button" onClick={() => setRakipTakim("bjk")} style={{ padding: "4px 8px", backgroundColor: rakipTakim === "bjk" ? "#18181b" : "#e2e8f0", color: rakipTakim === "bjk" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Beşiktaş</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
        <button type="button" onClick={() => { setZorluk("kolay"); botuKonustur("Kolay mod aktif, bol şans!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "kolay" ? "#22c55e" : "#f1f5f9", color: zorluk === "kolay" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🟢 Kolay</button>
        <button type="button" onClick={() => { setZorluk("orta"); botuKonustur("Orta mod aktif!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "orta" ? "#f59e0b" : "#f1f5f9", color: zorluk === "orta" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🟡 Orta</button>
        <button type="button" onClick={() => { setZorluk("zor"); botuKonustur("Zor mod aktif, kıran kırana derbi başlıyor!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "zor" ? "#ef4444" : "#f1f5f9", color: zorluk === "zor" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🔴 Zor</button>
      </div>

      <div style={{ backgroundColor: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: "12px", padding: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
        <span style={{ fontSize: "24px" }}>🎙️</span>
        <div>
          <div style={{ fontSize: "9px", fontWeight: "900", color: "#166534" }}>MAÇ SÜSPİKERİ:</div>
          <p style={{ fontSize: "11px", fontWeight: "bold", color: "#14532d", mark: 0 }}>"{botMesaji}"</p>
        </div>
      </div>

      <div style={{ fontSize: "12px", fontWeight: "900", color: "#1e3a8a", marginBottom: "8px" }}>{oyunDurumu}</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "370px",
          height: "370px",
          margin: "0 auto 16px auto",
          border: "4px solid #1e3a8a",
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
            else if (hedefteMi) arkaplan = beyazKare ? "#bae6fd" : "#3b82f6";

            return (
              <div
                key={kareAdi}
                onClick={() => handleKareTikla(kareAdi)}
                style={{
                  backgroundColor: arkaplan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
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
        <Link href="/dersler" style={{ padding: "8px 14px", backgroundColor: "#1e3a8a", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}>🎓 Dersler</Link>
        <Link href="/tahtayapici" style={{ padding: "8px 14px", backgroundColor: "#0284c7", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}>🛠️ Tahta Yapıcı</Link>
      </div>
    </div>
  );
}

const dosyalar = ["a", "b", "c", "d", "e", "f", "g", "h"];
